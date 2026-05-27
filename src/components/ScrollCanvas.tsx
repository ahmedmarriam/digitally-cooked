"use client";

import { useEffect, useRef } from "react";

/* ── constants ─────────────────────────────────────────────── */
const PLATFORM_ORBS = [
  { color: 0xec4899, radius: 6,  speed: 0.35, startAngle: 0               }, // Instagram
  { color: 0x8b5cf6, radius: 8,  speed: 0.22, startAngle: Math.PI * 0.4  }, // TikTok
  { color: 0x60a5fa, radius: 5,  speed: 0.28, startAngle: Math.PI        }, // LinkedIn
  { color: 0x818cf8, radius: 9,  speed: 0.18, startAngle: Math.PI * 1.5  }, // Facebook
  { color: 0xf87171, radius: 4.5,speed: 0.42, startAngle: Math.PI * 0.7  }, // YouTube
];

const PURPLE  = [0.48, 0.18, 1.0 ] as const;
const CORAL   = [1.0,  0.42, 0.42] as const;
const LAVEND  = [0.65, 0.55, 0.98] as const;
const WHITE   = [1.0,  1.0,  1.0 ] as const;
const GREEN   = [0.2,  0.9,  0.5 ] as const;
const GOLD    = [1.0,  0.84, 0.2 ] as const;
const PALETTE = [PURPLE, CORAL, LAVEND, WHITE] as const;

const smoothstep = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

const lerpArrays = (a: Float32Array, b: Float32Array, t: number, out: Float32Array) => {
  const e = smoothstep(t);
  for (let i = 0; i < out.length; i++) out[i] = a[i] + (b[i] - a[i]) * e;
};

/* ── component ─────────────────────────────────────────────── */
export default function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    let rafId: number;
    let renderer: import("three").WebGLRenderer;
    let onScrollFn: () => void;
    let onMouseFn: (e: MouseEvent) => void;
    let onResizeFn: () => void;

    (async () => {
      const THREE = await import("three");

      /* ── renderer ────────────────────────────────────────── */
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(window.innerWidth, window.innerHeight);

      /* ── scene / camera ──────────────────────────────────── */
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
      camera.position.z = 14;

      /* ── particle count (mobile-aware) ───────────────────── */
      const isMobile = window.innerWidth < 768;
      const COUNT = isMobile ? 180 : 500;

      /* ── helper: generate positions ──────────────────────── */
      const heroPositions     = new Float32Array(COUNT * 3);
      const convergePositions = new Float32Array(COUNT * 3);
      const gridPositions     = new Float32Array(COUNT * 3);
      const chartPositions    = new Float32Array(COUNT * 3);
      const currentPositions  = new Float32Array(COUNT * 3);
      const colors            = new Float32Array(COUNT * 3);

      // Hero: sphere cloud
      for (let i = 0; i < COUNT; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        const r     = 3.5 + Math.random() * 8;
        heroPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        heroPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        heroPositions[i * 3 + 2] = r * Math.cos(phi) - 1;
      }

      // Converge: tight cluster at centre
      for (let i = 0; i < COUNT; i++) {
        convergePositions[i * 3]     = (Math.random() - 0.5) * 1.8;
        convergePositions[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
        convergePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
      }

      // Grid: post-card lattice
      const cols = Math.ceil(Math.sqrt(COUNT * 1.6));
      const rows = Math.ceil(COUNT / cols);
      for (let i = 0; i < COUNT; i++) {
        const c = i % cols;
        const r = Math.floor(i / cols);
        gridPositions[i * 3]     = (c / (cols - 1) - 0.5) * 18;
        gridPositions[i * 3 + 1] = -(r / (rows - 1) - 0.5) * 11;
        gridPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      }

      // Chart: 5 rising bars
      const BARS = 5;
      const barHeights = [4, 6.5, 9, 7, 11];
      for (let i = 0; i < COUNT; i++) {
        const bar    = i % BARS;
        const frac   = Math.floor(i / BARS) / Math.floor(COUNT / BARS);
        chartPositions[i * 3]     = (bar / (BARS - 1) - 0.5) * 12;
        chartPositions[i * 3 + 1] = -6 + frac * barHeights[bar] + (Math.random() - 0.5) * 0.4;
        chartPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      }

      // Assign vertex colours (mix of purple/coral/lavender/white)
      for (let i = 0; i < COUNT; i++) {
        const c = PALETTE[i % PALETTE.length];
        colors[i * 3]     = c[0];
        colors[i * 3 + 1] = c[1];
        colors[i * 3 + 2] = c[2];
      }

      currentPositions.set(heroPositions);

      /* ── geometry + points ───────────────────────────────── */
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
      geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: isMobile ? 0.065 : 0.09,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);

      /* ── platform orbs ───────────────────────────────────── */
      const orbGroups: { group: import("three").Group; angle: number; radius: number; speed: number }[] = [];

      PLATFORM_ORBS.forEach((data) => {
        const group = new THREE.Group();

        // inner sphere
        const inner = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 12, 12),
          new THREE.MeshBasicMaterial({ color: data.color })
        );
        group.add(inner);

        // glow ring
        const glow = new THREE.Mesh(
          new THREE.SphereGeometry(0.42, 12, 12),
          new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: 0.12 })
        );
        group.add(glow);

        scene.add(group);
        orbGroups.push({ group, angle: data.startAngle, radius: data.radius, speed: data.speed });
      });

      /* ── centre glow ─────────────────────────────────────── */
      const centreGlow = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x7b2fff, transparent: true, opacity: 0 })
      );
      scene.add(centreGlow);

      /* ── scroll + mouse state ────────────────────────────── */
      let scrollProgress = 0;
      let targetCamX = 0, targetCamY = 0;
      let camX = 0, camY = 0;
      const clock = new THREE.Clock();

      onScrollFn = () => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        scrollProgress = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
      };
      onMouseFn = (e: MouseEvent) => {
        targetCamX = (e.clientX / window.innerWidth  - 0.5) * 2.5;
        targetCamY = (e.clientY / window.innerHeight - 0.5) * 1.5;
      };
      onResizeFn = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };

      window.addEventListener("scroll",    onScrollFn, { passive: true });
      window.addEventListener("mousemove", onMouseFn,  { passive: true });
      window.addEventListener("resize",    onResizeFn, { passive: true });

      /* ── colour interpolation helpers ───────────────────────*/
      const heroColours    = new Float32Array(colors);                    // purple/coral/white
      const gridColours    = new Float32Array(COUNT * 3);                 // platform colours
      const chartColours   = new Float32Array(COUNT * 3);                 // green/gold
      const currentColours = new Float32Array(colors);

      const gridPlatformColors = [
        [0.93, 0.28, 0.60], // pink
        [0.55, 0.36, 0.98], // purple
        [0.38, 0.64, 0.98], // blue
        [0.51, 0.51, 0.97], // indigo
        [0.97, 0.53, 0.53], // coral-red
      ];
      for (let i = 0; i < COUNT; i++) {
        const c = gridPlatformColors[i % gridPlatformColors.length];
        gridColours[i * 3] = c[0]; gridColours[i * 3 + 1] = c[1]; gridColours[i * 3 + 2] = c[2];
      }
      for (let i = 0; i < COUNT; i++) {
        const c = i % 2 === 0 ? GREEN : GOLD;
        chartColours[i * 3] = c[0]; chartColours[i * 3 + 1] = c[1]; chartColours[i * 3 + 2] = c[2];
      }

      /* ── animation loop ──────────────────────────────────── */
      const animate = () => {
        rafId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const sp    = scrollProgress;

        /* --- particle positions by phase --- */
        if (sp < 0.18) {
          currentPositions.set(heroPositions);
          currentColours.set(heroColours);
        } else if (sp < 0.38) {
          lerpArrays(heroPositions,     convergePositions, (sp - 0.18) / 0.20, currentPositions);
          lerpArrays(heroColours,       heroColours,       0,                   currentColours);
        } else if (sp < 0.62) {
          lerpArrays(convergePositions, gridPositions,     (sp - 0.38) / 0.24, currentPositions);
          lerpArrays(heroColours,       gridColours,       (sp - 0.38) / 0.24, currentColours);
        } else {
          lerpArrays(gridPositions,     chartPositions,    (sp - 0.62) / 0.38, currentPositions);
          lerpArrays(gridColours,       chartColours,      (sp - 0.62) / 0.38, currentColours);
        }

        geo.attributes.position.needsUpdate = true;
        geo.attributes.color.needsUpdate    = true;

        /* --- orb orbiting --- */
        const orbVisible = sp < 0.35;
        const orbScale   = orbVisible ? Math.max(0, 1 - (sp - 0.20) / 0.15) : 0;
        orbGroups.forEach((o) => {
          o.angle += o.speed * delta;
          o.group.position.x  = Math.cos(o.angle) * o.radius;
          o.group.position.z  = Math.sin(o.angle) * o.radius;
          o.group.position.y  = Math.sin(o.angle * 1.7) * 1.8;
          o.group.scale.setScalar(orbScale);
        });

        /* --- centre glow on converge --- */
        const glowOpacity = smoothstep(Math.min(1, Math.max(0, (sp - 0.28) / 0.12)));
        (centreGlow.material as import("three").MeshBasicMaterial).opacity = glowOpacity * 0.25;

        /* --- particle point rotation --- */
        points.rotation.y += delta * 0.04 * (1 - Math.min(1, sp / 0.4));

        /* --- camera parallax --- */
        camX += (targetCamX - camX) * 0.04;
        camY += (-targetCamY - camY) * 0.04;
        camera.position.x = camX;
        camera.position.y = camY + 0;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      animate();
    })();

    return () => {
      cancelAnimationFrame(rafId);
      renderer?.dispose();
      if (onScrollFn)  window.removeEventListener("scroll",    onScrollFn);
      if (onMouseFn)   window.removeEventListener("mousemove", onMouseFn);
      if (onResizeFn)  window.removeEventListener("resize",    onResizeFn);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
