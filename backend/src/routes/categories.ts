import { Router, Request, Response } from "express";
import { pool } from "../db/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT name FROM categories ORDER BY name");
  res.json(result.rows.map((r) => r.name));
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

export default router;
