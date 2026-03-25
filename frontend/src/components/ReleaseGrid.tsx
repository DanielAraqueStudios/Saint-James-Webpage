"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Real Spotify Public Playlists Extracted
const releasesData = [
  { id: 1, title: "Fresh EDM & House Remixes", type: "Playlist", year: 2026, cover: "bg-zinc-800", embedId: "1xv5fsl2bW1Iq6cTFKQwJf" },
  { id: 2, title: "Techno Club 2026", type: "Playlist", year: 2026, cover: "bg-zinc-700", embedId: "0Ijh3qcWYkfBYnwWDC9kxQ" },
  { id: 3, title: "This Is Sonny Wern", type: "Playlist", year: 2025, cover: "bg-zinc-800", embedId: "37i9dQZF1DZ06evO1lso1i" },
  { id: 4, title: "My 2023 Playlist in a Bottle", type: "Playlist", year: 2023, cover: "bg-zinc-900", embedId: "2GMYqcpW41HzZOwE6Fpm6G" },
];

const filters = ["All", "2026", "2025", "2023", "Playlists"];

export function ReleaseGrid() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredReleases = releasesData.filter((release) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Playlists") return release.type === "Playlist";
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
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
                className="group relative w-full overflow-hidden bg-zinc-900 rounded-lg"
              >
                {/* Embedded Spotify Player with Dark Theme */}
                <iframe 
                  src={`https://open.spotify.com/embed/playlist/${item.embedId}?utm_source=generator&theme=0`} 
                  width="100%" 
                  height="352" 
                  frameBorder="0" 
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  className="rounded-lg shadow-xl"
                />
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
