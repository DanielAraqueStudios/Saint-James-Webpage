import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { pool } from "../db/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

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
  if (category) {
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
  const { title, category, producer_slug } = req.body as {
    title?: string;
    category?: string;
    producer_slug?: string;
  };

  if (!title || !category || !producer_slug || !req.file) {
    res.status(400).json({ error: "title, category, producer_slug and file are required" });
    return;
  }

  const ext = path.extname(req.file.originalname).toLowerCase().slice(1) as "wav" | "mp3";
  const filename = `${producer_slug}/${req.file.filename}`;

  const result = await pool.query(
    `INSERT INTO tracks (producer_slug, title, category, filename, format)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [producer_slug, title, category, filename, ext]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const { title, category } = req.body as { title?: string; category?: string };

  const result = await pool.query(
    `UPDATE tracks
     SET title = COALESCE($1, title),
         category = COALESCE($2, category)
     WHERE id = $3
     RETURNING *`,
    [title, category, req.params.id]
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
