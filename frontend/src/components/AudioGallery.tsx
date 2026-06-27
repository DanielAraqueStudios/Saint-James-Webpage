"use client";

import { useState } from "react";
import { Track, Producer } from "@/lib/api";
import { AudioPlayer } from "./AudioPlayer";

type Props = {
  tracks: Track[];
  producers?: Producer[];
  showProducerTag?: boolean;
};

export function AudioGallery({ tracks, producers = [], showProducerTag = false }: Props) {
  const categories = ["All", ...Array.from(new Set(tracks.map((t) => t.category)))];
  const [active, setActive] = useState("All");

  const visible = active === "All" ? tracks : tracks.filter((t) => t.category === active);

  function producerName(slug: string) {
    return producers.find((p) => p.slug === slug)?.name ?? slug;
  }

  if (tracks.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              active === cat
                ? "bg-saint-light-blue text-saint-matte-black"
                : "bg-white/10 text-saint-gray hover:bg-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((track) => (
          <AudioPlayer
            key={track.id}
            track={track}
            producerName={showProducerTag ? producerName(track.producer_slug) : undefined}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-saint-gray text-sm">No tracks in this category.</p>
      )}
    </div>
  );
}
