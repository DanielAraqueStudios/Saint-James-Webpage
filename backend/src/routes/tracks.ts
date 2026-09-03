import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { execFile } from "child_process";
import { pool } from "../db/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

// Trims an audio file in place using ffmpeg: re-encodes [start, end] (seconds)
// to a temp file, then swaps it in over the original path. Re-encoding (not
// stream copy) keeps the cut sample-accurate regardless of keyframe spacing.
function trimAudioFile(filePath: string, start: number, end: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const ext = path.extname(filePath); // includes the dot, e.g. ".mp3"
    const codec = ext === ".mp3" ? "libmp3lame" : "pcm_s16le";
    const tempPath = `${filePath}.trim${ext}`;

    execFile(
      "ffmpeg",
      [
        "-y",
        "-i", filePath,
        "-ss", start.toString(),
        "-to", end.toString(),
        "-c:a", codec,
        ...(ext === ".mp3" ? ["-q:a", "2"] : []),
        tempPath,
      ],
      (err) => {
        if (err) {
          fs.rm(tempPath, { force: true }, () => {});
          reject(err);
          return;
        }
        fs.rename(tempPath, filePath, (renameErr) => {
          if (renameErr) reject(renameErr);
          else resolve();
        });
      }
    );
  });
}

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const producerSlug = (req.body as { producer_slug?: string }).producer_slug || "unknown";
    const dir = path.join(process.cwd(), "uploads", producerSlug);
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
    const allowed = [".wav", ".mp3"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .wav and .mp3 files are allowed"));
    }
  },
});

router.get("/", async (req: Request, res: Response) => {
  const { producer, category } = req.query as { producer?: string; category?: string };
  let query = "SELECT * FROM tracks";
  const params: string[] = [];
  const conditions: string[] = [];

  if (producer) {
    params.push(producer);
    conditions.push(`producer_slug = $${params.length}`);
  }
  if (category === "Other") {
    conditions.push(`category IS NULL`);
  } else if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
  if (conditions.length > 0) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY created_at DESC";

  const result = await pool.query(query, params);
  res.json(result.rows);
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
  const { title, category, producer_slug, trim_start, trim_end } = req.body as {
    title?: string;
    category?: string;
    producer_slug?: string;
    trim_start?: string;
    trim_end?: string;
  };

  if (!title || !producer_slug || !req.file) {
    res.status(400).json({ error: "title, producer_slug and file are required" });
    return;
  }

  const start = trim_start !== undefined ? Number(trim_start) : undefined;
  const end = trim_end !== undefined ? Number(trim_end) : undefined;
  const hasTrim = start !== undefined && end !== undefined && !Number.isNaN(start) && !Number.isNaN(end);

  if (hasTrim && (start! < 0 || end! <= start!)) {
    fs.unlink(req.file.path, () => {});
    res.status(400).json({ error: "Invalid trim range" });
    return;
  }

  if (hasTrim) {
    try {
      await trimAudioFile(req.file.path, start!, end!);
    } catch {
      fs.unlink(req.file.path, () => {});
      res.status(400).json({ error: "Failed to trim audio — check the selected range" });
      return;
    }
  }

  const ext = path.extname(req.file.originalname).toLowerCase().slice(1) as "wav" | "mp3";
  const filename = `${producer_slug}/${req.file.filename}`;
  const normalizedCategory = category && category.trim() ? category.trim() : null;

  const result = await pool.query(
    `INSERT INTO tracks (producer_slug, title, category, filename, format)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [producer_slug, title, normalizedCategory, filename, ext]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const { title, category } = req.body as { title?: string; category?: string | null };

  // `category` is nullable: an explicit "" or "Other" from the admin means
  // "clear the category", so it must be distinguished from "field omitted".
  const categoryProvided = "category" in req.body;
  const normalizedCategory =
    category && category.trim() && category.trim() !== "Other" ? category.trim() : null;

  const result = await pool.query(
    `UPDATE tracks
     SET title = COALESCE($1, title),
         category = CASE WHEN $2 THEN $3 ELSE category END
     WHERE id = $4
     RETURNING *`,
    [title, categoryProvided, normalizedCategory, req.params.id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: "Track not found" });
    return;
  }
  res.json(result.rows[0]);
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const result = await pool.query(
    "DELETE FROM tracks WHERE id = $1 RETURNING filename",
    [req.params.id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: "Track not found" });
    return;
  }

  const filepath = path.join(process.cwd(), "uploads", result.rows[0].filename);
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

  res.json({ deleted: true });
});

export default router;
