"use client";

import { useEffect, useState } from "react";
import { api, Category } from "@/lib/api";

const TOP_LEVEL = "__top__";

function FolderIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v1H2V6z" />
      <path d="M2 9h16l-1.5 7.5a2 2 0 01-2 1.5H5.5a2 2 0 01-2-1.5L2 9z" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M7 5l6 5-6 5V5z" />
    </svg>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState(TOP_LEVEL);
  const [creating, setCreating] = useState(false);
  const [renamingName, setRenamingName] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [addingUnder, setAddingUnder] = useState<string | null>(null);
  const [addSubName, setAddSubName] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  const topLevel = categories.filter((c) => !c.parent_name);
  const childrenOf = (parent: string) => categories.filter((c) => c.parent_name === parent);

  function toggle(name: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  async function refresh() {
    const cats = await api.getCategories();
    setCategories(cats);
    return cats;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError("");
    setMsg("");
    try {
      await api.createCategory(name.trim(), parentName === TOP_LEVEL ? null : parentName);
      await refresh();
      setName("");
      setMsg("Category created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setCreating(false);
    }
  }

  function startAddSub(parent: string) {
    setAddingUnder(parent);
    setAddSubName("");
    setError("");
    setMsg("");
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.delete(parent);
      return next;
    });
  }

  async function handleAddSub(e: React.FormEvent, parent: string) {
    e.preventDefault();
    if (!addSubName.trim()) return;
    setCreating(true);
    setError("");
    setMsg("");
    try {
      await api.createCategory(addSubName.trim(), parent);
      await refresh();
      setAddingUnder(null);
      setMsg("Subcategory created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create subcategory");
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
      await refresh();
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

  function renderRenameForm(cat: Category) {
    return (
      <form onSubmit={handleRename} className="flex items-center gap-2 flex-1 py-1.5">
        <input
          autoFocus
          type="text"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={renaming}
          className="text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-2 py-1 rounded-md transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setRenamingName(null)}
          className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded-md transition-colors"
        >
          Cancel
        </button>
      </form>
    );
  }

  function renderCategory(cat: Category) {
    const children = childrenOf(cat.name);
    const hasChildren = children.length > 0;
    const isOpen = !collapsed.has(cat.name);
    const disabled = cat.track_count > 0 || hasChildren;
    const disabledReason =
      cat.track_count > 0
        ? "Category is in use by existing tracks"
        : hasChildren
        ? "Delete its subcategories first"
        : "Delete category";

    return (
      <div key={cat.name} className="select-none">
        <div className="flex items-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-gray-900/60 group">
          <button
            onClick={() => toggle(cat.name)}
            className={hasChildren ? "" : "invisible"}
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            <ChevronIcon open={isOpen} />
          </button>
          <FolderIcon open={isOpen && hasChildren} />

          {renamingName === cat.name ? (
            renderRenameForm(cat)
          ) : (
            <>
              <span className="font-medium text-sm">{cat.name}</span>
              <span className="text-xs text-gray-500">
                {cat.track_count} {cat.track_count === 1 ? "track" : "tracks"}
                {hasChildren ? ` · ${children.length} sub${children.length === 1 ? "" : "s"}` : ""}
              </span>
              <div className="ml-auto flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startAddSub(cat.name)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded-md transition-colors"
                >
                  + Sub
                </button>
                <button
                  onClick={() => startRename(cat)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded-md transition-colors"
                >
                  Rename
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  disabled={disabled}
                  title={disabledReason}
                  className="text-xs bg-red-900 hover:bg-red-800 disabled:opacity-30 disabled:cursor-not-allowed text-white px-2 py-1 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>

        {isOpen && (hasChildren || addingUnder === cat.name) && (
          <div className="ml-[7px] pl-4 border-l border-gray-800">
            {children.map((sub) => (
              <div key={sub.name} className="flex items-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-gray-900/60 group relative">
                <span className="absolute -left-4 top-1/2 w-3.5 h-px bg-gray-800" />
                <FolderIcon open={false} />
                {renamingName === sub.name ? (
                  renderRenameForm(sub)
                ) : (
                  <>
                    <span className="text-sm">{sub.name}</span>
                    <span className="text-xs text-gray-500">
                      {sub.track_count} {sub.track_count === 1 ? "track" : "tracks"}
                    </span>
                    <div className="ml-auto flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startRename(sub)}
                        className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded-md transition-colors"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDelete(sub)}
                        disabled={sub.track_count > 0}
                        title={sub.track_count > 0 ? "Category is in use by existing tracks" : "Delete category"}
                        className="text-xs bg-red-900 hover:bg-red-800 disabled:opacity-30 disabled:cursor-not-allowed text-white px-2 py-1 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {addingUnder === cat.name && (
              <form
                onSubmit={(e) => handleAddSub(e, cat.name)}
                className="flex items-center gap-2 py-1.5 px-2 relative"
              >
                <span className="absolute -left-4 top-1/2 w-3.5 h-px bg-gray-800" />
                <input
                  autoFocus
                  type="text"
                  value={addSubName}
                  onChange={(e) => setAddSubName(e.target.value)}
                  placeholder="New subcategory name"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={creating}
                  className="text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-2 py-1 rounded-md transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setAddingUnder(null)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        )}
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

      <div className="max-w-md bg-gray-900/40 border border-gray-800 rounded-xl p-2">
        {topLevel.map((cat) => renderCategory(cat))}
        {categories.length === 0 && <p className="text-gray-500 p-2">No categories yet.</p>}
      </div>
    </div>
  );
}
