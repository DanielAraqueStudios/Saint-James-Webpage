"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock JSON Data - This mimics a headless CMS structure
const releasesData = [
  { id: 1, title: "Echoes of Time", type: "Album", year: 2026, cover: "bg-zinc-800" },
  { id: 2, title: "Midnight Frequency", type: "Single", year: 2026, cover: "bg-zinc-700" },
  { id: 3, title: "Solar Flare", type: "Single", year: 2026, cover: "bg-zinc-800" },
  { id: 4, title: "Void Walker", type: "EP", year: 2025, cover: "bg-zinc-900" },
  { id: 5, title: "Neon Gradients", type: "Album", year: 2025, cover: "bg-zinc-700" },
  { id: 6, title: "Pulse", type: "Single", year: 2025, cover: "bg-zinc-800" },
  { id: 7, title: "Resonance", type: "Single", year: 2024, cover: "bg-zinc-900" },
  { id: 8, title: "The Beginning", type: "Album", year: 2024, cover: "bg-zinc-700" },
];

const filters = ["All", "2026", "2025", "Albums", "Singles"];

export function ReleaseGrid() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredReleases = releasesData.filter((release) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Albums") return release.type === "Album";
    if (activeFilter === "Singles") return release.type === "Single" || release.type === "EP";
    return release.year.toString() === activeFilter;
  });

  return (
    <section id="releases" className="w-full bg-black py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-6 md:space-y-0">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight">Releases</h2>
          
          {/* Taxonomic Filter System */}
          <div className="flex flex-wrap gap-4 md:space-x-6 text-sm uppercase tracking-widest text-neutral-500">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`transition-colors pb-1 border-b-2 ${
                  activeFilter === filter
                    ? "text-white border-white"
                    : "border-transparent hover:text-white hover:border-neutral-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Animated Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredReleases.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="group relative aspect-square overflow-hidden cursor-pointer bg-zinc-900"
              >
                {/* Overlay data on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-xs text-neutral-400 uppercase tracking-widest mb-1">
                    {item.type} • {item.year}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
                </div>
                
                {/* Abstract image placeholder (would be next/image in production) */}
                <div className={`absolute inset-0 ${item.cover} group-hover:scale-105 transition-transform duration-700 ease-out`} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredReleases.length === 0 && (
          <div className="text-center py-20 text-neutral-500 uppercase tracking-widest">
            No releases found for this category.
          </div>
        )}
      </div>
    </section>
  );
}
