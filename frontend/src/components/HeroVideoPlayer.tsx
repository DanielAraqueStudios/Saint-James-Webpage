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
// guaranteed to work everywhere — that part isn't configurable, and the
// browser's own `autoPlay` handles that initial muted playback (we never
// call .play() ourselves for it, so there's nothing to race against it).
// When the admin has sound enabled (mutedByDefault === false), we try to
// upgrade to unmuted at the configured volume: if the element is already
// playing (the common case — muted autoplay already succeeded) we just flip
// `.muted`/`.volume` with no extra play() call, so there's no
// interrupted-request AbortError to misread as an autoplay-policy block. We
// only call `.play()` ourselves if the element is genuinely paused, and only
// a rejection of *that* call counts as "browser blocked it".
//
// A `volumechange` listener keeps the `unmuted` UI state mirroring the real
// `el.muted` value at all times (including after the fallback path), so the
// button can never show a state the video isn't actually in.
export function HeroVideoPlayer({ videoUrl, mutedByDefault, volume }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [unmuted, setUnmuted] = useState(false);

  // Mirror the element's real muted state into React state, whatever caused
  // the change (our code, or the browser).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const syncFromEl = () => setUnmuted(!el.muted);
    el.addEventListener("volumechange", syncFromEl);
    return () => el.removeEventListener("volumechange", syncFromEl);
  }, [videoUrl]);

  useEffect(() => {
    if (mutedByDefault) return;
    const el = videoRef.current;
    if (!el) return;

    el.volume = volume;

    if (!el.paused) {
      // Muted autoplay is already running — just upgrade it in place.
      el.muted = false;
      return;
    }

    // Not playing yet (autoplay hasn't kicked in, or was blocked outright).
    // This is the only play() call we make, so a rejection here is a real
    // autoplay-policy block, not a race with the browser's own attempt.
    el.muted = false;
    el.play().catch(() => {
      el.muted = true;
    });
  }, [mutedByDefault, volume, videoUrl]);

  // Re-apply the configured volume if the admin changes it after the visitor
  // is already listening.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || el.muted) return;
    el.volume = volume;
  }, [volume]);

  function handleUnmute() {
    const el = videoRef.current;
    if (!el) return;
    el.volume = volume;
    el.muted = false;
    if (el.paused) el.play().catch(() => {});
  }

  function handleMute() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
  }

  return (
    <>
      <video
        ref={videoRef}
        key={videoUrl}
        className="h-dvh w-full object-cover"
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
