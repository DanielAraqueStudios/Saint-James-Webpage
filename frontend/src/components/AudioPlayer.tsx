"use client";

import { useRef, useState } from "react";
import { Track, audioUrl } from "@/lib/api";

type Props = {
  track: Track;
  producerName?: string;
};

export function AudioPlayer({ track, producerName }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }

  function onTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress(audio.currentTime / audio.duration);
  }

  function onLoadedMetadata() {
    setDuration(audioRef.current?.duration ?? 0);
  }

  function onEnded() {
    setPlaying(false);
    setProgress(0);
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  }

  function fmt(s: number) {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <div className="bg-saint-charcoal border border-white/10 rounded-xl p-4 flex flex-col gap-3">
      <audio
        ref={audioRef}
        src={audioUrl(track.filename)}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        preload="metadata"
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{track.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs bg-saint-purple/30 text-saint-light-blue px-2 py-0.5 rounded-full">
              {track.category}
            </span>
            {producerName && (
              <span className="text-xs text-saint-gray">{producerName}</span>
            )}
            <span className="text-xs text-saint-gray uppercase">{track.format}</span>
          </div>
        </div>

        <button
          onClick={toggle}
          className="w-10 h-10 rounded-full bg-saint-light-blue/20 hover:bg-saint-light-blue/40 flex items-center justify-center shrink-0 transition-colors"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg className="w-4 h-4 text-saint-light-blue" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-saint-light-blue ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-saint-gray w-8 shrink-0">
          {fmt((audioRef.current?.currentTime ?? 0))}
        </span>
        <div
          className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer relative"
          onClick={seek}
        >
          <div
            className="absolute left-0 top-0 h-full bg-saint-light-blue rounded-full transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-xs text-saint-gray w-8 shrink-0 text-right">{fmt(duration)}</span>
      </div>
    </div>
  );
}
