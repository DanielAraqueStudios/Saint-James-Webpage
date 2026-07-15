"use client";

import { useEffect, useState } from "react";
import { api, Category } from "@/lib/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError("");
    setMsg("");
    try {
      await api.createCategory(name.trim());
      const cats = await api.getCategories();
      setCategories(cats);
      setName("");
      setMsg("Category created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(cat: Category) {
    if (cat.track_count > 0) return;
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    setError("");
    setMsg("");
    try {
      await api.deleteCategory(cat.name);
      setCategories((prev) => prev.filter((c) => c.name !== cat.name));
      setMsg("Category deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Categories</h2>
      {msg && <p className="mb-4 text-green-400 text-sm">{msg}</p>}
      {error && <p className="mb-4 text-red-400 text-sm">{error}</p>}

      <form onSubmit={handleCreate} className="flex gap-3 mb-6 max-w-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          {creating ? "Adding…" : "Add"}
        </button>
      </form>

      <div className="space-y-2 max-w-md">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{cat.name}</p>
              <p className="text-xs text-gray-500">
                {cat.track_count} {cat.track_count === 1 ? "track" : "tracks"}
              </p>
            </div>
            <button
              onClick={() => handleDelete(cat)}
              disabled={cat.track_count > 0}
              title={cat.track_count > 0 ? "Category is in use by existing tracks" : "Delete category"}
              className="text-sm bg-red-900 hover:bg-red-800 disabled:opacity-30 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
        {categories.length === 0 && <p className="text-gray-500">No categories yet.</p>}
      </div>
    </div>
  );
}
