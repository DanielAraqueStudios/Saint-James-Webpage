const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type Producer = {
  slug: string;
  name: string;
  full_name: string;
  role: string;
  image_url: string;
  bio: string[];
};

export type Track = {
  id: number;
  producer_slug: string;
  title: string;
  category: string | null;
  filename: string;
  format: "wav" | "mp3";
  created_at: string;
};

export async function getProducers(): Promise<Producer[]> {
  const res = await fetch(`${BASE}/api/producers`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch producers");
  return res.json();
}

export async function getProducer(slug: string): Promise<Producer | null> {
  const res = await fetch(`${BASE}/api/producers/${slug}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch producer");
  return res.json();
}

export async function getTracks(params?: { producer?: string; category?: string }): Promise<Track[]> {
  const qs = params ? new URLSearchParams(params as Record<string, string>).toString() : "";
  const res = await fetch(`${BASE}/api/tracks${qs ? `?${qs}` : ""}`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error("Failed to fetch tracks");
  return res.json();
}

export type Category = {
  name: string;
  track_count: number;
};

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/api/categories`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export function audioUrl(filename: string): string {
  return `${BASE}/uploads/${filename}`;
}
