"use client";

import { useEffect, useState } from "react";
import { api, Category } from "@/lib/api";

const TOP_LEVEL = "__top__";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState(TOP_LEVEL);
  const [creating, setCreating] = useState(false);
  const [renamingName, setRenamingName] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  const topLevel = categories.filter((c) => !c.parent_name);
  const childrenOf = (parent: string) => categories.filter((c) => c.parent_name === parent);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError("");
    setMsg("");
    try {
      await api.createCategory(name.trim(), parentName === TOP_LEVEL ? null : parentName);
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

  function startRename(cat: Category) {
    setRenamingName(cat.name);
    setRenameValue(cat.name);
    setError("");
    setMsg("");
  }

  async function handleRename(e: React.FormEvent) {
    e.preventDefault();
    if (!renamingName || !renameValue.trim()) return;
    setRenaming(true);
    setError("");
    setMsg("");
    try {
      await api.renameCategory(renamingName, renameValue.trim());
      const cats = await api.getCategories();
      setCategories(cats);
      setRenamingName(null);
      setMsg("Category renamed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename category");
    } finally {
      setRenaming(false);
    }
  }

  async function handleDelete(cat: Category) {
    if (cat.track_count > 0) return;
    if (childrenOf(cat.name).length > 0) return;
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

  function renderRow(cat: Category, indent: boolean) {
    const childCount = childrenOf(cat.name).length;
    const disabled = cat.track_count > 0 || childCount > 0;
    const disabledReason =
      cat.track_count > 0
        ? "Category is in use by existing tracks"
        : childCount > 0
        ? "Delete its subcategories first"
        : "Delete category";

    if (renamingName === cat.name) {
      return (
        <form
          key={cat.name}
          onSubmit={handleRename}
          className={`bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-2 ${
            indent ? "ml-6" : ""
          }`}
        >
          <input
            autoFocus
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={renaming}
            className="text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setRenamingName(null)}
            className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </form>
      );
    }

    return (
      <div
        key={cat.name}
        className={`bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between ${
          indent ? "ml-6" : ""
        }`}
      >
        <div>
          <p className="font-medium">{cat.name}</p>
          <p className="text-xs text-gray-500">
            {cat.track_count} {cat.track_count === 1 ? "track" : "tracks"}
            {childCount > 0 ? ` · ${childCount} sub${childCount === 1 ? "" : "s"}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => startRename(cat)}
            className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Rename
          </button>
          <button
            onClick={() => handleDelete(cat)}
            disabled={disabled}
            title={disabledReason}
            className="text-sm bg-red-900 hover:bg-red-800 disabled:opacity-30 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Categories</h2>
      {msg && <p className="mb-4 text-green-400 text-sm">{msg}</p>}
      {error && <p className="mb-4 text-red-400 text-sm">{error}</p>}

      <form onSubmit={handleCreate} className="flex flex-wrap gap-3 mb-6 max-w-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 min-w-[10rem] bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
        />
        <select
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value={TOP_LEVEL}>Top-level category</option>
          {topLevel.map((c) => (
            <option key={c.name} value={c.name}>
              Subcategory of {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          {creating ? "Adding…" : "Add"}
        </button>
      </form>

      <div className="space-y-2 max-w-md">
        {topLevel.map((cat) => (
          <div key={cat.name} className="space-y-2">
            {renderRow(cat, false)}
            {childrenOf(cat.name).map((sub) => renderRow(sub, true))}
          </div>
        ))}
        {categories.length === 0 && <p className="text-gray-500">No categories yet.</p>}
      </div>
    </div>
  );
}
