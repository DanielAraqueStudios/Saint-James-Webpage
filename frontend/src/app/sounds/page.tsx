import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { AudioGallery } from "@/components/AudioGallery";
import { getProducers, getTracks, getCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Sounds",
  description:
    "Explore the full Saints Productions catalog — filter tracks by genre or by producer and listen directly.",
  alternates: { canonical: "/sounds" },
};

export default async function Sounds() {
  const [producers, tracks, categories] = await Promise.all([
    getProducers().catch(() => []),
    getTracks().catch(() => []),
    getCategories().catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-saint-matte-black pt-32 pb-16 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full px-6 flex-grow flex flex-col items-center">

        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest text-center px-4">
          Our <span className="text-saint-purple">Sounds</span>
        </h1>
        <p className="mt-4 text-saint-gray max-w-2xl mx-auto text-lg text-center px-4 leading-relaxed mb-12">
          Explore the full catalog — filter by genre or by producer and listen directly.
        </p>

        <div className="w-full">
          <AudioGallery
            tracks={tracks}
            producers={producers}
            categoryOptions={categories}
            showProducerTag
            showProducerFilter
          />
        </div>

      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
