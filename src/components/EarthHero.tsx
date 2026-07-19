"use client";

import { useState } from "react";

const SRC = "/media/earth-loop.mp4";

export function EarthHero() {
  const [available, setAvailable] = useState(true);

  if (!available) {
    // Graceful fallback: quiet paper-toned panel instead of a broken video.
    return (
      <div className="h-full w-full rounded-2xl border border-border bg-panel-2 flex items-center justify-center">
        <p className="text-xs mono text-muted px-6 text-center">
          Add public/media/earth-loop.mp4 to enable the hero video
        </p>
      </div>
    );
  }

  return (
    <video
      className="h-full w-full rounded-2xl object-cover border border-border"
      src={SRC}
      autoPlay
      loop
      muted
      playsInline
      onError={() => setAvailable(false)}
    />
  );
}
