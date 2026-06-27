import { Router, Request, Response } from "express";
import { pool } from "../db/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

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

export default router;
