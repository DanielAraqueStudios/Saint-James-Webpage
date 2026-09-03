import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducer, getProducers, getTracks } from "@/lib/api";
import { ProducerBio } from "./ProducerBio";

export async function generateStaticParams() {
  const producers = await getProducers().catch(() => []);
  return producers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const producer = await getProducer(slug);
  if (!producer) return {};

  const description = producer.bio[0] ?? `${producer.role} at Saints Productions.`;
  return {
    title: producer.full_name,
    description,
    alternates: { canonical: `/about/${producer.slug}` },
    openGraph: {
      title: producer.full_name,
      description,
      images: [{ url: producer.image_url }],
    },
  };
}

export default async function ProducerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [producer, tracks] = await Promise.all([
    getProducer(slug),
    getTracks({ producer: slug }),
  ]);
  if (!producer) notFound();

  // Built from the same producer data already fetched above and rendered
  // visibly by ProducerBio — nothing invented.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: producer.full_name,
    jobTitle: producer.role,
    image: producer.image_url,
    description: producer.bio.join(" "),
    worksFor: { "@type": "Organization", name: "Saints Productions" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <ProducerBio producer={producer} tracks={tracks} />
    </>
  );
}
