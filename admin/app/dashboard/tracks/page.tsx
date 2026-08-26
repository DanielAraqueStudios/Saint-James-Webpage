"use client";

import { useEffect, useState } from "react";
import { api, Track } from "@/lib/api";

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ title: string; category: string | null }>({
    title: "",
    category: "",
  });
  const [msg, setMsg] = useState("");
  const [filterProducer, setFilterProducer] = useState("");

  useEffect(() => {
    api.getTracks().then(setTracks);
    api.getCategories().then((cats) => setCategories(cats.map((c) => c.name)));
  }, []);

  const producers = [...new Set(tracks.map((t) => t.producer_slug))];
  const visible = filterProducer ? tracks.filter((t) => t.producer_slug === filterProducer) : tracks;

  const grouped = visible.reduce<Record<string, Track[]>>((acc, t) => {
    const key = t.category || "Other";
    (acc[key] ??= []).push(t);
    return acc;
  }, {});
  const sortedCategories = Object.keys(grouped).sort((a, b) =>
    a === "Other" ? 1 : b === "Other" ? -1 : a.localeCompare(b)
  );

  async function handleDelete(id: number) {
    if (!confirm("Delete this track?")) return;
    await api.deleteTrack(id);
    setTracks((prev) => prev.filter((t) => t.id !== id));
    setMsg("Track deleted.");
  }

  async function handleSave(id: number) {
    const updated = await api.updateTrack(id, editData);
    setTracks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    setEditingId(null);
    setMsg("Track updated.");
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Tracks</h2>
      {msg && <p className="mb-4 text-green-400 text-sm">{msg}</p>}

      <div className="flex gap-3 mb-6">
        <select
          value={filterProducer}
          onChange={(e) => setFilterProducer(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
        >
          <option value="">All producers</option>
          {producers.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {sortedCategories.map((cat) => (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">{cat}</h3>
            <div className="space-y-2">
              {grouped[cat].map((t) => (
                <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  {editingId === t.id ? (
                    <div className="flex gap-3 items-center flex-wrap">
                      <input
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        placeholder="Title"
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm flex-1"
                      />
                      <select
                        value={editData.category ?? ""}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value || null })}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm w-36"
                      >
                        <option value="">No category (Other)</option>
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <button onClick={() => handleSave(t.id)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm">Save</button>
                      <button onClick={() => setEditingId(null)} className="bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="font-medium truncate">{t.title}</span>
                        <span className="text-xs text-blue-400">{t.producer_slug}</span>
                        <span className="text-xs text-gray-500 uppercase">{t.format}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingId(t.id); setEditData({ title: t.title, category: t.category }); }}
                          className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-sm bg-red-900 hover:bg-red-800 text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {visible.length === 0 && <p className="text-gray-500">No tracks yet.</p>}
      </div>
    </div>
  );
}
