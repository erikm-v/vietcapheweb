export type CoverTheme = "orange" | "ink" | "yellow" | "cream";

const palettes: Record<CoverTheme, { bg: string; sun: string; hills: [string, string]; dot: string }> = {
  orange: { bg: "#ff6a13", sun: "#ffc93c", hills: ["#f05d0e", "#dc5009"], dot: "#140d09" },
  ink: { bg: "#140d09", sun: "#ff6a13", hills: ["#24170f", "#342116"], dot: "#ffc93c" },
  yellow: { bg: "#ffc93c", sun: "#ff6a13", hills: ["#f5b52a", "#e9a51d"], dot: "#140d09" },
  cream: { bg: "#f6eee2", sun: "#ff6a13", hills: ["#ecdfcb", "#e0cfb5"], dot: "#140d09" },
};

function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function hill(r: () => number, base: number, amp: number) {
  const pts = Array.from({ length: 5 }, (_, i) => [i * 400, base - r() * amp] as const);
  let d = `M0 ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    d += ` C ${x0 + 200} ${y0}, ${x1 - 200} ${y1}, ${x1} ${y1}`;
  }
  return `${d} L1600 900 L0 900 Z`;
}

/** Flat, seeded poster art for a post. Same slug, same picture. */
export function PostCover({
  seed,
  theme = "orange",
  className = "",
  animated = false,
}: {
  seed: string;
  theme?: CoverTheme;
  className?: string;
  /** Adds a slow CSS drift (see .cover-* in index.css). Leave off for static exports like OG images. */
  animated?: boolean;
}) {
  const r = rng(seed);
  const p = palettes[theme];
  const sun = { x: 900 + r() * 500, y: 180 + r() * 160, r: 150 + r() * 90 };
  const beans = Array.from({ length: 4 + Math.floor(r() * 3) }, () => ({
    x: 120 + r() * 1360,
    y: 420 + r() * 380,
    s: 0.55 + r() * 0.9,
    a: r() * 180,
  }));
  const ring = { x: 200 + r() * 500, y: 160 + r() * 200, n: 14 + Math.floor(r() * 10), rad: 70 + r() * 60 };

  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <rect width="1600" height="900" fill={p.bg} />
      <circle cx={sun.x} cy={sun.y} r={sun.r} fill={p.sun} className={animated ? "cover-sun" : undefined} />
      <g className={animated ? "cover-ring" : undefined}>
        {Array.from({ length: ring.n }, (_, i) => {
          const t = (i / ring.n) * Math.PI * 2;
          return <circle key={i} cx={ring.x + Math.cos(t) * ring.rad} cy={ring.y + Math.sin(t) * ring.rad} r={7} fill={p.dot} opacity={0.85} />;
        })}
      </g>
      <path d={hill(r, 600, 140)} fill={p.hills[0]} />
      <path d={hill(r, 760, 120)} fill={p.hills[1]} />
      {beans.map((b, i) => (
        <g
          key={i}
          className={animated ? "cover-bean" : undefined}
          style={animated ? { animationDelay: `${-i * 1.3}s`, animationDuration: `${6 + (i % 3) * 1.5}s` } : undefined}
        >
          <g transform={`translate(${b.x} ${b.y}) rotate(${b.a}) scale(${b.s})`}>
            <ellipse rx="62" ry="86" fill="#5e3519" />
            <ellipse rx="62" ry="86" fill="#2a1408" opacity="0.35" transform="translate(8 8)" style={{ mixBlendMode: "multiply" }} />
            <path d="M6 -78 C -34 -36, 40 22, -6 80" fill="none" stroke="#1f0e05" strokeWidth="11" strokeLinecap="round" />
            <ellipse cx="-28" cy="-34" rx="10" ry="22" transform="rotate(-24 -28 -34)" fill="#fff1df" opacity="0.25" />
          </g>
        </g>
      ))}
    </svg>
  );
}
