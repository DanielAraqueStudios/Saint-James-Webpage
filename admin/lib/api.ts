import { pushToast } from "./toast";
import { pushLog } from "./logs";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-7783.up.railway.app";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("saints_token");
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(init.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const method = init.method || "GET";

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...init, headers });
  } catch {
    const message = `Network error calling ${path} — is the backend reachable?`;
    pushToast("error", message);
    pushLog("error", message);
    throw new Error(message);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    const message = `${method} ${path} failed (${res.status}): ${err.error || "Request failed"}`;
    pushToast("error", message);
    pushLog("error", message);
    throw new Error(err.error || "Request failed");
  }

  pushLog("success", `${method} ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  login: (username: string, password: string) =>
    request<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getProducers: () => request<Producer[]>("/api/producers"),
  createProducer: (data: {
    slug: string;
    name: string;
    full_name: string;
    role: string;
    image_url?: string;
    bio?: string[];
    whatsapp_number?: string;
    calendar_url?: string;
  }) =>
    request<Producer>("/api/producers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProducer: (slug: string, data: Partial<Producer>) =>
    request<Producer>(`/api/producers/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProducer: (slug: string) =>
    request<{ deleted: boolean }>(`/api/producers/${slug}`, { method: "DELETE" }),
  uploadProducerImage: (slug: string, form: FormData) =>
    request<Producer>(`/api/producers/${slug}/image`, { method: "POST", body: form }),

  getTracks: (params?: { producer?: string; category?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<Track[]>(`/api/tracks${qs ? `?${qs}` : ""}`);
  },
  uploadTrack: (form: FormData) =>
    request<Track>("/api/tracks", { method: "POST", body: form }),
  updateTrack: (id: number, data: { title?: string; category?: string | null }) =>
    request<Track>(`/api/tracks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTrack: (id: number) =>
    request<{ deleted: boolean }>(`/api/tracks/${id}`, { method: "DELETE" }),

  getCategories: () => request<Category[]>("/api/categories"),
  createCategory: (name: string) =>
    request<{ name: string }>("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  deleteCategory: (name: string) =>
    request<{ deleted: boolean }>(`/api/categories/${encodeURIComponent(name)}`, {
      method: "DELETE",
    }),

  getHeroVideo: () => request<HeroVideo | null>("/api/hero-video"),
  uploadHeroVideo: (form: FormData) =>
    request<HeroVideo>("/api/hero-video", { method: "POST", body: form }),
};

export type Producer = {
  slug: string;
  name: string;
  full_name: string;
  role: string;
  image_url: string;
  bio: string[];
  whatsapp_number: string | null;
  calendar_url: string | null;
};

export type Category = {
  name: string;
  track_count: number;
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

export type HeroVideo = {
  video_url: string;
  format: string;
  updated_at: string;
};
