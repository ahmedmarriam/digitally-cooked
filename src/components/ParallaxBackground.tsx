"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scene 0  — Phoenix: background stripped via canvas, full-screen, floating + glowing
 * Scenes 1–4 — Unsplash images that crossfade + parallax as user scrolls
 */
const IMG_SCENES = [
  // Scene 1: How It Works / AI — dark matrix/binary code
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
  // Scene 2: Platforms / Social — vibrant colorful gradient
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80",
  // Scene 3: Pricing — deep dark abstract purple/pink (replaces globe)
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1920&q=80",
  // Scene 4: Footer / Closing — cosmos, starfield
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&q=80",
];

const N                 = 5;    // 1 phoenix + 4 image scenes
const OVERLAP           = 0.14; // crossfade width (fraction of total scroll)
const PARALLAX_STRENGTH = 0.22; // image drift (fraction of viewport height)

export default function ParallaxBackground() {
  const [phoenixSrc, setPhoenixSrc] = useState<string | null>(null);

  const wrapperRefs = useRef<(HTMLDivElement   | null)[]>([]);
  const imgRefs     = useRef<(HTMLImageElement | null)[]>([null, null, null, null]);

  useEffect(() => {
    /* ── Strip white background from Phoenix.png ──────────────────── */
    const img = new Image();
    img.onload = () => {
      const cv  = document.createElement("canvas");
      cv.width  = img.naturalWidth;
      cv.height = img.naturalHeight;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const id  = ctx.getImageData(0, 0, cv.width, cv.height);
      const d   = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const bright = (d[i] + d[i + 1] + d[i + 2]) / 3;
        const sat    = Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]);
        if (bright > 238 && sat < 18) {
          d[i + 3] = 0;
        } else if (bright > 215 && sat < 38) {
          d[i + 3] = Math.round(d[i + 3] * (1 - (bright - 215) / 23));
        }
      }
      ctx.putImageData(id, 0, 0);
      setPhoenixSrc(cv.toDataURL("image/png"));
    };
    img.src = "/Phoenix.png";

    /* ── Scroll: opacity crossfade + parallax ─────────────────────── */
    const tick = () => {
      const scrollY   = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p         = scrollY / maxScroll; // 0 → 1

      for (let i = 0; i < N; i++) {
        const wrapper = wrapperRefs.current[i];
        if (!wrapper) continue;

        const start = i / N;
        const end   = (i + 1) / N;

        let opacity: number;
        if (i === 0 && p <= start) {
          opacity = 1; // phoenix always visible at top of page
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
    <>
      <style>{`
        @keyframes phoenixFloat {
          0%,100% { transform: translateY(0px)   scale(1);     }
          40%     { transform: translateY(-32px)  scale(1.022); }
          70%     { transform: translateY(-16px)  scale(1.010); }
        }
        @keyframes phoenixGlow {
          0%,100% {
            filter: drop-shadow(0 0  55px rgba(236,72,153,.55))
                    drop-shadow(0 0 100px rgba(139,92,246,.35));
          }
          50% {
            filter: drop-shadow(0 0  95px rgba(236,72,153,.90))
                    drop-shadow(0 0 170px rgba(251,191,36,.50))
                    drop-shadow(0 0 130px rgba(139,92,246,.70));
          }
        }
      `}</style>

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
        {/* ── Scene 0: Full-screen floating phoenix ───────────────── */}
        <div
          ref={el => { wrapperRefs.current[0] = el; }}
          style={{
            position:       "absolute",
            inset:          0,
            opacity:        1,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            overflow:       "hidden",
          }}
        >
          {phoenixSrc && (
            <img
              src={phoenixSrc}
              alt=""
              aria-hidden
              style={{
                width:      "95vw",
                height:     "auto",
                maxHeight:  "96vh",
                objectFit:  "contain",
                animation:  "phoenixFloat 8s ease-in-out infinite, phoenixGlow 4s ease-in-out infinite",
                willChange: "transform, filter",
              }}
            />
          )}
        </div>

        {/* ── Scenes 1–4: Parallax images ─────────────────────────── */}
        {IMG_SCENES.map((url, i) => (
          <div
            key={i}
            ref={el => { wrapperRefs.current[i + 1] = el; }}
            style={{
              position: "absolute",
              inset:    0,
              opacity:  0,
              overflow: "hidden",
            }}
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
            background:    "linear-gradient(to bottom, rgba(4,0,15,0.88) 0%, rgba(4,0,15,0.82) 40%, rgba(4,0,15,0.90) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </>
  );
}
