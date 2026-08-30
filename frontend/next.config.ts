import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

// The backend serves uploaded producer/track images from /uploads on
// whatever host NEXT_PUBLIC_API_URL points at (localhost:4000 in dev, the
// real API domain in prod). Without this, next/image blocks those images
// even when the DB row and file on disk are both fine.
const apiRemotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
if (process.env.NEXT_PUBLIC_API_URL) {
  try {
    const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);
    apiRemotePatterns.push({
      protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
      hostname: apiUrl.hostname,
      port: apiUrl.port || undefined,
      pathname: "/uploads/**",
    });
  } catch {
    // Ignore an unparsable NEXT_PUBLIC_API_URL; images from it just won't render.
  }
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...apiRemotePatterns,
    ],
  },
};

export default nextConfig;
