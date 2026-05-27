"use client";

import { useEffect, useRef } from "react";

/**
 * 5 full-screen scenes mapped to sections of the Digitally Cooked page.
 * Each image is a free Unsplash photo served via their CDN.
 * Swap the URLs here to change the visuals at any time.
 */
const SCENES = [
  {
    // Hero — phone with social media feed, dark background, on-brand for Digitally Cooked
    url: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1920&q=80",
  },
  {
    // How It Works / AI — dark matrix/binary code, clearly digital, doesn't fight text
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
  },
  {
    // Platforms / Social — vibrant colorful gradient, social media energy
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80",
  },
  {
    // Pricing / Features — dark minimal premium tech
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
  },
  {
    // Footer / Closing — cosmos, infinite possibility
    url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&q=80",
  },
];

const OVERLAP = 0.14; // crossfade width as fraction of total scroll (0–1)
const PARALLAX_STRENGTH = 0.22; // how much images drift (fraction of viewport height)

export default function ParallaxBackground() {
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs     = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const N = SCENES.length;

    const tick = () => {
      const scrollY   = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p         = scrollY / maxScroll; // normalised 0–1

      for (let i = 0; i < N; i++) {
        const wrapper = wrapperRefs.current[i];
        const img     = imgRefs.current[i];
        if (!wrapper || !img) continue;

        const start = i / N;
        const end   = (i + 1) / N;

        /* ── opacity: fade-in before start, full across scene, fade-out after end ── */
        let opacity: number;
        if (i === 0 && p <= start) {
          opacity = 1; // first scene always visible at top
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

        /* ── parallax: image drifts at PARALLAX_STRENGTH of viewport height ── */
        const progress = (p - start) / (end - start); // 0→1 within this scene
        const drift    = (progress - 0.5) * window.innerHeight * PARALLAX_STRENGTH;
        img.style.transform = `translateY(${drift.toFixed(1)}px)`;
      }
    };

    window.addEventListener("scroll", tick, { passive: true });
    tick(); // set initial state

    return () => window.removeEventListener("scroll", tick);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position:  "fixed",
        inset:     0,
        zIndex:    -1,
        background: "#04000f", // deep dark base (shows while images load)
        overflow:  "hidden",
      }}
    >
      {SCENES.map((scene, i) => (
        <div
          key={i}
          ref={el => { wrapperRefs.current[i] = el; }}
          style={{
            position: "absolute",
            inset:    0,
            opacity:  i === 0 ? 1 : 0, // first scene visible immediately
            overflow: "hidden",
          }}
        >
          <img
            ref={el => { imgRefs.current[i] = el; }}
            src={scene.url}
            alt=""
            aria-hidden
            loading={i === 0 ? "eager" : "lazy"}
            style={{
              width:          "100%",
              height:         `${100 + PARALLAX_STRENGTH * 100}%`, // extra for drift room
              objectFit:      "cover",
              objectPosition: "center",
              marginTop:      `-${(PARALLAX_STRENGTH * 100) / 2}%`, // centre the extra height
              display:        "block",
              willChange:     "transform",
            }}
          />
        </div>
      ))}

      {/* ── dark overlay: keeps all text readable at every scroll position ── */}
      <div
        style={{
          position:      "absolute",
          inset:         0,
          background:    "linear-gradient(to bottom, rgba(4,0,15,0.88) 0%, rgba(4,0,15,0.82) 40%, rgba(4,0,15,0.90) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
