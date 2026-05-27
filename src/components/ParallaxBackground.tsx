"use client";

import { useEffect, useRef } from "react";

/**
 * Scene 0  — Flying phoenix video (grok-generated, starry sky background)
 * Scenes 1–4 — Unsplash images that crossfade + parallax as user scrolls
 *
 * Saved versions:
 *   "Phoenix Glow" — static PNG with float + colour-breathing glow (pre-video)
 */
const IMG_SCENES = [
  // Scene 1: How It Works / AI — dark matrix/binary code
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
  // Scene 2: Platforms / Social — vibrant colorful gradient
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80",
  // Scene 3: Pricing — deep dark abstract purple/pink
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1920&q=80",
  // Scene 4: Footer / Closing — cosmos, starfield
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&q=80",
];

const PHOENIX_VIDEO    = "/grok-video-8c434a52-6775-4106-9a1b-373a7baf15d4.mp4";
const N                = 5;    // 1 phoenix video + 4 image scenes
const OVERLAP          = 0.14; // crossfade width (fraction of total scroll)
const PARALLAX_STRENGTH = 0.22; // image drift (fraction of viewport height)

export default function ParallaxBackground() {
  const wrapperRefs = useRef<(HTMLDivElement   | null)[]>([]);
  const imgRefs     = useRef<(HTMLImageElement | null)[]>([null, null, null, null]);

  useEffect(() => {
    const tick = () => {
      const scrollY   = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p         = scrollY / maxScroll;

      for (let i = 0; i < N; i++) {
        const wrapper = wrapperRefs.current[i];
        if (!wrapper) continue;

        const start = i / N;
        const end   = (i + 1) / N;

        let opacity: number;
        if (i === 0 && p <= start) {
          opacity = 1;
        } else if (p < start - OVERLAP) {
          opacity = 0;
        } else if (p < start) {
          opacity = (p - (start - OVERLAP)) / OVERLAP;
        } else if (p <= end) {
          opacity = 1;
        } else if (p < end + OVERLAP) {
          opacity = 1 - (p - end) / OVERLAP;
        } else {
          opacity = 0;
        }

        wrapper.style.opacity = opacity.toFixed(3);

        /* parallax drift for image scenes only (1–4) */
        if (i >= 1) {
          const imgEl = imgRefs.current[i - 1];
          if (imgEl) {
            const progress = (p - start) / (end - start);
            const drift    = (progress - 0.5) * window.innerHeight * PARALLAX_STRENGTH;
            imgEl.style.transform = `translateY(${drift.toFixed(1)}px)`;
          }
        }
      }
    };

    window.addEventListener("scroll", tick, { passive: true });
    tick();

    return () => window.removeEventListener("scroll", tick);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position:   "fixed",
        inset:      0,
        zIndex:     -1,
        background: "#04000f",
        overflow:   "hidden",
      }}
    >
      {/* ── Scene 0: Flying phoenix video ───────────────────────── */}
      <div
        ref={el => { wrapperRefs.current[0] = el; }}
        style={{ position: "absolute", inset: 0, opacity: 1, overflow: "hidden" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width:      "100%",
            height:     "100%",
            objectFit:  "cover",
            display:    "block",
          }}
        >
          <source src={PHOENIX_VIDEO} type="video/mp4" />
        </video>
      </div>

      {/* ── Scenes 1–4: Parallax images ─────────────────────────── */}
      {IMG_SCENES.map((url, i) => (
        <div
          key={i}
          ref={el => { wrapperRefs.current[i + 1] = el; }}
          style={{ position: "absolute", inset: 0, opacity: 0, overflow: "hidden" }}
        >
          <img
            ref={el => { imgRefs.current[i] = el; }}
            src={url}
            alt=""
            aria-hidden
            loading="lazy"
            style={{
              width:          "100%",
              height:         `${100 + PARALLAX_STRENGTH * 100}%`,
              objectFit:      "cover",
              objectPosition: "center",
              marginTop:      `-${(PARALLAX_STRENGTH * 100) / 2}%`,
              display:        "block",
              willChange:     "transform",
            }}
          />
        </div>
      ))}

      {/* ── Dark overlay — keeps text readable throughout ─────── */}
      <div
        style={{
          position:      "absolute",
          inset:         0,
          background:    "linear-gradient(to bottom, rgba(4,0,15,0.80) 0%, rgba(4,0,15,0.75) 40%, rgba(4,0,15,0.88) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
