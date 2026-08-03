import { Footer } from "@/components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-7783.up.railway.app";
const FALLBACK_VIDEO_URL = "https://assets.codepen.io/3364143/7btrrd.mp4";

async function getHeroVideoUrl(): Promise<string> {
  try {
    const res = await fetch(`${API_URL}/api/hero-video`, { next: { revalidate: 60 } });
    if (!res.ok) return FALLBACK_VIDEO_URL;
    const data = await res.json();
    return data?.video_url || FALLBACK_VIDEO_URL;
  } catch {
    return FALLBACK_VIDEO_URL;
  }
}

export default async function Home() {
  const videoUrl = await getHeroVideoUrl();

  return (
    <div className="min-h-screen bg-saint-matte-black">
      <section className="relative min-h-screen w-full overflow-hidden bg-saint-vivid-black">
        <video
          key={videoUrl}
          className="h-screen w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label="Saints Productions visual reel"
        >
          <source src={videoUrl} />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-saint-vivid-black/20" />
      </section>

      <Footer />
    </div>
  );
}
