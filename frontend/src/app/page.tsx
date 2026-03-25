import Image from "next/image";
import { ReleaseGrid } from "@/components/ReleaseGrid";
import { TourSection } from "@/components/TourSection";
import { Biography } from "@/components/Biography";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Hero Section (Carl Cox inspiration: Bold, full-width, cinematic) */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Deep dark abstract placeholder background */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity z-0 object-cover" />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter mix-blend-overlay text-white leading-none">
            Santiago<br/>Leiva
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-neutral-400 font-light tracking-wide max-w-2xl mx-auto">
            THE NEW ALBUM AND INTERACTIVE JOURNEY
          </p>
          <div className="mt-10">
            <a href="#releases" className="inline-block border border-white/30 px-8 py-4 uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-all duration-500">
              Explore Discography
            </a>
          </div>
        </div>
      </section>

      {/* Grid Filter Section (Martin Garrix inspiration: Clean, taxonomic grid) */}
      <ReleaseGrid />

      {/* About/Bio Section with Spotify Avatar */}
      <Biography />

      {/* Tour & Events Section */}
      <TourSection />

      {/* Footer Ecosystem */}
      <Footer />
    </div>
  );
}

