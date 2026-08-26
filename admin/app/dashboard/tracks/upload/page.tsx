"use client";

import { useEffect, useState, useRef } from "react";
import { api, Producer } from "@/lib/api";

const NEW_CATEGORY = "__new__";
const NO_CATEGORY = "";

export default function UploadTrackPage() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [producerSlug, setProducerSlug] = useState("");
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [categorySelect, setCategorySelect] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const category = categorySelect === NEW_CATEGORY ? newCategory : categorySelect;

  useEffect(() => {
    api.getProducers().then((p) => {
      setProducers(p);
      if (p.length > 0) setProducerSlug(p[0].slug);
    });
    api.getCategories().then((cats) => {
      setCategories(cats.map((c) => c.name));
      setCategorySelect(NO_CATEGORY);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError("Please select a file"); return; }
    if (categorySelect === NEW_CATEGORY && !newCategory.trim()) {
      setError("Please enter a name for the new category");
      return;
    }
    setError("");
    setMsg("");
    setUploading(true);

    try {
      if (categorySelect === NEW_CATEGORY && !categories.includes(category)) {
        await api.createCategory(category);
        setCategories((prev) => [...prev, category].sort());
      }

      const form = new FormData();
      form.append("file", file);
      form.append("title", title);
      form.append("category", category);
      form.append("producer_slug", producerSlug);
      await api.uploadTrack(form);

      setMsg("Track uploaded successfully!");
      setTitle("");
      setCategorySelect(category);
      setNewCategory("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-3xl font-bold mb-8">Upload Track</h2>

      {msg && <p className="mb-4 text-green-400 text-sm">{msg}</p>}
      {error && <p className="mb-4 text-red-400 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Producer</label>
          <select
            value={producerSlug}
            onChange={(e) => setProducerSlug(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            required
          >
            {producers.map((p) => (
              <option key={p.slug} value={p.slug}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Category (genre)</label>
          <select
            value={categorySelect}
            onChange={(e) => setCategorySelect(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value={NO_CATEGORY}>No category (Other)</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value={NEW_CATEGORY}>+ New category…</option>
          </select>
          {categorySelect === NEW_CATEGORY && (
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Cinematic, Hip-Hop, Electronic"
              className="w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Audio File (.wav or .mp3)</label>
          <input
            ref={fileRef}
            type="file"
            accept=".wav,.mp3"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white file:mr-3 file:bg-gray-700 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:text-sm cursor-pointer"
            required
          />
          {file && <p className="text-xs text-gray-500 mt-1">{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg py-2 font-medium transition-colors"
        >
          {uploading ? "Uploading…" : "Upload Track"}
        </button>
      </form>
    </div>
  );
}
