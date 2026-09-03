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

// fetch() doesn't expose upload (request body) progress — only XHR does, via
// xhr.upload.onprogress. Used for the three file-upload endpoints so the
// admin UI can show a real progress bar instead of a static "Uploading…".
function uploadWithProgress<T>(
  path: string,
  form: FormData,
  onProgress?: (pct: number) => void
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE}${path}`);
    const token = getToken();
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => {
      const message = `Network error calling ${path} — is the backend reachable?`;
      pushToast("error", message);
      pushLog("error", message);
      reject(new Error(message));
    };
    xhr.onload = () => {
      let body: unknown;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        body = {};
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        pushLog("success", `POST ${path} → ${xhr.status}`);
        resolve(body as T);
      } else {
        const err = body as { error?: string };
        const message = `POST ${path} failed (${xhr.status}): ${err.error || "Request failed"}`;
        pushToast("error", message);
        pushLog("error", message);
        reject(new Error(err.error || "Request failed"));
      }
    };
    xhr.send(form);
  });
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
  uploadProducerImage: (slug: string, form: FormData, onProgress?: (pct: number) => void) =>
    uploadWithProgress<Producer>(`/api/producers/${slug}/image`, form, onProgress),

  getTracks: (params?: { producer?: string; category?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<Track[]>(`/api/tracks${qs ? `?${qs}` : ""}`);
  },
  uploadTrack: (form: FormData, onProgress?: (pct: number) => void) =>
    uploadWithProgress<Track>("/api/tracks", form, onProgress),
  updateTrack: (id: number, data: { title?: string; category?: string | null }) =>
    request<Track>(`/api/tracks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTrack: (id: number) =>
    request<{ deleted: boolean }>(`/api/tracks/${id}`, { method: "DELETE" }),

  getCategories: () => request<Category[]>("/api/categories"),
  createCategory: (name: string, parent_name?: string | null) =>
    request<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name, parent_name: parent_name ?? null }),
    }),
  deleteCategory: (name: string) =>
    request<{ deleted: boolean }>(`/api/categories/${encodeURIComponent(name)}`, {
      method: "DELETE",
    }),

  getHeroVideo: () => request<HeroVideo | null>("/api/hero-video"),
  uploadHeroVideo: (form: FormData, onProgress?: (pct: number) => void) =>
    uploadWithProgress<HeroVideo>("/api/hero-video", form, onProgress),
  updateHeroVideoSound: (settings: { muted?: boolean; volume?: number }) =>
    request<HeroVideo>("/api/hero-video", { method: "PATCH", body: JSON.stringify(settings) }),
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
  parent_name: string | null;
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
  muted: boolean;
  volume: number;
  updated_at: string;
};
