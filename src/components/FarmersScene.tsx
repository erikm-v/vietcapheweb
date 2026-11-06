import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

/**
 * Three farmers winnow coffee with round bamboo baskets and toss the beans into the air in unison.
 * Every pose is a pure function of scroll progress (0..1), so scrolling back up rewinds the toss.
 */

const TAU = Math.PI * 2;
const LAUNCH = 0.27;
const LAND = 0.79;

type Key = [number, number];
const LIFT: Key[] = [[0, 0], [0.15, -0.3], [0.28, 1], [0.4, 0.12], [0.72, 0.12], [0.8, -0.22], [0.93, 0]];
const CROUCH: Key[] = [[0, 0], [0.15, 1], [0.27, -0.45], [0.4, 0], [0.73, 0], [0.81, 0.75], [0.94, 0]];
const TILT: Key[] = [[0, 0], [0.15, -0.3], [0.26, 1], [0.38, 0], [1, 0]];

type Farmer = {
  shirt: string;
  pants: string;
  skin: string;
  phase: number;
  beans: { u: number; v: number; rot: number; flip: number; jl: number; je: number; peak: number; drift: number; spin: number }[];
  chaff: { u: number; vx: number; vy: number; size: number }[];
};

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeFarmer(seed: number, shirt: string, pants: string, skin: string): Farmer {
  const r = rng(seed);
  const beans = Array.from({ length: 16 }, () => {
    const a = r() * TAU;
    const d = Math.sqrt(r());
    return {
      u: Math.cos(a) * d,
      v: Math.sin(a) * d,
      rot: r() * TAU,
      flip: r() * TAU,
      jl: (r() - 0.5) * 0.025,
      je: (r() - 0.5) * 0.04,
      peak: r(),
      drift: r() - 0.5,
      spin: (r() < 0.5 ? -1 : 1) * (1 + r() * 2),
    };
  });
  const chaff = Array.from({ length: 10 }, () => ({ u: r() - 0.5, vx: 0.3 + r() * 0.6, vy: 0.2 + r() * 0.5, size: 0.004 + r() * 0.006 }));
  return { shirt, pants, skin, phase: r() * TAU, beans, chaff };
}

const FARMERS = [
  makeFarmer(7, "#fffaf2", "#140d09", "#a86a43"),
  makeFarmer(19, "#140d09", "#4a2a16", "#b47650"),
  makeFarmer(31, "#ffc93c", "#140d09", "#99603b"),
];

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function kf(q: number, keys: Key[]) {
  if (q <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i];
    const [t0, v0] = keys[i - 1];
    if (q <= t1) {
      const u = (q - t0) / (t1 - t0);
      return v0 + (v1 - v0) * u * u * (3 - 2 * u);
    }
  }
  return keys[keys.length - 1][1];
}

type Slot = { x: number; ground: number; s: number };

function layout(W: number, H: number) {
  if (W >= 1024) {
    const s = Math.min(H * 0.44, W * 0.24);
    const slots: Slot[] = [
      { x: W * 0.6, ground: H * 0.86, s: s * 0.9 },
      { x: W * 0.9, ground: H * 0.86, s: s * 0.88 },
      { x: W * 0.75, ground: H * 0.93, s },
    ];
    return { slots, order: [0, 1, 2], bean: 0.042, peakTop: H * 0.08, peakBottom: H * 0.4, sun: { x: W * 0.8, y: H * 0.3, r: H * 0.13 } };
  }
  const s = Math.min(H * 0.34, W * 0.5);
  const slots: Slot[] = [
    { x: W * 0.2, ground: H * 0.9, s: s * 0.9 },
    { x: W * 0.8, ground: H * 0.9, s: s * 0.88 },
    { x: W * 0.5, ground: H * 0.95, s },
  ];
  return { slots, order: [0, 1, 2], bean: 0.058, peakTop: H * 0.4, peakBottom: H * 0.56, sun: { x: W * 0.78, y: H * 0.48, r: H * 0.07 } };
}

/** Two-bone IK. Picks the elbow that points away from the body without rising above the shoulder. */
function joint(sx: number, sy: number, hx: number, hy: number, l1: number, l2: number, outward: number) {
  const dx = hx - sx;
  const dy = hy - sy;
  const d = clamp(Math.hypot(dx, dy), Math.abs(l1 - l2) + 0.001, l1 + l2 - 0.001);
  const a = Math.atan2(dy, dx);
  const ang = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const c1: [number, number] = [sx + Math.cos(a + ang) * l1, sy + Math.sin(a + ang) * l1];
  const c2: [number, number] = [sx + Math.cos(a - ang) * l1, sy + Math.sin(a - ang) * l1];
  const ok1 = c1[1] > sy - l1 * 0.15;
  const ok2 = c2[1] > sy - l1 * 0.15;
  if (ok1 && !ok2) return c1;
  if (ok2 && !ok1) return c2;
  return (c1[0] - sx) * outward > (c2[0] - sx) * outward ? c1 : c2;
}

type Pose = { cx: number; cy: number; rx: number; ry: number; roll: number; bodyDY: number; crouch: number };

function pose(slot: Slot, f: Farmer, i: number, q: number, t: number): Pose {
  const { s } = slot;
  const lift = kf(q, LIFT);
  const crouch = kf(q, CROUCH);
  const tilt = kf(q, TILT);
  const breathe = Math.sin(t * 1.6 + f.phase) * 0.004 * s;
  const bodyDY = crouch * 0.05 * s + breathe;
  const rx = 0.17 * s;
  return {
    cx: slot.x,
    cy: slot.ground - 0.5 * s - 0.16 * lift * s + bodyDY,
    rx,
    ry: rx * (0.27 + 0.09 * tilt),
    roll: 0.07 * tilt * (i % 2 ? 1 : -1),
    bodyDY,
    crouch,
  };
}

function heapPoint(p: Pose, u: number, v: number): [number, number] {
  const lx = u * p.rx * 0.7;
  const ly = v * p.ry * 0.5 - p.ry * 0.2;
  const c = Math.cos(p.roll);
  const sn = Math.sin(p.roll);
  return [p.cx + lx * c - ly * sn, p.cy + lx * sn + ly * c];
}

function drawBean(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, rot: number, flip: number) {
  const h = w * 1.38;
  const face = Math.cos(flip);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(0.55 + 0.45 * Math.abs(face), 1);
  const g = ctx.createRadialGradient(-w * 0.16, -h * 0.2, w * 0.04, 0, 0, h * 0.62);
  g.addColorStop(0, face > 0 ? "#9d663a" : "#8a5530");
  g.addColorStop(0.45, "#5c3418");
  g.addColorStop(1, "#261207");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, TAU);
  ctx.fill();
  if (face > 0) {
    ctx.lineCap = "round";
    ctx.strokeStyle = "#170a03";
    ctx.lineWidth = w * 0.11;
    ctx.beginPath();
    ctx.moveTo(w * 0.05, -h * 0.43);
    ctx.bezierCurveTo(-w * 0.24, -h * 0.14, w * 0.24, h * 0.14, -w * 0.05, h * 0.43);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,238,215,0.32)";
  ctx.beginPath();
  ctx.ellipse(-w * 0.21, -h * 0.2, w * 0.07, h * 0.14, -0.4, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawLandscape(ctx: CanvasRenderingContext2D, W: number, H: number, p: number, sun: { x: number; y: number; r: number }) {
  ctx.fillStyle = "#ffc93c";
  ctx.beginPath();
  ctx.arc(sun.x, sun.y - p * H * 0.05, sun.r, 0, TAU);
  ctx.fill();

  const hill = (base: number, amp: number, freq: number, phase: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += W / 48) {
      ctx.lineTo(x, base + Math.sin((x / W) * freq + phase) * amp + Math.sin((x / W) * freq * 2.3 + phase) * amp * 0.35);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
  };
  hill(H * 0.66, H * 0.035, 5, 1.2, "#f4600d");
  hill(H * 0.77, H * 0.03, 4, 3.1, "#e8570a");
}

function drawFarmer(ctx: CanvasRenderingContext2D, slot: Slot, f: Farmer, ps: Pose, beansInBasket: boolean[], bean: number) {
  const { x, ground, s } = slot;
  const y = (v: number) => ground + v * s + ps.bodyDY;
  const hipY = y(-0.45);
  const shY = y(-0.74);
  const headY = y(-0.855);

  // Ground shadow
  ctx.fillStyle = "rgba(130,35,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(x, ground, 0.2 * s, 0.028 * s, 0, 0, TAU);
  ctx.fill();

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Legs
  for (const side of [-1, 1]) {
    const hx = x + side * 0.04 * s;
    const fx = x + side * 0.065 * s;
    const [kx, ky] = joint(hx, hipY + 0.02 * s, fx, ground - 0.01 * s, 0.213 * s, 0.213 * s, side);
    ctx.strokeStyle = f.pants;
    ctx.lineWidth = 0.062 * s;
    ctx.beginPath();
    ctx.moveTo(hx, hipY + 0.02 * s);
    ctx.lineTo(kx, ky);
    ctx.lineTo(fx, ground - 0.01 * s);
    ctx.stroke();
    ctx.fillStyle = "#140d09";
    ctx.beginPath();
    ctx.ellipse(fx + side * 0.01 * s, ground - 0.004 * s, 0.035 * s, 0.013 * s, 0, 0, TAU);
    ctx.fill();
  }

  // Shirt
  ctx.fillStyle = f.shirt;
  ctx.beginPath();
  ctx.moveTo(x - 0.07 * s, shY);
  ctx.quadraticCurveTo(x - 0.108 * s, shY + 0.005 * s, x - 0.11 * s, shY + 0.05 * s);
  ctx.lineTo(x - 0.092 * s, hipY + 0.045 * s);
  ctx.lineTo(x + 0.092 * s, hipY + 0.045 * s);
  ctx.lineTo(x + 0.11 * s, shY + 0.05 * s);
  ctx.quadraticCurveTo(x + 0.108 * s, shY + 0.005 * s, x + 0.07 * s, shY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(20,13,9,0.18)";
  ctx.lineWidth = 0.008 * s;
  ctx.beginPath();
  ctx.moveTo(x, shY + 0.02 * s);
  ctx.lineTo(x, hipY + 0.04 * s);
  ctx.stroke();

  // Neck and head
  ctx.fillStyle = f.skin;
  ctx.fillRect(x - 0.022 * s, headY + 0.03 * s, 0.044 * s, shY - headY - 0.02 * s);
  ctx.beginPath();
  ctx.arc(x, headY, 0.06 * s, 0, TAU);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, headY, 0.06 * s, 0, TAU);
  ctx.clip();
  ctx.fillStyle = "rgba(20,13,9,0.32)";
  ctx.beginPath();
  ctx.ellipse(x, headY - 0.01 * s, 0.08 * s, 0.035 * s, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  // Nón lá
  const apexY = headY - 0.165 * s;
  const baseY = headY - 0.005 * s;
  const hw = 0.2 * s;
  ctx.fillStyle = "#f6eee2";
  ctx.beginPath();
  ctx.moveTo(x, apexY);
  ctx.lineTo(x + hw, baseY);
  ctx.quadraticCurveTo(x, baseY + 0.05 * s, x - hw, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(20,13,9,0.08)";
  ctx.beginPath();
  ctx.moveTo(x, apexY);
  ctx.lineTo(x + hw, baseY);
  ctx.quadraticCurveTo(x + hw * 0.5, baseY + 0.04 * s, x + hw * 0.05, baseY + 0.025 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(20,13,9,0.14)";
  ctx.lineWidth = 0.005 * s;
  for (let k = 1; k <= 3; k++) {
    const yy = lerp(apexY, baseY, k / 4);
    const ww = hw * (k / 4);
    ctx.beginPath();
    ctx.moveTo(x - ww, yy);
    ctx.quadraticCurveTo(x, yy + 0.012 * s * k, x + ww, yy);
    ctx.stroke();
  }

  // Basket
  const { cx, cy, rx, ry, roll } = ps;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(roll);
  ctx.fillStyle = "#8a5226";
  ctx.beginPath();
  ctx.ellipse(0, 0.012 * s, rx, ry, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#c98a4b";
  ctx.beginPath();
  ctx.ellipse(0, 0, rx * 0.95, ry * 0.92, 0, 0, TAU);
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = "rgba(110,60,25,0.35)";
  ctx.lineWidth = 0.004 * s;
  for (let k = 1; k <= 4; k++) {
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 0.95 * (k / 5), ry * 0.92 * (k / 5), 0, 0, TAU);
    ctx.stroke();
  }
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * TAU;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * rx, Math.sin(a) * ry);
    ctx.stroke();
  }
  ctx.restore();
  ctx.restore();

  f.beans.forEach((b, j) => {
    if (!beansInBasket[j]) return;
    const [bx, by] = heapPoint(ps, b.u, b.v);
    drawBean(ctx, bx, by, bean * s, b.rot, b.flip);
  });

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(roll);
  ctx.strokeStyle = "#8a5226";
  ctx.lineWidth = 0.02 * s;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx * 0.97, ry * 0.95, 0, 0.05, Math.PI - 0.05);
  ctx.stroke();
  ctx.restore();

  // Arms, gripping the rim
  for (const side of [-1, 1]) {
    const sx = x + side * 0.095 * s;
    const sy = shY + 0.035 * s;
    const c = Math.cos(roll);
    const sn = Math.sin(roll);
    const lx = side * rx * 0.92;
    const ly = ry * 0.35;
    const hx = cx + lx * c - ly * sn;
    const hy = cy + lx * sn + ly * c;
    const [ex, ey] = joint(sx, sy, hx, hy, 0.13 * s, 0.125 * s, side);
    ctx.strokeStyle = f.shirt;
    ctx.lineWidth = 0.05 * s;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.strokeStyle = f.skin;
    ctx.lineWidth = 0.038 * s;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(hx, hy);
    ctx.stroke();
    ctx.fillStyle = f.skin;
    ctx.beginPath();
    ctx.arc(hx, hy, 0.024 * s, 0, TAU);
    ctx.fill();
  }
}

function draw(ctx: CanvasRenderingContext2D, W: number, H: number, p: number, t: number) {
  ctx.clearRect(0, 0, W, H);
  const { slots, order, bean, peakTop, peakBottom, sun } = layout(W, H);
  drawLandscape(ctx, W, H, p, sun);

  const airborne: (() => void)[] = [];

  order.forEach((i) => {
    const slot = slots[i];
    const f = FARMERS[i];
    const ps = pose(slot, f, i, p, t);
    const inBasket = f.beans.map((b) => p < LAUNCH + b.jl || p > LAND + b.je);

    f.beans.forEach((b, j) => {
      if (inBasket[j]) return;
      const L = LAUNCH + b.jl;
      const E = LAND + b.je;
      const tau = (p - L) / (E - L);
      const [sx, sy] = heapPoint(pose(slot, f, i, L, t), b.u, b.v);
      const [ex, ey] = heapPoint(pose(slot, f, i, E, t), b.u, b.v);
      const peakY = lerp(peakTop, peakBottom, b.peak);
      const h = (sy + ey) / 2 - peakY;
      const bx = lerp(sx, ex, tau) + b.drift * 0.35 * slot.s * Math.sin(Math.PI * tau);
      const by = lerp(sy, ey, tau) - 4 * h * tau * (1 - tau);
      airborne.push(() => drawBean(ctx, bx, by, bean * slot.s, b.rot + b.spin * tau * TAU, b.flip + tau * 7));
    });

    f.chaff.forEach((c) => {
      const tau = (p - LAUNCH) / (LAND - LAUNCH);
      if (tau <= 0 || tau >= 1) return;
      const [sx, sy] = heapPoint(pose(slot, f, i, LAUNCH, t), c.u, 0);
      const cxp = sx + c.vx * slot.s * tau * 1.4;
      const cyp = sy - c.vy * slot.s * Math.sin(Math.PI * tau * 0.8) * 1.6;
      airborne.push(() => {
        ctx.fillStyle = `rgba(255,240,215,${0.75 * (1 - tau)})`;
        ctx.beginPath();
        ctx.ellipse(cxp, cyp, c.size * slot.s * 1.6, c.size * slot.s, tau * 6, 0, TAU);
        ctx.fill();
      });
    });

    drawFarmer(ctx, slot, f, ps, inBasket, bean);
  });

  airborne.forEach((fn) => fn());
}

export function FarmersScene({ progress, className = "" }: { progress: MotionValue<number>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      draw(ctx, W, H, progress.get(), still ? 0 : (now - t0) / 1000);
      raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [progress]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
