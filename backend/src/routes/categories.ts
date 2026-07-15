import { Router, Request, Response } from "express";
import { pool } from "../db/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT c.name, COUNT(t.id)::int AS track_count
     FROM categories c
     LEFT JOIN tracks t ON t.category = c.name
     GROUP BY c.name
     ORDER BY c.name`
  );
  res.json(result.rows);
});

router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const { name } = req.body as { name?: string };
  if (!name || !name.trim()) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  const result = await pool.query(
    "INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING name",
    [name.trim()]
  );

  if (result.rows.length === 0) {
    res.status(409).json({ error: "Category already exists" });
    return;
  }
  res.status(201).json({ name: result.rows[0].name });
});

router.delete("/:name", requireAuth, async (req: AuthRequest, res: Response) => {
  const inUse = await pool.query("SELECT 1 FROM tracks WHERE category = $1 LIMIT 1", [
    req.params.name,
  ]);
  if ((inUse.rowCount ?? 0) > 0) {
    res.status(409).json({ error: "Category is in use by existing tracks" });
    return;
  }

  const result = await pool.query("DELETE FROM categories WHERE name = $1 RETURNING name", [
    req.params.name,
  ]);
  if (result.rows.length === 0) {
    res.status(404).json({ error: "Category not found" });
    return;
  }
  res.json({ deleted: true });
});

export default router;
