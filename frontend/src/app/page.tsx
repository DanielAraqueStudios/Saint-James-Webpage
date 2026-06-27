import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-saint-matte-black">
      <section className="relative min-h-screen w-full overflow-hidden bg-saint-vivid-black">
        <video
          className="h-screen w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label="Saints Productions visual reel"
        >
          <source src="https://assets.codepen.io/3364143/7btrrd.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-saint-vivid-black/20" />
      </section>

      <Footer />
    </div>
  );
}
