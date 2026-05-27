"use client";

import { useEffect, useRef } from "react";

/* ── math ───────────────────────────────────────────────────── */
const ss    = (t: number) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); };
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const ph    = (sp: number, s: number, e: number) => ss((sp - s) / (e - s));
const lerpA = (a: Float32Array, b: Float32Array, t: number, o: Float32Array) => {
  const e = ss(t);
  for (let i = 0; i < o.length; i++) o[i] = a[i] + (b[i] - a[i]) * e;
};

/* ── GLSL shaders ────────────────────────────────────────────── */
const VERT = /* glsl */`
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3  aColor;
  varying   vec3  vColor;
  varying   float vAlpha;
  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (380.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */`
  varying vec3  vColor;
  varying float vAlpha;
  void main() {
    vec2  uv   = gl_PointCoord - 0.5;
    float d    = length(uv);
    if (d > 0.5) discard;
    float core = 1.0 - smoothstep(0.0,  0.18, d);
    float glow = 1.0 - smoothstep(0.18, 0.50, d);
    float a    = (core * 0.80 + glow * 0.30) * vAlpha;
    gl_FragColor = vec4(vColor + glow * 0.40, a);
  }
`;

/* ── platform config ─────────────────────────────────────────── */
const PLAT = [
  { color: [0.93,0.28,0.60] as const },  // IG   pink
  { color: [0.67,0.55,0.99] as const },  // TK   purple
  { color: [0.38,0.65,0.98] as const },  // LI   blue
  { color: [0.51,0.51,0.97] as const },  // FB   indigo
  { color: [0.97,0.53,0.53] as const },  // YT   red
  { color: [0.24,0.74,0.95] as const },  // X    cyan
  { color: [0.96,0.27,0.37] as const },  // PI   rose
];

/* ── component ───────────────────────────────────────────────── */
export default function ScrollCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const canvas = ref.current;

    let raf = 0;
    let scrFn  = () => {};
    let mousFn = (_e: MouseEvent) => {};
    let resFn  = () => {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderer: any;

    (async () => {
      const THREE = await import("three");

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(window.innerWidth, window.innerHeight);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 500);
      camera.position.z = 22;

      const isMobile = window.innerWidth < 768;
      const COUNT    = isMobile ? 1400 : 3600;
      const STREAMS  = isMobile ? 12 : 20;
      const PPS      = Math.floor(COUNT / STREAMS); // particles per stream

      /* ── position / colour buffers ─────────────────────── */
      const p1 = new Float32Array(COUNT * 3); // streams
      const p2 = new Float32Array(COUNT * 3); // vortex
      const p3 = new Float32Array(COUNT * 3); // posts
      const pc = new Float32Array(COUNT * 3); // current

      const c1 = new Float32Array(COUNT * 3);
      const c2 = new Float32Array(COUNT * 3);
      const c3 = new Float32Array(COUNT * 3);
      const cc = new Float32Array(COUNT * 3);

      const sizes  = new Float32Array(COUNT);
      const alphas = new Float32Array(COUNT);

      /* ── Formation 1: vertical data streams ─────────────── */
      const STREAM_PALETTE = [
        [0.55,0.36,0.98],[0.93,0.28,0.60],[0.70,0.42,0.99],
        [0.38,0.48,0.98],[0.80,0.22,0.82],
      ] as const;

      for (let s = 0; s < STREAMS; s++) {
        const sx  = -14 + (s / (STREAMS - 1)) * 28;
        const sz  = (Math.random() - 0.5) * 5;
        const col = STREAM_PALETTE[s % STREAM_PALETTE.length];
        for (let j = 0; j < PPS; j++) {
          const i = s * PPS + j;
          if (i >= COUNT) break;
          p1[i*3]   = sx + (Math.random() - 0.5) * 0.9;
          p1[i*3+1] = -14 + Math.random() * 28;
          p1[i*3+2] = sz  + (Math.random() - 0.5) * 0.6;
          const br  = 0.65 + Math.random() * 0.35;
          c1[i*3]   = col[0] * br;
          c1[i*3+1] = col[1] * br;
          c1[i*3+2] = col[2] * br;
          sizes[i]  = 0.5 + Math.random() * 1.3;
          alphas[i] = 0.28 + Math.random() * 0.62;
        }
      }

      /* ── Formation 2: vortex spiral ─────────────────────── */
      for (let i = 0; i < COUNT; i++) {
        const t      = i / COUNT;
        const arm    = i % 3;
        const offset = (arm / 3) * Math.PI * 2;
        const angle  = offset + t * Math.PI * 9;
        const r      = 0.4 + t * 10.5;
        const hs     = Math.pow(1 - t, 0.5) * 3.5;

        p2[i*3]   = Math.cos(angle) * r;
        p2[i*3+1] = (Math.random() - 0.5) * hs * 2;
        p2[i*3+2] = Math.sin(angle) * r;

        // pink outer → purple core
        const core  = 1 - r / 11;
        c2[i*3]   = lerp(0.93, 0.55, core);
        c2[i*3+1] = lerp(0.28, 0.20, core);
        c2[i*3+2] = lerp(0.60, 0.98, core);
      }

      /* ── Formation 3: posts bursting to platforms ────────── */
      for (let i = 0; i < COUNT; i++) {
        const pi2   = i % PLAT.length;
        const pc2   = PLAT[pi2].color;
        const baseA = (pi2 / PLAT.length) * Math.PI * 2;

        // Each platform cluster: outward cone + varying depth
        const spread = 2.8;
        const r      = 5 + Math.random() * 7;
        p3[i*3]   = Math.cos(baseA) * r + (Math.random() - 0.5) * spread;
        p3[i*3+1] = Math.sin(baseA) * r + (Math.random() - 0.5) * spread;
        p3[i*3+2] = -3 + Math.random() * 14; // depth — some fly toward viewer

        c3[i*3]=pc2[0]; c3[i*3+1]=pc2[1]; c3[i*3+2]=pc2[2];
      }

      pc.set(p1); cc.set(c1);

      /* ── geometry ────────────────────────────────────────── */
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pc,    3));
      geo.setAttribute("aColor",   new THREE.BufferAttribute(cc,    3));
      geo.setAttribute("aSize",    new THREE.BufferAttribute(sizes, 1));
      geo.setAttribute("aAlpha",   new THREE.BufferAttribute(alphas,1));

      const mat = new THREE.ShaderMaterial({
        vertexShader:   VERT,
        fragmentShader: FRAG,
        transparent:    true,
        depthWrite:     false,
        blending:       THREE.AdditiveBlending,
      });

      const pts = new THREE.Points(geo, mat);
      scene.add(pts);

      /* ── state ───────────────────────────────────────────── */
      let sp         = 0;
      let mX = 0, mY = 0;
      let cX = 0, cY = 0;
      let vAngle     = 0;

      scrFn = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        sp = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      };
      mousFn = (e: MouseEvent) => {
        mX = (e.clientX / window.innerWidth  - 0.5) * 2;
        mY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      resFn = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };

      window.addEventListener("scroll",    scrFn,  { passive: true });
      window.addEventListener("mousemove", mousFn, { passive: true });
      window.addEventListener("resize",    resFn);

      /* ── render loop ─────────────────────────────────────── */
      const FALL   = 0.065;
      const YMIN   = -14;
      const YRANGE = 28;

      const tick = () => {
        raf = requestAnimationFrame(tick);

        /* 1 ─ animate falling streams */
        const fallStrength = 1 - ph(sp, 0.12, 0.42);
        if (fallStrength > 0.01) {
          for (let i = 0; i < COUNT; i++) {
            p1[i*3+1] -= FALL * fallStrength;
            if (p1[i*3+1] < YMIN) p1[i*3+1] += YRANGE;
          }
        }

        /* 2 ─ spin the vortex */
        const spinStrength = ph(sp, 0.12, 0.62) * (1 - ph(sp, 0.55, 0.75));
        if (spinStrength > 0.01) {
          vAngle += 0.014 * spinStrength;
          const cos = Math.cos(vAngle);
          const sin = Math.sin(vAngle);
          for (let i = 0; i < COUNT; i++) {
            const x = p2[i*3], z = p2[i*3+2];
            p2[i*3]   = x * cos - z * sin;
            p2[i*3+2] = x * sin + z * cos;
          }
        }

        /* 3 ─ lerp between formations */
        const toVortex = ph(sp, 0.16, 0.48);
        const toPosts  = ph(sp, 0.55, 0.84);

        if (toPosts > 0.005) {
          lerpA(p2, p3, toPosts, pc);
          lerpA(c2, c3, toPosts, cc);
        } else if (toVortex > 0.005) {
          lerpA(p1, p2, toVortex, pc);
          lerpA(c1, c2, toVortex, cc);
        } else {
          pc.set(p1); cc.set(c1);
        }

        geo.attributes.position.needsUpdate = true;
        geo.attributes.aColor.needsUpdate   = true;

        /* 4 ─ mouse parallax on camera */
        cX = lerp(cX, mX * 2.8, 0.04);
        cY = lerp(cY, -mY * 1.8, 0.04);
        camera.position.x = cX;
        camera.position.y = cY;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      tick();
    })();

    return () => {
      cancelAnimationFrame(raf);
      renderer?.dispose();
      window.removeEventListener("scroll",    scrFn);
      window.removeEventListener("mousemove", mousFn);
      window.removeEventListener("resize",    resFn);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
