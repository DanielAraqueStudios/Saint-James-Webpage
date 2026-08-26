import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { pool } from "../db/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const dir = path.join(process.cwd(), "uploads", "producers", req.params.slug);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});

// Support the common web image formats so admins aren't blocked by whatever
// format their photo export happens to be in.
const ALLOWED_IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg", ".bmp", ".tiff", ".tif"];

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_IMAGE_EXTS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${ALLOWED_IMAGE_EXTS.join(", ")} files are allowed`));
    }
  },
});

const PRODUCER_COLUMNS = "slug, name, full_name, role, image_url, bio, whatsapp_number, calendar_url";

// Defense in depth against the client sending something like a pasted title
// plus link ("Santi's Calendar https://…") as calendar_url: pull out just
// the URL. Returns `undefined` (field omitted), `null` (explicitly cleared),
// or `{ error }` when given text that isn't/doesn't contain an absolute
// http(s) link, so a bad value can never silently become a broken relative
// path — the request is rejected instead.
function normalizeUrl(value: string | null | undefined): string | null | { error: string } | undefined {
  if (value === undefined) return undefined;
  if (!value || !value.trim()) return null;
  const match = value.match(/https?:\/\/\S+/i);
  const candidate = (match ? match[0] : value).trim();
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { error: "calendar_url must be an http:// or https:// link" };
    }
    return candidate;
  } catch {
    return { error: "calendar_url must be a valid http:// or https:// link" };
  }
}

router.get("/", async (_req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT ${PRODUCER_COLUMNS} FROM producers ORDER BY slug`
  );
  res.json(result.rows);
});

router.get("/:slug", async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT ${PRODUCER_COLUMNS} FROM producers WHERE slug = $1`,
    [req.params.slug]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Producer not found" });
    return;
  }
  res.json(result.rows[0]);
});

router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const { slug, name, full_name, role, image_url, bio, whatsapp_number, calendar_url } = req.body as {
    slug?: string;
    name?: string;
    full_name?: string;
    role?: string;
    image_url?: string;
    bio?: string[];
    whatsapp_number?: string;
    calendar_url?: string;
  };

  if (!slug || !name || !full_name || !role) {
    res.status(400).json({ error: "slug, name, full_name and role are required" });
    return;
  }

  const safeSlug = slug.trim().toLowerCase();

  const normalizedCalendar = normalizeUrl(calendar_url);
  if (normalizedCalendar && typeof normalizedCalendar === "object") {
    res.status(400).json({ error: normalizedCalendar.error });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO producers (slug, name, full_name, role, image_url, bio, whatsapp_number, calendar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING ${PRODUCER_COLUMNS}`,
      [
        safeSlug,
        name,
        full_name,
        role,
        image_url || "",
        bio && bio.length > 0 ? bio : [],
        whatsapp_number || null,
        normalizedCalendar || null,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err instanceof Error && "code" in err && (err as { code?: string }).code === "23505") {
      res.status(409).json({ error: "A producer with that slug already exists" });
      return;
    }
    throw err;
  }
});

router.put("/:slug", requireAuth, async (req: AuthRequest, res: Response) => {
  const { name, full_name, role, image_url, bio, whatsapp_number, calendar_url } = req.body as {
    name?: string;
    full_name?: string;
    role?: string;
    image_url?: string;
    bio?: string[];
    whatsapp_number?: string | null;
    calendar_url?: string | null;
  };

  // whatsapp_number/calendar_url are nullable and clearable: distinguish
  // "field omitted" (leave alone) from "explicitly set to empty" (clear it).
  const whatsappProvided = "whatsapp_number" in req.body;
  const calendarProvided = "calendar_url" in req.body;
  const normalizedWhatsapp = whatsapp_number && whatsapp_number.trim() ? whatsapp_number.trim() : null;

  const normalizedCalendarResult = normalizeUrl(calendar_url);
  if (normalizedCalendarResult && typeof normalizedCalendarResult === "object") {
    res.status(400).json({ error: normalizedCalendarResult.error });
    return;
  }
  const normalizedCalendar = normalizedCalendarResult ?? null;

  const result = await pool.query(
    `UPDATE producers
     SET name = COALESCE($1, name),
         full_name = COALESCE($2, full_name),
         role = COALESCE($3, role),
         image_url = COALESCE($4, image_url),
         bio = COALESCE($5, bio),
         whatsapp_number = CASE WHEN $6 THEN $7 ELSE whatsapp_number END,
         calendar_url = CASE WHEN $8 THEN $9 ELSE calendar_url END
     WHERE slug = $10
     RETURNING ${PRODUCER_COLUMNS}`,
    [
      name,
      full_name,
      role,
      image_url,
      bio,
      whatsappProvided,
      normalizedWhatsapp,
      calendarProvided,
      normalizedCalendar,
      req.params.slug,
    ]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: "Producer not found" });
    return;
  }
  res.json(result.rows[0]);
});

router.delete("/:slug", requireAuth, async (req: AuthRequest, res: Response) => {
  const result = await pool.query(
    "DELETE FROM producers WHERE slug = $1 RETURNING slug",
    [req.params.slug]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: "Producer not found" });
    return;
  }

  // Tracks are removed by ON DELETE CASCADE; clean up the producer's files too.
  const imageDir = path.join(process.cwd(), "uploads", "producers", req.params.slug);
  const tracksDir = path.join(process.cwd(), "uploads", req.params.slug);
  for (const dir of [imageDir, tracksDir]) {
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  }

  res.json({ deleted: true });
});

router.post(
  "/:slug/image",
  requireAuth,
  upload.single("image"),
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "image file is required" });
      return;
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/producers/${req.params.slug}/${req.file.filename}`;

    const result = await pool.query(
      `UPDATE producers SET image_url = $1 WHERE slug = $2 RETURNING *`,
      [imageUrl, req.params.slug]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Producer not found" });
      return;
    }
    res.json(result.rows[0]);
  }
);

export default router;
