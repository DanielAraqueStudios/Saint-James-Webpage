"use client";

import { useState } from "react";
import { Track, Producer } from "@/lib/api";
import { AudioPlayer } from "./AudioPlayer";

const OTHER = "Other";

type Props = {
  tracks: Track[];
  producers?: Producer[];
  showProducerTag?: boolean;
  /** Show a second filter row to browse by producer/artist. */
  showProducerFilter?: boolean;
  /**
   * Full admin-managed category list (from the categories table), so a
   * category shows up as a filter tab even before any track uses it yet.
   * Falls back to deriving categories from the given tracks when omitted.
   */
  categoryOptions?: string[];
};

export function AudioGallery({
  tracks,
  producers = [],
  showProducerTag = false,
  showProducerFilter = false,
  categoryOptions,
}: Props) {
  const hasUncategorized = tracks.some((t) => !t.category);
  const knownCategories = categoryOptions ?? Array.from(new Set(tracks.map((t) => t.category).filter(Boolean) as string[]));
  const categories = ["All", ...knownCategories, ...(hasUncategorized ? [OTHER] : [])];
  const [activeCategory, setActiveCategory] = useState("All");

  const producerOptions = ["All", ...producers.map((p) => p.slug)];
  const [activeProducer, setActiveProducer] = useState("All");

  function producerName(slug: string) {
    return producers.find((p) => p.slug === slug)?.name ?? slug;
  }

  const visible = tracks.filter((t) => {
    const matchesCategory =
      activeCategory === "All" ? true : activeCategory === OTHER ? !t.category : t.category === activeCategory;
    const matchesProducer = activeProducer === "All" ? true : t.producer_slug === activeProducer;
    return matchesCategory && matchesProducer;
  });

  if (tracks.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
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
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-saint-gray text-sm">No tracks match these filters.</p>
      )}
    </div>
  );
}
