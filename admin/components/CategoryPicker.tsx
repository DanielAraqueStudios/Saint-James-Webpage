"use client";

import { useState } from "react";
import { Category } from "@/lib/api";

const NO_CATEGORY = "";

type Props = {
  categories: Category[];
  /** Selected leaf category name, or "" for no category. */
  value: string;
  onChange: (name: string) => void;
  onCreate: (name: string, parentName: string | null) => Promise<Category>;
};

function chip(active: boolean, small = false) {
  const base = small ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-sm";
  return `${base} rounded-full font-medium transition-colors ${
    active
      ? "bg-blue-600 text-white"
      : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
  }`;
}

function ghostChip(small = false) {
  const base = small ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-sm";
  return `${base} rounded-full font-medium border border-dashed border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors`;
}

export function CategoryPicker({ categories, value, onChange, onCreate }: Props) {
  const topLevel = categories.filter((c) => !c.parent_name);
  const childrenOf = (parent: string) => categories.filter((c) => c.parent_name === parent);

  const selected = categories.find((c) => c.name === value);
  const selectedParentName = selected ? selected.parent_name ?? selected.name : null;
  const subs = selectedParentName ? childrenOf(selectedParentName) : [];

  const [addingTop, setAddingTop] = useState(false);
  const [newTopName, setNewTopName] = useState("");
  const [addingSub, setAddingSub] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submitNewTop(e: React.FormEvent) {
    e.preventDefault();
    if (!newTopName.trim()) return;
    setBusy(true);
    setErr("");
    try {
      const created = await onCreate(newTopName.trim(), null);
      onChange(created.name);
      setNewTopName("");
      setAddingTop(false);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Failed to create category");
    } finally {
      setBusy(false);
    }
  }

  async function submitNewSub(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubName.trim() || !selectedParentName) return;
    setBusy(true);
    setErr("");
    try {
      const created = await onCreate(newSubName.trim(), selectedParentName);
      onChange(created.name);
      setNewSubName("");
      setAddingSub(false);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Failed to create subcategory");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onChange(NO_CATEGORY)} className={chip(value === NO_CATEGORY)}>
          No category
        </button>
        {topLevel.map((c) => (
          <button key={c.name} type="button" onClick={() => onChange(c.name)} className={chip(selectedParentName === c.name)}>
            {c.name}
            {childrenOf(c.name).length > 0 && <span className="ml-1 opacity-60">▾</span>}
          </button>
        ))}
        {!addingTop ? (
          <button type="button" onClick={() => setAddingTop(true)} className={ghostChip()}>
            + New category
          </button>
        ) : (
          <form onSubmit={submitNewTop} className="flex items-center gap-1.5">
            <input
              autoFocus
              value={newTopName}
              onChange={(e) => setNewTopName(e.target.value)}
              placeholder="e.g. Cinematic"
              className="bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-white text-sm w-36 focus:outline-none focus:border-blue-500"
            />
            <button type="submit" disabled={busy} className={chip(true)}>
              Add
            </button>
            <button type="button" onClick={() => { setAddingTop(false); setErr(""); }} className={ghostChip()}>
              Cancel
            </button>
          </form>
        )}
      </div>

      {selectedParentName && (subs.length > 0 || addingSub) && (
        <div className="flex flex-wrap gap-2 pl-4 border-l-2 border-gray-800">
          <button
            type="button"
            onClick={() => onChange(selectedParentName)}
            className={chip(value === selectedParentName, true)}
          >
            All {selectedParentName}
          </button>
          {subs.map((s) => (
            <button key={s.name} type="button" onClick={() => onChange(s.name)} className={chip(value === s.name, true)}>
              {s.name}
            </button>
          ))}
          {!addingSub ? (
            <button type="button" onClick={() => setAddingSub(true)} className={ghostChip(true)}>
              + New subcategory
            </button>
          ) : (
            <form onSubmit={submitNewSub} className="flex items-center gap-1.5">
              <input
                autoFocus
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="e.g. Lo-Fi"
                className="bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-white text-xs w-32 focus:outline-none focus:border-blue-500"
              />
              <button type="submit" disabled={busy} className={chip(true, true)}>
                Add
              </button>
              <button type="button" onClick={() => { setAddingSub(false); setErr(""); }} className={ghostChip(true)}>
                Cancel
              </button>
            </form>
          )}
        </div>
      )}

      {err && <p className="text-xs text-red-400">{err}</p>}
    </div>
  );
}
