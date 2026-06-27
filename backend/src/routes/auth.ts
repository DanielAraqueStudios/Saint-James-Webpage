import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/client";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ error: "username and password are required" });
    return;
  }

  const result = await pool.query(
    "SELECT id, password_hash FROM admin_users WHERE username = $1",
    [username]
  );

  if (result.rows.length === 0) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "8h" });
  res.json({ token });
});

export default router;
