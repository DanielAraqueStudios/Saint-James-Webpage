import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { HeroVideoPlayer } from "@/components/HeroVideoPlayer";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-7783.up.railway.app";
const FALLBACK_VIDEO_URL = "https://assets.codepen.io/3364143/7btrrd.mp4";

type HeroVideoData = {
  video_url: string;
  muted: boolean;
  volume: number;
};

async function getHeroVideo(): Promise<HeroVideoData> {
  const fallback: HeroVideoData = { video_url: FALLBACK_VIDEO_URL, muted: true, volume: 1 };
  try {
    const res = await fetch(`${API_URL}/api/hero-video`, { next: { revalidate: 60 } });
    if (!res.ok) return fallback;
    const data = await res.json();
    if (!data?.video_url) return fallback;
    return {
      video_url: data.video_url,
      muted: data.muted ?? true,
      volume: typeof data.volume === "number" ? data.volume : 1,
    };
  } catch {
    return fallback;
  }
}

export default async function Home() {
  const { video_url, muted, volume } = await getHeroVideo();

  return (
    <div className="min-h-screen bg-saint-matte-black">
      <section className="relative min-h-screen w-full overflow-hidden bg-saint-vivid-black">
        <HeroVideoPlayer videoUrl={video_url} mutedByDefault={muted} volume={volume} />
        <div className="pointer-events-none absolute inset-0 bg-saint-vivid-black/20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] bg-gradient-to-t from-saint-vivid-black/80 via-saint-vivid-black/10 to-transparent px-6 pb-16 pt-32 md:px-16">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-saint-white">
            Saints <span className="text-saint-light-blue">Productions</span>
          </h1>
          <p className="mt-3 max-w-xl text-saint-light text-lg leading-relaxed">
            Sonic architecture and production services.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
