"use client";

import { useEffect, useRef, useState } from "react";
import { api, HeroVideo } from "@/lib/api";

const MAX_SIZE_MB = 300;

export default function HeroVideoPage() {
  const [video, setVideo] = useState<HeroVideo | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [savingSound, setSavingSound] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getHeroVideo().then(setVideo);
  }, []);

  // Browsers block autoplay-with-sound outright, no matter what's set here —
  // the site always starts muted and shows visitors an unmute control. What
  // this controls is what happens once a visitor unmutes: silence, or sound
  // at this volume.
  async function handleSoundChange(next: { muted?: boolean; volume?: number }) {
    if (!video) return;
    const previous = video;
    setVideo({ ...video, ...next });
    setSavingSound(true);
    setError("");
    try {
      const updated = await api.updateHeroVideoSound(next);
      setVideo(updated);
    } catch (err) {
      setVideo(previous);
      setError(err instanceof Error ? err.message : "Failed to update sound settings");
    } finally {
      setSavingSound(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError("Please select a video file"); return; }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large (${(file.size / 1024 / 1024).toFixed(0)}MB). Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    setError("");
    setMsg("");
    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);
      const updated = await api.uploadHeroVideo(form);
      setVideo(updated);
      setMsg("Home page video updated successfully!");
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
      <h2 className="text-3xl font-bold mb-8">Home Page Video</h2>

      {msg && <p className="mb-4 text-green-400 text-sm">{msg}</p>}
      {error && <p className="mb-4 text-red-400 text-sm">{error}</p>}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <p className="text-sm text-gray-400 mb-3">Current video</p>
        {video ? (
          <>
            <video
              key={video.video_url}
              src={video.video_url}
              controls
              muted
              className="w-full rounded-lg bg-black"
            />
            <p className="text-xs text-gray-500 mt-2 break-all">
              {video.video_url} ({video.format.toUpperCase()})
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Last updated: {new Date(video.updated_at).toLocaleString()}
            </p>
          </>
        ) : (
          <p className="text-gray-500 text-sm">No video set.</p>
        )}
      </div>

      {video && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 space-y-4">
          <p className="text-sm text-gray-400">Sound</p>
          <p className="text-xs text-gray-600 -mt-2">
            Browsers always start the video muted for autoplay — visitors see an unmute
            button on the site. This sets what plays once they unmute it.
          </p>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={video.muted}
              onChange={(e) => handleSoundChange({ muted: e.target.checked })}
              disabled={savingSound}
              className="w-4 h-4"
            />
            No sound (video stays silent even after visitors unmute)
          </label>

          <div className={video.muted ? "opacity-50" : undefined}>
            <label className="block text-xs text-gray-500 mb-1">
              Volume ({Math.round(video.volume * 100)}%)
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={video.volume}
              onChange={(e) => handleSoundChange({ volume: Number(e.target.value) })}
              disabled={savingSound || video.muted}
              className="w-full"
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1">New Video (.mp4 or .mov)</label>
          <input
            ref={fileRef}
            type="file"
            accept=".mp4,.mov"
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
          {uploading ? "Uploading…" : "Replace Video"}
        </button>
      </form>
    </div>
  );
}
