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

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, .png, .webp and .gif files are allowed"));
    }
  },
});

router.get("/", async (_req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT slug, name, full_name, role, image_url, bio FROM producers ORDER BY slug"
  );
  res.json(result.rows);
});

router.get("/:slug", async (req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT slug, name, full_name, role, image_url, bio FROM producers WHERE slug = $1",
    [req.params.slug]
  );
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Producer not found" });
    return;
  }
  res.json(result.rows[0]);
});

router.put("/:slug", requireAuth, async (req: AuthRequest, res: Response) => {
  const { name, full_name, role, image_url, bio } = req.body as {
    name?: string;
    full_name?: string;
    role?: string;
    image_url?: string;
    bio?: string[];
  };

  const result = await pool.query(
    `UPDATE producers
     SET name = COALESCE($1, name),
         full_name = COALESCE($2, full_name),
         role = COALESCE($3, role),
         image_url = COALESCE($4, image_url),
         bio = COALESCE($5, bio)
     WHERE slug = $6
     RETURNING *`,
    [name, full_name, role, image_url, bio, req.params.slug]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: "Producer not found" });
    return;
  }
  res.json(result.rows[0]);
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
