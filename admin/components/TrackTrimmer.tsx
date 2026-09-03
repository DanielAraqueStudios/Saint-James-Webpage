"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin, { Region } from "wavesurfer.js/plugins/regions";

type Props = {
  file: File;
  onChange: (start: number, end: number) => void;
};

function fmt(s: number) {
  if (!isFinite(s)) return "0:00.0";
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(1);
  return `${m}:${sec.padStart(4, "0")}`;
}

export function TrackTrimmer({ file, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const regionRef = useRef<Region | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const url = URL.createObjectURL(file);
    const regions = RegionsPlugin.create();

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#4b5563",
      progressColor: "#3b82f6",
      cursorColor: "#93c5fd",
      height: 72,
      url,
    });
    ws.registerPlugin(regions);
    wsRef.current = ws;
    setReady(false);
    setPlaying(false);

    ws.on("decode", (dur) => {
      setDuration(dur);
      const region = regions.addRegion({
        start: 0,
        end: dur,
        color: "rgba(59, 130, 246, 0.15)",
        drag: true,
        resize: true,
      });
      regionRef.current = region;
      setStart(region.start);
      setEnd(region.end ?? dur);
      onChange(region.start, region.end ?? dur);
      setReady(true);
    });

    regions.on("region-updated", (region) => {
      setStart(region.start);
      setEnd(region.end);
      onChange(region.start, region.end);
    });

    ws.on("finish", () => setPlaying(false));
    ws.on("pause", () => setPlaying(false));

    return () => {
      ws.destroy();
      URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  function togglePlay() {
    const region = regionRef.current;
    if (!region) return;
    if (playing) {
      wsRef.current?.pause();
      setPlaying(false);
    } else {
      region.play(true);
      setPlaying(true);
    }
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-3">
      <div ref={containerRef} className="w-full" />
      {!ready && <p className="text-xs text-gray-500">Loading waveform…</p>}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Start: {fmt(start)}</span>
        <span>End: {fmt(end)}</span>
        <span>Duration: {fmt(duration)}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!ready}
          className="text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-md transition-colors"
        >
          {playing ? "Pause preview" : "Preview selection"}
        </button>
        <span className="text-xs text-gray-500">Drag the shaded region&apos;s edges to set the trim range.</span>
      </div>
    </div>
  );
}
