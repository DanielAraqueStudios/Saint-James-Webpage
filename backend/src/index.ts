import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { runMigrations } from "./db/migrate";
import { runSeed } from "./db/seed";
import authRouter from "./routes/auth";
import producersRouter from "./routes/producers";
import tracksRouter from "./routes/tracks";
import categoriesRouter from "./routes/categories";
import heroVideoRouter from "./routes/hero-video";

const app = express();
const PORT = process.env.PORT || 4000;

// Railway (and most PaaS hosts) terminate TLS at an edge proxy and forward
// plain HTTP to this container. Without trusting that proxy, req.protocol
// reports "http" even on an https:// request, so URLs built from it
// (image_url, track/hero-video URLs) end up http:// and get blocked as
// mixed content on the https frontend.
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRouter);
app.use("/api/producers", producersRouter);
app.use("/api/tracks", tracksRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/hero-video", heroVideoRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err instanceof Error ? err.message : "Internal server error" });
});

// Large file uploads (hero video, tracks) can legitimately take minutes on a
// slow connection. Without this, a single big/slow upload could crash or hang
// the whole process and take down every other endpoint until the platform
// restarts the container. Log and keep serving instead of dying silently.
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception (server kept alive):", err);
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection (server kept alive):", err);
});

async function start() {
  await runMigrations();
  await runSeed();
  const server = app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

  // Node's default requestTimeout (5 min) can abort a large, slow upload
  // mid-stream. Give uploads room to finish instead of hitting that ceiling.
  server.requestTimeout = 20 * 60 * 1000; // 20 minutes
  server.headersTimeout = 20 * 60 * 1000 + 5000;
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
