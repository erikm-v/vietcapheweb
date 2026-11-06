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
      <span className="grid size-9 place-items-center rounded-xl bg-ink text-orange">
        <LogoMark className="size-6" />
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight">VIETCAPHE</span>
    </span>
  );
}

type ButtonVariant = "dark" | "orange" | "outline" | "outline-light";

const buttonStyles: Record<ButtonVariant, string> = {
  dark: "bg-ink text-cream hover:bg-black",
  orange: "bg-orange text-ink hover:bg-[#ff7d33]",
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-cream",
  "outline-light": "border-2 border-cream/40 text-cream hover:border-cream hover:bg-cream hover:text-ink",
};

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: ButtonVariant };

export function ButtonLink({ variant = "dark", className = "", children, ...rest }: ButtonProps) {
  return (
    <a
      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${buttonStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Highlighter-style block behind a word or phrase. */
export function Mark({ children, className = "bg-cream text-ink" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-block -rotate-1 rounded-[0.18em] px-[0.14em] pb-[0.04em] box-decoration-clone ${className}`}>
      {children}
    </span>
  );
}

/** A roasted coffee bean. */
export function Bean({ className = "" }: { className?: string }) {
  const id = useId().replaceAll(":", "");
  return (
    <svg viewBox="0 0 200 270" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}b`} cx="0.36" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#9a6438" />
          <stop offset="0.45" stopColor="#5e3519" />
          <stop offset="1" stopColor="#2a1408" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="135" rx="88" ry="122" fill={`url(#${id}b)`} />
      <path
        d="M106 18 C 60 76, 144 158, 94 252"
        fill="none"
        stroke="#1a0b04"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M118 26 C 76 84, 160 160, 108 246"
        fill="none"
        stroke="#ffd9b0"
        strokeOpacity="0.25"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse cx="58" cy="88" rx="14" ry="28" transform="rotate(-24 58 88)" fill="#fff1df" fillOpacity="0.28" />
    </svg>
  );
}
