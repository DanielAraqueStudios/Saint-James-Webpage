import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { runMigrations } from "./db/migrate";
import { runSeed } from "./db/seed";
import authRouter from "./routes/auth";
import producersRouter from "./routes/producers";
import tracksRouter from "./routes/tracks";
import categoriesRouter from "./routes/categories";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRouter);
app.use("/api/producers", producersRouter);
app.use("/api/tracks", tracksRouter);
app.use("/api/categories", categoriesRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err instanceof Error ? err.message : "Internal server error" });
});

async function start() {
  await runMigrations();
  await runSeed();
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
