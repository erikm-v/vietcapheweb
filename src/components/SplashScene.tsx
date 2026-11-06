import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

/**
 * Beans fall into a cup of coffee and splash, driven by scroll progress (0..1).
 * Everything is a pure function of progress, so scrolling back up rewinds the scene.
 */

type BeanSpec = {
  hx: number; // hover x offset from cup centre, in cup widths
  hy: number; // hover y offset from the rim, in cup widths (negative is above)
  rot: number;
  flip: number;
  size: number;
  start: number; // progress at which the bean starts to fall
  hit: number; // progress at which it hits the coffee
  ix: number; // impact x offset from cup centre, in cup widths
  seed: number;
};

const BEANS: BeanSpec[] = [
  { hx: -0.7, hy: -0.8, rot: -0.7, flip: 0.3, size: 1.05, start: 0.03, hit: 0.22, ix: -0.13, seed: 11 },
  { hx: 0.5, hy: -1.1, rot: 0.8, flip: 1.9, size: 0.85, start: 0.13, hit: 0.34, ix: 0.12, seed: 23 },
  { hx: -0.15, hy: -1.45, rot: 2.3, flip: 0.9, size: 1.15, start: 0.24, hit: 0.47, ix: 0.0, seed: 37 },
  { hx: 0.85, hy: -0.55, rot: -1.9, flip: 2.6, size: 0.75, start: 0.36, hit: 0.57, ix: 0.17, seed: 41 },
  { hx: -0.95, hy: -1.3, rot: 1.3, flip: 0.1, size: 0.9, start: 0.46, hit: 0.68, ix: -0.07, seed: 53 },
  { hx: 0.25, hy: -0.45, rot: -0.2, flip: 1.2, size: 0.72, start: 0.57, hit: 0.77, ix: 0.06, seed: 67 },
];

const SPLASH = 0.17;
const RIPPLE = 0.34;
const TAU = Math.PI * 2;

type Drop = { th: number; spread: number; up: number; size: number };

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DROPS: Drop[][] = BEANS.map((b) => {
  const r = rng(b.seed);
  return Array.from({ length: 26 }, () => ({
    th: r() * TAU,
    spread: 0.25 + 0.95 * r(),
    up: 0.8 + 1.9 * r(),
    size: 0.008 + 0.032 * Math.pow(r(), 2),
  }));
});

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function layout(W: number, H: number) {
  if (W >= 1024) {
    const cw = Math.min(W * 0.25, H * 0.38);
    return { cx: W * 0.72, rimY: H * 0.6, cw, spreadX: 0.8, spreadY: 0.78 };
  }
  const cw = Math.min(W * 0.5, H * 0.26);
  return { cx: W * 0.5, rimY: H * 0.7, cw, spreadX: 0.85, spreadY: 0.72 };
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
    ctx.strokeStyle = "rgba(255,214,176,0.28)";
    ctx.lineWidth = w * 0.03;
    ctx.beginPath();
    ctx.moveTo(w * 0.13, -h * 0.39);
    ctx.bezierCurveTo(-w * 0.12, -h * 0.12, w * 0.32, h * 0.14, w * 0.06, h * 0.41);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,238,215,0.32)";
  ctx.beginPath();
  ctx.ellipse(-w * 0.21, -h * 0.2, w * 0.07, h * 0.14, -0.4, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawCrown(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  k: number,
  a: number,
  seed: number,
  side: "back" | "front",
) {
  const grow = 1 - Math.pow(1 - a, 3);
  const r = k * (0.07 + 0.2 * grow);
  const lift = Math.sin(Math.PI * clamp(a / 0.6));
  const h = k * 0.24 * lift;
  if (h < 0.5) return;

  const asp = 0.3;
  const lobes = 5.5;
  const N = 48;
  const from = side === "back" ? Math.PI : 0;
  const to = side === "back" ? TAU : Math.PI;
  const height = (th: number) => 0.35 + 0.65 * Math.pow(Math.abs(Math.sin(th * lobes + seed)), 2.2);
  const topAt = (th: number, extra = 0): [number, number] => {
    const s = height(th);
    return [x + Math.cos(th) * r * (1 + 0.18 * s * lift), y + Math.sin(th) * r * asp - h * s - extra];
  };

  const top = Array.from({ length: N + 1 }, (_, i) => topAt(from + ((to - from) * i) / N));

  ctx.save();
  ctx.globalAlpha = 0.55 + 0.45 * lift;
  ctx.beginPath();
  ctx.moveTo(top[0][0], top[0][1]);
  for (let i = 1; i < top.length - 1; i++) {
    const mx = (top[i][0] + top[i + 1][0]) / 2;
    const my = (top[i][1] + top[i + 1][1]) / 2;
    ctx.quadraticCurveTo(top[i][0], top[i][1], mx, my);
  }
  ctx.lineTo(top[N][0], top[N][1]);
  for (let i = N; i >= 0; i--) {
    const th = from + ((to - from) * i) / N;
    ctx.lineTo(x + Math.cos(th) * r * 0.85, y + Math.sin(th) * r * asp * 0.85);
  }
  ctx.closePath();

  if (side === "back") {
    ctx.fillStyle = "#1a0b04";
  } else {
    const g = ctx.createLinearGradient(0, y - h, 0, y);
    g.addColorStop(0, "#8a5230");
    g.addColorStop(0.35, "#4a2612");
    g.addColorStop(1, "#1d0d05");
    ctx.fillStyle = g;
  }
  ctx.fill();
  ctx.restore();

  // Droplets bead off the crown's tips and lift away as it collapses.
  for (let n = -12; n <= 12; n++) {
    const th = (Math.PI / 2 + n * Math.PI - seed) / lobes;
    if (th < from || th > to) continue;
    const [px, py] = topAt(th, k * 0.04 + k * 0.12 * clamp((a - 0.25) / 0.6));
    drawDrop(ctx, px, py, k * 0.028 * (1 - 0.4 * a), -Math.PI / 2, 0.35);
  }
}

function drawJet(ctx: CanvasRenderingContext2D, x: number, y: number, k: number, a: number) {
  const b = (a - 0.32) / 0.68;
  if (b <= 0 || b >= 1) return;
  const jh = k * 0.62 * Math.sin(Math.PI * b);
  const jw = k * 0.055 * (1 - 0.4 * b);

  const g = ctx.createLinearGradient(x - jw, 0, x + jw, 0);
  g.addColorStop(0, "#1d0d05");
  g.addColorStop(0.35, "#6e3d1f");
  g.addColorStop(1, "#1d0d05");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - jw * 1.8, y);
  ctx.quadraticCurveTo(x - jw, y - jh * 0.45, x - jw * 0.55, y - jh);
  ctx.arc(x, y - jh, jw * 0.55, Math.PI, 0);
  ctx.quadraticCurveTo(x + jw, y - jh * 0.45, x + jw * 1.8, y);
  ctx.closePath();
  ctx.fill();

  if (b > 0.3) {
    const lift = Math.sin((Math.PI * (b - 0.3)) / 0.7);
    const dy = y - jh - k * 0.05 - k * 0.22 * lift;
    drawDrop(ctx, x, dy, jw * 0.85, 0, 0);
  }
}

function drawDrop(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, angle: number, stretch: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = "#24110a";
  ctx.beginPath();
  ctx.ellipse(0, 0, r * (1 + stretch), r, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "rgba(255,232,205,0.55)";
  ctx.beginPath();
  ctx.arc(-r * 0.3, -r * 0.35, r * 0.3, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function draw(ctx: CanvasRenderingContext2D, W: number, H: number, p: number, t: number) {
  ctx.clearRect(0, 0, W, H);
  const { cx, rimY, cw, spreadX, spreadY } = layout(W, H);
  const rx = cw / 2;
  const ery = rx * 0.27;
  const cupH = cw * 0.74;
  const surfY = rimY + ery * 0.14;
  const lrx = rx * 0.9;
  const lry = ery * 0.86;

  // Floor shadow
  const shY = rimY + cupH + ery * 0.2;
  ctx.save();
  ctx.translate(cx, shY);
  ctx.scale(1, 0.2);
  const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 1.7);
  sg.addColorStop(0, "rgba(120,35,0,0.5)");
  sg.addColorStop(1, "rgba(120,35,0,0)");
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.arc(0, 0, rx * 1.7, 0, TAU);
  ctx.fill();
  ctx.restore();

  // Handle
  ctx.save();
  ctx.strokeStyle = "#151515";
  ctx.lineWidth = cw * 0.08;
  ctx.beginPath();
  ctx.ellipse(cx + rx * 0.92, rimY + cupH * 0.36, rx * 0.3, cupH * 0.24, 0, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = cw * 0.014;
  ctx.beginPath();
  ctx.ellipse(cx + rx * 0.92, rimY + cupH * 0.36, rx * 0.33, cupH * 0.27, 0, -Math.PI / 2.4, Math.PI / 3);
  ctx.stroke();
  ctx.restore();

  // Cup body
  const bw = rx * 0.66;
  const by = rimY + cupH;
  const body = new Path2D();
  body.moveTo(cx - rx, rimY);
  body.bezierCurveTo(cx - rx, rimY + cupH * 0.62, cx - bw * 1.15, by - cupH * 0.06, cx - bw, by);
  body.quadraticCurveTo(cx, by + ery * 0.85, cx + bw, by);
  body.bezierCurveTo(cx + bw * 1.15, by - cupH * 0.06, cx + rx, rimY + cupH * 0.62, cx + rx, rimY);
  body.ellipse(cx, rimY, rx, ery, 0, 0, Math.PI);
  body.closePath();
  const bodyG = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0);
  bodyG.addColorStop(0, "#1c1c1c");
  bodyG.addColorStop(0.16, "#424242");
  bodyG.addColorStop(0.3, "#1b1b1b");
  bodyG.addColorStop(0.78, "#0b0b0b");
  bodyG.addColorStop(1, "#1d1d1d");
  ctx.fillStyle = bodyG;
  ctx.fill(body);

  // Opening, coffee and crema
  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath();
  ctx.ellipse(cx, rimY, rx, ery, 0, 0, TAU);
  ctx.fill();

  const lg = ctx.createRadialGradient(cx - lrx * 0.25, surfY - lry * 0.35, 0, cx, surfY, lrx * 1.1);
  lg.addColorStop(0, "#5c3018");
  lg.addColorStop(0.35, "#2f1609");
  lg.addColorStop(1, "#120703");
  ctx.fillStyle = lg;
  ctx.beginPath();
  ctx.ellipse(cx, surfY, lrx, lry, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(170,100,55,0.5)";
  ctx.lineWidth = cw * 0.012;
  ctx.beginPath();
  ctx.ellipse(cx, surfY, lrx * 0.96, lry * 0.94, 0, 0, TAU);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,240,220,0.1)";
  ctx.beginPath();
  ctx.ellipse(cx - lrx * 0.3, surfY - lry * 0.35, lrx * 0.26, lry * 0.2, 0, 0, TAU);
  ctx.fill();

  // Ripples, kept inside the coffee
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, surfY, lrx, lry, 0, 0, TAU);
  ctx.clip();
  BEANS.forEach((b) => {
    const a = (p - b.hit) / RIPPLE;
    if (a <= 0 || a >= 1.4) return;
    const ix = cx + b.ix * cw;
    for (let k = 0; k < 3; k++) {
      const e = clamp((a - k * 0.18) / 0.85);
      if (e <= 0 || e >= 1) continue;
      const r = lrx * (0.08 + 1.15 * e);
      ctx.strokeStyle = `rgba(205,140,90,${0.45 * (1 - e)})`;
      ctx.lineWidth = cw * 0.011 * (1 - e * 0.5);
      ctx.beginPath();
      ctx.ellipse(ix, surfY, r, r * (lry / lrx), 0, 0, TAU);
      ctx.stroke();
    }
  });
  ctx.restore();

  // Rim lip
  ctx.strokeStyle = "#2e2e2e";
  ctx.lineWidth = cw * 0.014;
  ctx.beginPath();
  ctx.ellipse(cx, rimY, rx, ery, 0, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = cw * 0.008;
  ctx.beginPath();
  ctx.ellipse(cx, rimY, rx, ery, 0, Math.PI * 0.15, Math.PI * 0.55);
  ctx.stroke();

  // Steam
  ctx.save();
  ctx.lineCap = "round";
  for (let i = 0; i < 3; i++) {
    const ox = cx + (i - 1) * rx * 0.36;
    const ph = t * 0.7 + i * 2.1;
    ctx.strokeStyle = `rgba(255,246,236,${0.11 + 0.05 * Math.sin(ph)})`;
    ctx.lineWidth = cw * 0.032;
    ctx.beginPath();
    ctx.moveTo(ox, surfY - cw * 0.08);
    ctx.bezierCurveTo(
      ox + Math.sin(ph) * rx * 0.25,
      surfY - cw * 0.32,
      ox - Math.sin(ph + 1) * rx * 0.3,
      surfY - cw * 0.55,
      ox + Math.sin(ph + 2) * rx * 0.2,
      surfY - cw * 0.82,
    );
    ctx.stroke();
  }
  ctx.restore();

  // Splashes
  BEANS.forEach((b, i) => {
    const a = (p - b.hit) / SPLASH;
    if (a <= 0 || a >= 1) return;
    const k = cw * b.size;
    const ix = cx + b.ix * cw;

    drawCrown(ctx, ix, surfY, k, a, b.seed, "back");
    drawJet(ctx, ix, surfY, k, a);

    DROPS[i].forEach((d) => {
      const x0 = ix + Math.cos(d.th) * k * 0.15;
      const y0 = surfY + Math.sin(d.th) * k * 0.045;
      const vx = Math.cos(d.th) * k * d.spread;
      const vu = k * d.up;
      const g = vu / 0.85;
      const dx = x0 + vx * a;
      const dy = y0 - vu * a + g * a * a;
      if (a > 0.08 && dy > y0) return;
      const vy = -vu + 2 * g * a;
      const speed = Math.hypot(vx, vy) / k;
      drawDrop(ctx, dx, dy, k * d.size * (1 - 0.3 * a), Math.atan2(vy, vx), Math.min(1.6, speed * 0.25));
    });

    drawCrown(ctx, ix, surfY, k, a, b.seed, "front");
  });

  // Beans, hidden once they are below the coffee surface
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, surfY);
  ctx.clip();
  BEANS.forEach((b) => {
    if (p >= b.hit) return;
    const f = clamp((p - b.start) / (b.hit - b.start));
    const hoverX = cx + b.hx * cw * spreadX;
    const hoverY = rimY + b.hy * cw * spreadY;
    const ix = cx + b.ix * cw;
    const bob = (1 - f) * Math.sin(t * 1.3 + b.seed) * cw * 0.03;
    const x = hoverX + (ix - hoverX) * easeInOut(f);
    const y = hoverY + bob + (surfY - hoverY) * f * f;
    const rot = b.rot + f * 2.4 + Math.sin(t * 0.8 + b.seed) * 0.06 * (1 - f);
    const flip = b.flip + f * 4 + t * 0.25 * (1 - f);
    drawBean(ctx, x, y, cw * 0.17 * b.size, rot, flip);
  });
  ctx.restore();
}

export function SplashScene({ progress, className = "" }: { progress: MotionValue<number>; className?: string }) {
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
