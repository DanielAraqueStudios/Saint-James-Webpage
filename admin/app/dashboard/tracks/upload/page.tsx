"use client";

import { useEffect, useState, useRef } from "react";
import { api, Producer, Category } from "@/lib/api";
import { ProgressBar } from "@/components/ProgressBar";
import { TrackTrimmer } from "@/components/TrackTrimmer";
import { CategoryPicker } from "@/components/CategoryPicker";

const NO_CATEGORY = "";
const MAX_SIZE_MB = 300;

export default function UploadTrackPage() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [producerSlug, setProducerSlug] = useState("");
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState(NO_CATEGORY);
  const [file, setFile] = useState<File | null>(null);
  const [customize, setCustomize] = useState(false);
  const [trim, setTrim] = useState<{ start: number; end: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getProducers().then((p) => {
      setProducers(p);
      if (p.length > 0) setProducerSlug(p[0].slug);
    });
    api.getCategories().then(setCategories);
  }, []);

  async function handleCreateCategory(name: string, parentName: string | null) {
    const created = await api.createCategory(name, parentName);
    setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError("Please select a file"); return; }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large (${(file.size / 1024 / 1024).toFixed(0)}MB). Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    setError("");
    setMsg("");
    setUploading(true);
    setProgress(0);

    try {
      // multer's disk-storage `destination` callback runs as soon as it hits
      // the "file" field in the multipart stream — fields appended after it
      // aren't parsed yet, so producer_slug must come before file or the
      // backend falls back to an "unknown" directory.
      const form = new FormData();
      form.append("title", title);
      form.append("category", category);
      form.append("producer_slug", producerSlug);
      if (customize && trim && trim.end > trim.start) {
        form.append("trim_start", trim.start.toString());
        form.append("trim_end", trim.end.toString());
      }
      form.append("file", file);
      await api.uploadTrack(form, setProgress);

      setMsg("Track uploaded successfully!");
      setTitle("");
      setFile(null);
      setCustomize(false);
      setTrim(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
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
          <CategoryPicker
            categories={categories}
            value={category}
            onChange={setCategory}
            onCreate={handleCreateCategory}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Audio File (.wav or .mp3)</label>
          <input
            ref={fileRef}
            type="file"
            accept=".wav,.mp3"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setTrim(null);
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white file:mr-3 file:bg-gray-700 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:text-sm cursor-pointer"
            required
          />
          {file && <p className="text-xs text-gray-500 mt-1">{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>}
        </div>

        {file && (
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={customize}
                onChange={(e) => setCustomize(e.target.checked)}
                className="accent-blue-600"
              />
              Customize track (trim start/end before upload)
            </label>
            {customize && (
              <div className="mt-2">
                <TrackTrimmer file={file} onChange={(start, end) => setTrim({ start, end })} />
              </div>
            )}
          </div>
        )}

        {uploading && (
          <div>
            <ProgressBar percent={progress} />
            <p className="text-xs text-gray-500 mt-1">{progress}%</p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg py-2 font-medium transition-colors"
        >
          {uploading ? `Uploading… ${progress}%` : "Upload Track"}
        </button>
      </form>
    </div>
  );
}
