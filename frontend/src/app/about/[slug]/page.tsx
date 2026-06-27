import { notFound } from "next/navigation";
import { getProducer, getProducers, getTracks } from "@/lib/api";
import { ProducerBio } from "./ProducerBio";

export async function generateStaticParams() {
  const producers = await getProducers().catch(() => []);
  return producers.map((p) => ({ slug: p.slug }));
}

export default async function ProducerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [producer, tracks] = await Promise.all([
    getProducer(slug),
    getTracks({ producer: slug }),
  ]);
  if (!producer) notFound();
  return <ProducerBio producer={producer} tracks={tracks} />;
}
