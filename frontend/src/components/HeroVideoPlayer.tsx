"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  videoUrl: string;
  /** Admin's "no sound" toggle — when true, the unmute control isn't shown at all. */
  mutedByDefault: boolean;
  /** 0–1, applied once a visitor unmutes. */
  volume: number;
};

// The <video> below always starts with the `muted` attribute so autoplay is
// guaranteed to work everywhere — that part isn't configurable. When the
// admin has sound enabled (mutedByDefault === false), we immediately try to
// flip it to unmuted + play at the configured volume. Most browsers allow
// that once a visitor has any engagement with the site; when a browser
// blocks it, play()/pause tells us and we fall back to staying muted with
// the button offering to unmute — same UI either way, just whichever the
// browser actually allowed wins.
export function HeroVideoPlayer({ videoUrl, mutedByDefault, volume }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [unmuted, setUnmuted] = useState(false);

  useEffect(() => {
    if (mutedByDefault) return;
    const el = videoRef.current;
    if (!el) return;

    el.volume = volume;
    el.muted = false;
    el
      .play()
      .then(() => {
        if (!el.paused && !el.muted) setUnmuted(true);
      })
      .catch(() => {
        // Browser blocked unmuted autoplay — stay muted, let the visitor
        // opt in via the button.
        el.muted = true;
        setUnmuted(false);
      });
  }, [mutedByDefault, volume, videoUrl]);

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
