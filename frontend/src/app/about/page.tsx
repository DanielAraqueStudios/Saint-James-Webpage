import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { getProducers } from "@/lib/api";
import type { Producer } from "@/lib/api";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the collective of sonic architects behind Saints Productions — producers, composers, and audio engineers shaping music for film, games, and commercial releases.",
  alternates: { canonical: "/about" },
};

// Santi founded Saint's Productions, so he's pinned as the permanent lead
// panel regardless of how the API orders the list. Everyone else keeps a
// stable alphabetical order behind him so new producers slot in predictably.
function sortProducers(producers: Producer[]): Producer[] {
  return [...producers].sort((a, b) => {
    if (a.slug === "santi") return -1;
    if (b.slug === "santi") return 1;
    return a.slug.localeCompare(b.slug);
  });
}

// Hexagonal "honeycomb" panel — pointy top/bottom, flat sides — so producer
// photos tessellate like a beehive when staggered in HoneycombGrid below.
const HEX_CLIP = "[clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]";

function ProducerCell({ producer, size, priority }: { producer: Producer; size: "lg" | "md"; priority?: boolean }) {
  const dimensions = size === "lg" ? "w-60 h-60 md:w-72 md:h-72" : "w-48 h-48 md:w-56 md:h-56";
  return (
    <Link href={`/about/${producer.slug}`} className="group flex flex-col items-center gap-4 focus:outline-none">
      <div className={`${dimensions} relative ${HEX_CLIP}`}>
        <div className="absolute inset-0 bg-saint-purple/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
        <Image
          src={producer.image_url}
          alt={producer.name}
          fill
          priority={priority}
          sizes={size === "lg" ? "(min-width: 768px) 288px, 240px" : "(min-width: 768px) 224px, 192px"}
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />
      </div>
      <div className="text-center">
        <h2 className={`font-bold tracking-wider group-hover:text-saint-light-blue transition-colors ${size === "lg" ? "text-3xl" : "text-2xl"}`}>
          {producer.name}
        </h2>
        <p className="text-sm text-saint-gray uppercase tracking-widest">{producer.role}</p>
      </div>
    </Link>
  );
}

// Beehive layout: every other cell in the row is nudged down half a panel,
// so cells interlock like honeycomb columns instead of a flat grid. Works
// for any number of producers — no hardcoded positions per index.
function HoneycombGrid({ producers }: { producers: Producer[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-14 max-w-4xl mx-auto">
      {producers.map((prod, i) => (
        <div key={prod.slug} className={i % 2 === 1 ? "md:translate-y-16" : undefined}>
          <ProducerCell producer={prod} size="md" />
        </div>
      ))}
    </div>
  );
}

export default async function About() {
  const producers = await getProducers().catch(() => []);
  const [lead, ...rest] = sortProducers(producers);

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

        {/* Lead producer (always Santi) sits alone up top */}
        {lead && (
          <div className="flex justify-center mb-16 md:mb-24">
            <ProducerCell producer={lead} size="lg" priority />
          </div>
        )}

        {/* Remaining producers, honeycomb-staggered so the grid scales cleanly as more are added */}
        {rest.length > 0 && <HoneycombGrid producers={rest} />}
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
