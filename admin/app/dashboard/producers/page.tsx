"use client";

import { useEffect, useState } from "react";
import { api, Producer } from "@/lib/api";

export default function ProducersPage() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [editing, setEditing] = useState<Producer | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.getProducers().then(setProducers);
  }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setMsg("");
    try {
      const updated = await api.updateProducer(editing.slug, {
        name: editing.name,
        full_name: editing.full_name,
        role: editing.role,
        image_url: editing.image_url,
        bio: editing.bio,
      });
      setProducers((prev) => prev.map((p) => (p.slug === updated.slug ? updated : p)));
      setEditing(null);
      setMsg("Saved successfully.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Producers</h2>
      {msg && <p className="mb-4 text-green-400 text-sm">{msg}</p>}

      {editing ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">Edit — {editing.slug}</h3>
          <div className="space-y-4">
            <Field label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Field label="Full Name" value={editing.full_name} onChange={(v) => setEditing({ ...editing, full_name: v })} />
            <Field label="Role" value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} />
            <Field label="Image URL" value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} />
            <div>
              <label className="block text-sm text-gray-400 mb-1">Bio (one paragraph per line)</label>
              <textarea
                rows={8}
                value={editing.bio.join("\n")}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value.split("\n") })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-w-2xl">
          {producers.map((p) => (
            <div key={p.slug} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{p.full_name}</p>
                <p className="text-sm text-gray-400">{p.role}</p>
              </div>
              <button
                onClick={() => setEditing(p)}
                className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
