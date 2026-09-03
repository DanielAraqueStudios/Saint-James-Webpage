import { Router, Request, Response } from "express";
import { pool } from "../db/client";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT c.name, c.parent_name, COUNT(t.id)::int AS track_count
     FROM categories c
     LEFT JOIN tracks t ON t.category = c.name
     GROUP BY c.name, c.parent_name
     ORDER BY c.parent_name NULLS FIRST, c.name`
  );
  res.json(result.rows);
});

router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const { name, parent_name } = req.body as { name?: string; parent_name?: string | null };
  if (!name || !name.trim()) {
    res.status(400).json({ error: "name is required" });
    return;
  }

  const trimmedName = name.trim();
  const parent = parent_name && parent_name.trim() ? parent_name.trim() : null;

  if (parent) {
    if (parent === trimmedName) {
      res.status(400).json({ error: "A category cannot be its own parent" });
      return;
    }
    const parentRow = await pool.query(
      "SELECT parent_name FROM categories WHERE name = $1",
      [parent]
    );
    if (parentRow.rows.length === 0) {
      res.status(400).json({ error: "Parent category does not exist" });
      return;
    }
    if (parentRow.rows[0].parent_name) {
      res.status(400).json({ error: "Subcategories can only be one level deep" });
      return;
    }
  }

  const result = await pool.query(
    "INSERT INTO categories (name, parent_name) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING RETURNING name, parent_name",
    [trimmedName, parent]
  );

  if (result.rows.length === 0) {
    res.status(409).json({ error: "Category already exists" });
    return;
  }
  res.status(201).json(result.rows[0]);
});

router.put("/:name", requireAuth, async (req: AuthRequest, res: Response) => {
  const { name: newName } = req.body as { name?: string };
  if (!newName || !newName.trim()) {
    res.status(400).json({ error: "name is required" });
    return;
  }
  const trimmedNewName = newName.trim();
  const oldName = req.params.name;

  if (trimmedNewName === oldName) {
    const existing = await pool.query(
      "SELECT name, parent_name FROM categories WHERE name = $1",
      [oldName]
    );
    if (existing.rows.length === 0) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json(existing.rows[0]);
    return;
  }

  try {
    // ON UPDATE CASCADE on tracks.category and categories.parent_name
    // propagates the rename to any tracks and subcategories automatically.
    const result = await pool.query(
      "UPDATE categories SET name = $1 WHERE name = $2 RETURNING name, parent_name",
      [trimmedNewName, oldName]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    if (err instanceof Error && "code" in err && (err as { code?: string }).code === "23505") {
      res.status(409).json({ error: "A category with that name already exists" });
      return;
    }
    throw err;
  }
});

router.delete("/:name", requireAuth, async (req: AuthRequest, res: Response) => {
  const inUse = await pool.query("SELECT 1 FROM tracks WHERE category = $1 LIMIT 1", [
    req.params.name,
  ]);
  if ((inUse.rowCount ?? 0) > 0) {
    res.status(409).json({ error: "Category is in use by existing tracks" });
    return;
  }

  const hasChildren = await pool.query(
    "SELECT 1 FROM categories WHERE parent_name = $1 LIMIT 1",
    [req.params.name]
  );
  if ((hasChildren.rowCount ?? 0) > 0) {
    res.status(409).json({ error: "Category has subcategories — delete those first" });
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
