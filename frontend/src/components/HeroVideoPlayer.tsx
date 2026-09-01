"use client";

import { useRef, useState } from "react";

type Props = {
  videoUrl: string;
  /** Admin's "no sound" toggle — when true, the unmute control isn't shown at all. */
  mutedByDefault: boolean;
  /** 0–1, applied once a visitor unmutes. */
  volume: number;
};

// Browsers block autoplay-with-sound unconditionally, so the <video> below
// always starts muted — that part isn't configurable. What the admin panel
// controls is what happens once a visitor clicks unmute: nothing (if the
// admin turned sound off entirely) or playback at the configured volume.
export function HeroVideoPlayer({ videoUrl, mutedByDefault, volume }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [unmuted, setUnmuted] = useState(false);

  function handleUnmute() {
    const el = videoRef.current;
    if (!el) return;
    el.volume = volume;
    el.muted = false;
    setUnmuted(true);
  }

  function handleMute() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    setUnmuted(false);
  }

  return (
    <>
      <video
        ref={videoRef}
        key={videoUrl}
        className="h-screen w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label="Saints Productions visual reel"
      >
        <source src={videoUrl} />
      </video>

      {!mutedByDefault && (
        <button
          type="button"
          onClick={unmuted ? handleMute : handleUnmute}
          aria-label={unmuted ? "Mute video" : "Unmute video"}
          className="absolute bottom-8 right-8 z-10 rounded-full border border-saint-gray/40 bg-saint-vivid-black/60 px-4 py-2 text-sm text-saint-white backdrop-blur transition-colors hover:border-saint-light-blue hover:text-saint-light-blue"
        >
          {unmuted ? "Mute" : "Unmute"}
        </button>
      )}
    </>
  );
}
