"use client";

import { useState } from "react";
import { Track, Producer, Category } from "@/lib/api";
import { AudioPlayer } from "./AudioPlayer";

const OTHER = "Other";
const ALL = "All";

type Props = {
  tracks: Track[];
  producers?: Producer[];
  showProducerTag?: boolean;
  /** Show a second filter row to browse by producer/artist. */
  showProducerFilter?: boolean;
  /**
   * Full admin-managed category list (from the categories table), so a
   * category shows up as a filter tab even before any track uses it yet.
   * Falls back to deriving flat categories from the given tracks when omitted.
   */
  categoryOptions?: Category[];
};

export function AudioGallery({
  tracks,
  producers = [],
  showProducerTag = false,
  showProducerFilter = false,
  categoryOptions,
}: Props) {
  const hasUncategorized = tracks.some((t) => !t.category);

  const knownCategories: Category[] =
    categoryOptions ??
    Array.from(new Set(tracks.map((t) => t.category).filter(Boolean) as string[])).map((name) => ({
      name,
      parent_name: null,
      track_count: 0,
    }));

  const topLevel = knownCategories.filter((c) => !c.parent_name);
  const childrenOf = (parent: string) => knownCategories.filter((c) => c.parent_name === parent);
  const parentOf = (name: string) => knownCategories.find((c) => c.name === name)?.parent_name ?? null;

  const categoryTabs = [ALL, ...topLevel.map((c) => c.name), ...(hasUncategorized ? [OTHER] : [])];
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [activeSubcategory, setActiveSubcategory] = useState(ALL);

  const subOptions = activeCategory !== ALL && activeCategory !== OTHER ? childrenOf(activeCategory) : [];

  const producerOptions = ["All", ...producers.map((p) => p.slug)];
  const [activeProducer, setActiveProducer] = useState("All");

  function producerName(slug: string) {
    return producers.find((p) => p.slug === slug)?.name ?? slug;
  }

  function selectCategory(cat: string) {
    setActiveCategory(cat);
    setActiveSubcategory(ALL);
  }

  function categoryLabel(track: Track) {
    if (!track.category) return undefined;
    const parent = parentOf(track.category);
    return parent ? `${parent} / ${track.category}` : undefined;
  }

  const visible = tracks.filter((t) => {
    let matchesCategory: boolean;
    if (activeCategory === ALL) {
      matchesCategory = true;
    } else if (activeCategory === OTHER) {
      matchesCategory = !t.category;
    } else if (activeSubcategory !== ALL) {
      matchesCategory = t.category === activeSubcategory;
    } else {
      matchesCategory = t.category === activeCategory || parentOf(t.category ?? "") === activeCategory;
    }
    const matchesProducer = activeProducer === "All" ? true : t.producer_slug === activeProducer;
    return matchesCategory && matchesProducer;
  });

  if (tracks.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {categoryTabs.map((cat) => (
          <button
            key={cat}
            onClick={() => selectCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-saint-light-blue text-saint-matte-black"
                : "bg-white/10 text-saint-gray hover:bg-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {subOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {[ALL, ...subOptions.map((c) => c.name)].map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubcategory(sub)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeSubcategory === sub
                  ? "bg-saint-purple text-saint-white"
                  : "bg-white/5 text-saint-gray hover:bg-white/10"
              }`}
            >
              {sub === ALL ? `All ${activeCategory}` : sub}
            </button>
          ))}
        </div>
      )}

      {showProducerFilter && producers.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {producerOptions.map((slug) => (
            <button
              key={slug}
              onClick={() => setActiveProducer(slug)}
              className={`px-4 py-1 rounded-full text-xs uppercase tracking-widest font-medium transition-colors ${
                activeProducer === slug
                  ? "bg-saint-purple text-saint-white"
                  : "bg-white/5 text-saint-gray hover:bg-white/10"
              }`}
            >
              {slug === "All" ? "All Producers" : producerName(slug)}
            </button>
          ))}
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${showProducerFilter ? "" : "mt-3"}`}>
        {visible.map((track) => (
          <AudioPlayer
            key={track.id}
            track={track}
            producerName={showProducerTag ? producerName(track.producer_slug) : undefined}
            categoryLabel={categoryLabel(track)}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-saint-gray text-sm">No tracks match these filters.</p>
      )}
    </div>
  );
}
