"use client";

import { useEffect, useState } from "react";
import { api, Producer } from "@/lib/api";
import { PhoneNumberInput, isValidStoredNumber } from "@/components/PhoneNumberInput";
import { UrlInput, isValidUrl } from "@/components/UrlInput";
import { ProgressBar } from "@/components/ProgressBar";

const EMPTY_NEW = {
  slug: "",
  name: "",
  full_name: "",
  role: "",
  whatsapp_number: "",
  calendar_url: "",
};

export default function ProducersPage() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [editing, setEditing] = useState<Producer | null>(null);
  const [creating, setCreating] = useState(false);
  const [newProducer, setNewProducer] = useState(EMPTY_NEW);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.getProducers().then(setProducers);
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!editing) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setMsg("");
    try {
      const form = new FormData();
      form.append("image", file);
      const updated = await api.uploadProducerImage(editing.slug, form, setUploadProgress);
      setEditing({ ...editing, image_url: updated.image_url });
      setProducers((prev) => prev.map((p) => (p.slug === updated.slug ? updated : p)));
      setMsg("Image uploaded.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = "";
    }
  }

  async function handleSave() {
    if (!editing) return;
    if (!isValidStoredNumber(editing.whatsapp_number || "")) {
      setMsg("Please enter a valid WhatsApp number, or clear the field");
      return;
    }
    if (!isValidUrl(editing.calendar_url || "")) {
      setMsg("Please enter a valid calendar link (starting with http:// or https://), or clear the field");
      return;
    }
    setSaving(true);
    setMsg("");
    try {
      const updated = await api.updateProducer(editing.slug, {
        name: editing.name,
        full_name: editing.full_name,
        role: editing.role,
        image_url: editing.image_url,
        bio: editing.bio,
        whatsapp_number: editing.whatsapp_number,
        calendar_url: editing.calendar_url,
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

  async function handleCreate() {
    if (!newProducer.slug.trim() || !newProducer.name.trim() || !newProducer.full_name.trim() || !newProducer.role.trim()) {
      setMsg("Slug, name, full name and role are required");
      return;
    }
    if (!isValidStoredNumber(newProducer.whatsapp_number)) {
      setMsg("Please enter a valid WhatsApp number, or leave it blank");
      return;
    }
    if (!isValidUrl(newProducer.calendar_url)) {
      setMsg("Please enter a valid calendar link (starting with http:// or https://), or leave it blank");
      return;
    }
    setSaving(true);
    setMsg("");
    try {
      const created = await api.createProducer({
        slug: newProducer.slug.trim().toLowerCase(),
        name: newProducer.name,
        full_name: newProducer.full_name,
        role: newProducer.role,
        whatsapp_number: newProducer.whatsapp_number || undefined,
        calendar_url: newProducer.calendar_url || undefined,
      });
      setProducers((prev) => [...prev, created].sort((a, b) => a.slug.localeCompare(b.slug)));
      setCreating(false);
      setNewProducer(EMPTY_NEW);
      setMsg("Producer created. Add an image and bio via Edit.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Remove producer "${slug}"? This also deletes their uploaded tracks and images.`)) return;
    setMsg("");
    try {
      await api.deleteProducer(slug);
      setProducers((prev) => prev.filter((p) => p.slug !== slug));
      setMsg("Producer removed.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Producers</h2>
        {!editing && !creating && (
          <button
            onClick={() => setCreating(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            + New Producer
          </button>
        )}
      </div>
      {msg && <p className="mb-4 text-green-400 text-sm">{msg}</p>}

      {creating ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl space-y-4">
          <h3 className="text-xl font-semibold mb-2">New Producer</h3>
          <Field label={'Slug (used in URLs, e.g. "santi")'} value={newProducer.slug} onChange={(v) => setNewProducer({ ...newProducer, slug: v })} />
          <Field label="Name" value={newProducer.name} onChange={(v) => setNewProducer({ ...newProducer, name: v })} />
          <Field label="Full Name" value={newProducer.full_name} onChange={(v) => setNewProducer({ ...newProducer, full_name: v })} />
          <Field label="Role" value={newProducer.role} onChange={(v) => setNewProducer({ ...newProducer, role: v })} />
          <PhoneNumberInput
            label="WhatsApp Number"
            value={newProducer.whatsapp_number}
            onChange={(v) => setNewProducer({ ...newProducer, whatsapp_number: v })}
          />
          <UrlInput
            label="Calendar / Scheduling Link"
            value={newProducer.calendar_url}
            onChange={(v) => setNewProducer({ ...newProducer, calendar_url: v })}
          />
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {saving ? "Creating…" : "Create"}
            </button>
            <button
              onClick={() => { setCreating(false); setNewProducer(EMPTY_NEW); }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : editing ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">Edit — {editing.slug}</h3>
          <div className="space-y-4">
            <Field label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Field label="Full Name" value={editing.full_name} onChange={(v) => setEditing({ ...editing, full_name: v })} />
            <Field label="Role" value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} />
            <PhoneNumberInput
              label="WhatsApp Number"
              value={editing.whatsapp_number || ""}
              onChange={(v) => setEditing({ ...editing, whatsapp_number: v || null })}
            />
            <UrlInput
              label="Calendar / Scheduling Link"
              value={editing.calendar_url || ""}
              onChange={(v) => setEditing({ ...editing, calendar_url: v || null })}
            />
            <div>
              <label className="block text-sm text-gray-400 mb-1">Image</label>
              <div className="flex items-center gap-4">
                {editing.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={editing.image_url}
                    alt={editing.full_name}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-700"
                  />
                )}
                <label className="cursor-pointer text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors">
                  {uploading ? `Uploading… ${uploadProgress}%` : "Upload image"}
                  <input
                    type="file"
                    accept="image/*,.avif,.svg,.bmp,.tiff,.tif"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              {uploading && (
                <div className="mt-2 max-w-xs">
                  <ProgressBar percent={uploadProgress} />
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WebP, GIF, AVIF, SVG, BMP and TIFF.</p>
            </div>
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
                {!p.whatsapp_number && !p.calendar_url && (
                  <p className="text-xs text-yellow-500 mt-1">No WhatsApp/calendar link set yet</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(p)}
                  className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.slug)}
                  className="text-sm bg-red-900/50 hover:bg-red-900 text-red-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
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
