import { useId, type AnchorHTMLAttributes, type ReactNode } from "react";

export function LogoMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M2.5 12.2 15.2 3.6a1.5 1.5 0 0 1 1.6 0l12.7 8.6c-8.6 1.8-18.4 1.8-27 0Z" fill="currentColor" />
      <path d="M7 16h16v3.5A7.5 7.5 0 0 1 15.5 27h-1A7.5 7.5 0 0 1 7 19.5V16Z" fill="currentColor" />
      <path
        d="M23 17.5h1.25a2.75 2.75 0 0 1 0 5.5H22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-orange text-ink shadow-[0_0_24px_-4px_rgb(255_106_19/0.8)]">
        <LogoMark className="size-6" />
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight">VIETCAPHE</span>
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-orange ${className}`}>
      <span className="h-px w-8 bg-orange" />
      {children}
    </p>
  );
}

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "primary" | "ghost" };

export function ButtonLink({ variant = "primary", className = "", children, ...rest }: ButtonProps) {
  const base =
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-[15px] font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange";
  const styles =
    variant === "primary"
      ? "bg-orange text-ink shadow-[inset_0_0_0_1px_rgb(255_255_255/0.15),0_10px_40px_-10px_rgb(255_106_19/0.75)] hover:bg-[#ff7a2b] hover:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.2),0_14px_60px_-8px_rgb(255_106_19/0.95)]"
      : "border border-white/15 bg-white/[0.03] text-cream backdrop-blur hover:border-white/30 hover:bg-white/[0.07]";

  return (
    <a className={`${base} ${styles} ${className}`} {...rest}>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      )}
      <span className="relative flex items-center gap-2">{children}</span>
    </a>
  );
}

const tagColors = {
  orange: "border-orange/30 bg-orange/10 text-orange",
  amber: "border-amber/30 bg-amber/10 text-amber",
  rose: "border-rose/30 bg-rose/10 text-rose",
  leaf: "border-leaf/30 bg-leaf/10 text-leaf",
} as const;

export type TagColor = keyof typeof tagColors;

export function Tag({ children, color = "orange" }: { children: ReactNode; color?: TagColor }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] ${tagColors[color]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function Sparkle({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}

export function Bean({
  className = "",
  colors = ["#ffb01f", "#ff6a13", "#ff3d6e"],
}: {
  className?: string;
  colors?: [string, string, string];
}) {
  const id = useId().replaceAll(":", "");
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="0.55" stopColor={colors[1]} />
          <stop offset="1" stopColor={colors[2]} />
        </linearGradient>
        <radialGradient id={`${id}h`} cx="0.32" cy="0.22" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}s`} cx="0.75" cy="0.85" r="0.7">
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="130" rx="86" ry="120" fill={`url(#${id}g)`} />
      <ellipse cx="100" cy="130" rx="86" ry="120" fill={`url(#${id}s)`} />
      <ellipse cx="100" cy="130" rx="86" ry="120" fill={`url(#${id}h)`} />
      <path
        d="M106 16 C 62 72, 142 150, 94 244"
        fill="none"
        stroke="#0a0908"
        strokeOpacity="0.6"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M112 20 C 70 76, 150 152, 102 240"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.18"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
