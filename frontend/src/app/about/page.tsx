import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { AudioGallery } from "@/components/AudioGallery";
import { getProducers, getTracks } from "@/lib/api";

export default async function About() {
  const [producers, tracks] = await Promise.all([
    getProducers().catch(() => []),
    getTracks().catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-saint-matte-black pt-32 pb-16 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full px-6 flex-grow flex flex-col">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest">
            The <span className="text-saint-light-blue">Vision</span>
          </h1>
          <p className="mt-4 text-saint-gray max-w-2xl mx-auto text-lg leading-relaxed">
            A collective of sonic architects. Click on each producer to learn their story, background, and specializations.
          </p>
        </div>

        {/* Producer grid */}
        <div className="grid grid-cols-2 gap-y-12 gap-x-8 max-w-3xl mx-auto w-full">
          {producers.map((prod, index) => (
            <div
              key={prod.slug}
              className={index === 0 ? "col-span-2 flex justify-center" : index === 1 ? "flex justify-end" : "flex justify-start"}
            >
              <Link href={`/about/${prod.slug}`} className="group flex flex-col items-center gap-4 focus:outline-none">
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-[2rem] overflow-hidden border border-saint-charcoal relative">
                  <div className="absolute inset-0 bg-saint-purple/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
                  <Image
                    src={prod.image_url}
                    alt={prod.name}
                    fill
                    sizes="(min-width: 768px) 256px, 224px"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold tracking-wider group-hover:text-saint-light-blue transition-colors">{prod.name}</h2>
                  <p className="text-sm text-saint-gray uppercase tracking-widest">{prod.role}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* All sounds section */}
        {tracks.length > 0 && (
          <div className="mt-32">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest">
                The <span className="text-saint-light-blue">Sound</span>
              </h2>
              <p className="mt-3 text-saint-gray max-w-xl mx-auto">
                Explore tracks from all producers — filter by category and listen directly.
              </p>
            </div>
            <AudioGallery tracks={tracks} producers={producers} showProducerTag />
          </div>
        )}
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
