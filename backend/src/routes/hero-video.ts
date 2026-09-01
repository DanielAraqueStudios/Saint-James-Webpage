import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { pool } from "../db/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(process.cwd(), "uploads", "hero");
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
  limits: { fileSize: 300 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".mp4", ".mov"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .mp4 and .mov files are allowed"));
    }
  },
});

router.get("/", async (_req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT video_url, format, muted, volume, updated_at FROM hero_video WHERE id = 1"
  );
  res.json(result.rows[0] || null);
});

// Sound settings only — kept separate from the multipart upload route below
// so the admin can adjust mute/volume without re-uploading the file.
router.patch("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const { muted, volume } = req.body as { muted?: boolean; volume?: number };

  if (muted === undefined && volume === undefined) {
    res.status(400).json({ error: "muted and/or volume is required" });
    return;
  }
  if (volume !== undefined && (typeof volume !== "number" || volume < 0 || volume > 1)) {
    res.status(400).json({ error: "volume must be a number between 0 and 1" });
    return;
  }

  const result = await pool.query(
    `UPDATE hero_video
     SET muted = COALESCE($1, muted),
         volume = COALESCE($2, volume)
     WHERE id = 1
     RETURNING video_url, format, muted, volume, updated_at`,
    [muted ?? null, volume ?? null]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: "No hero video set" });
    return;
  }
  res.json(result.rows[0]);
});

router.post("/", requireAuth, (req: AuthRequest, res: Response, next) => {
  upload.single("file")(req, res, (err: unknown) => {
    if (err) {
      // On error, multer/busboy may have stopped reading partway through the
      // upload. Draining the rest of the incoming body prevents the socket
      // from hanging/resetting, which otherwise can take out the whole server.
      req.resume();
    }
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ error: "File is too large. Maximum size is 300MB." });
        return;
      }
      res.status(400).json({ error: err.message });
      return;
    }
    if (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed" });
      return;
    }
    next();
  });
}, async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "file is required" });
    return;
  }

  const existing = await pool.query("SELECT video_url FROM hero_video WHERE id = 1");
  const oldUrl = existing.rows[0]?.video_url as string | undefined;

  const format = path.extname(req.file.originalname).toLowerCase().slice(1);
  const videoUrl = `${req.protocol}://${req.get("host")}/uploads/hero/${req.file.filename}`;

  const result = await pool.query(
    `INSERT INTO hero_video (id, video_url, format, updated_at)
     VALUES (1, $1, $2, now())
     ON CONFLICT (id) DO UPDATE SET video_url = $1, format = $2, updated_at = now()
     RETURNING *`,
    [videoUrl, format]
  );

  if (oldUrl && oldUrl.includes("/uploads/hero/")) {
    const oldFilename = oldUrl.split("/uploads/hero/")[1];
    const oldPath = path.join(process.cwd(), "uploads", "hero", oldFilename);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  res.json(result.rows[0]);
});

export default router;
