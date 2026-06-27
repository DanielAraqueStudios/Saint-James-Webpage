const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json() as Promise<T>;
}

export const api = {
  login: (username: string, password: string) =>
    request<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getProducers: () => request<Producer[]>("/api/producers"),
  updateProducer: (slug: string, data: Partial<Producer>) =>
    request<Producer>(`/api/producers/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getTracks: (params?: { producer?: string; category?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<Track[]>(`/api/tracks${qs ? `?${qs}` : ""}`);
  },
  uploadTrack: (form: FormData) =>
    request<Track>("/api/tracks", { method: "POST", body: form }),
  updateTrack: (id: number, data: { title?: string; category?: string }) =>
    request<Track>(`/api/tracks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTrack: (id: number) =>
    request<{ deleted: boolean }>(`/api/tracks/${id}`, { method: "DELETE" }),
};

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
  category: string;
  filename: string;
  format: "wav" | "mp3";
  created_at: string;
};
