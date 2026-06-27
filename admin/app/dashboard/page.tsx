"use client";

import { useEffect, useState } from "react";
import { api, Producer, Track } from "@/lib/api";

export default function DashboardPage() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    api.getProducers().then(setProducers).catch(console.error);
    api.getTracks().then(setTracks).catch(console.error);
  }, []);

  const categories = [...new Set(tracks.map((t) => t.category))];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Overview</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Producers" value={producers.length} />
        <StatCard label="Total Tracks" value={tracks.length} />
        <StatCard label="Categories" value={categories.length} />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Producers</h3>
        <div className="grid grid-cols-3 gap-4">
          {producers.map((p) => (
            <div key={p.slug} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-400">{p.role}</p>
              <p className="text-sm text-blue-400 mt-2">
                {tracks.filter((t) => t.producer_slug === p.slug).length} tracks
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-400 mt-1">{label}</p>
    </div>
  );
}
