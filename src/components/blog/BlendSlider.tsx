import { useId, useState } from "react";
import { MotionConfig, motion } from "motion/react";

/** Robusta's caffeine relative to arabica by dry weight (roughly 2.2–2.7% vs 1.2–1.5%). */
const CAFFEINE_RATIO = 1.8;

const bands = [
  { max: 0, name: "All arabica", note: "Your baseline. Brighter acidity, lighter body, a thinner crema that fades faster." },
  { max: 10, name: "A seasoning", note: "Most drinkers won't pick it, but the crema thickens and holds, and the shot feels fuller in milk." },
  { max: 25, name: "Classic espresso blend", note: "The traditional Italian range. Noticeably heavier body, cocoa depth and a crema that survives latte art." },
  { max: 40, name: "Bold milk blend", note: "Built for flat whites and big milk drinks. Strong, chocolatey and long-lasting, with a clear caffeine lift." },
  { max: 60, name: "Robusta-led", note: "Vietnamese-style territory. Dense, sweet and intense; pairs naturally with condensed milk and iced drinks." },
];

const spring = { type: "spring", stiffness: 160, damping: 22 } as const;

export default function BlendSlider() {
  const id = useId();
  const [pct, setPct] = useState(20);
  const p = pct / 100;
  const band = bands.find((b) => pct <= b.max) ?? bands[bands.length - 1];
  const caffeine = 1 + (CAFFEINE_RATIO - 1) * p;

  const meters = [
    { name: "Body", v: 0.35 + p * 1.05 },
    { name: "Crema", v: 0.3 + p * 1.15 },
    { name: "Cocoa & nut", v: 0.4 + p * 0.9 },
    { name: "Acidity", v: 0.85 - p * 1.05 },
  ];

  const crema = 10 + p * 46;

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <svg viewBox="0 0 240 220" className="mx-auto w-full max-w-[260px]" role="img" aria-label={`Espresso with ${pct}% robusta`}>
          <path d="M186 92 q34 0 34 30 t-34 30" fill="none" stroke="#140d09" strokeWidth="12" />
          <path d="M30 64 h160 l-14 112 q-3 22 -26 22 h-80 q-23 0 -26 -22 z" fill="#fffaf2" stroke="#140d09" strokeWidth="6" strokeLinejoin="round" />
          <clipPath id={`${id}cup`}>
            <path d="M36 70 h148 l-13 105 q-3 17 -21 17 h-80 q-18 0 -21 -17 z" />
          </clipPath>
          <g clipPath={`url(#${id}cup)`}>
            <rect x="0" y="70" width="240" height="150" fill="#3b1e0e" />
            <motion.rect x="0" y="70" width="240" initial={false} animate={{ height: crema }} transition={spring} fill="#c98b4e" />
            <motion.rect x="0" y="70" width="240" initial={false} animate={{ height: crema * 0.45 }} transition={spring} fill="#e0aa6b" />
            {Array.from({ length: 9 }, (_, i) => (
              <motion.circle key={i} cx={52 + i * 16} initial={false} animate={{ cy: 74 + ((i * 7) % 11) * (crema / 26), opacity: p > 0.04 ? 0.5 : 0 }} r={2.2} fill="#fff1df" transition={spring} />
            ))}
          </g>
          <ellipse cx="110" cy="210" rx="96" ry="7" fill="#140d09" opacity="0.12" />
        </svg>

        <div>
          <label htmlFor={`${id}r`} className="flex items-baseline justify-between gap-4">
            <span className="font-display text-lg font-bold">Robusta in the blend</span>
            <span className="font-display text-4xl font-extrabold tabular-nums text-orange">{pct}%</span>
          </label>
          <input
            id={`${id}r`}
            type="range"
            min={0}
            max={60}
            step={5}
            value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
            className="mt-3 w-full accent-[#ff6a13]"
          />
          <div className="mt-1 flex justify-between text-xs font-semibold text-ink/45">
            <span>0%</span>
            <span>30%</span>
            <span>60%</span>
          </div>

          <p className="mt-5 font-display text-xl font-bold">{band.name}</p>
          <p className="mt-1 min-h-[3rem] text-[15px] leading-relaxed text-ink/75">{band.note}</p>

          <dl className="mt-5 space-y-3">
            {meters.map((m) => (
              <div key={m.name} className="grid grid-cols-[6.5rem_1fr] items-center gap-3">
                <dt className="text-sm font-semibold text-ink/70">{m.name}</dt>
                <dd className="h-3 overflow-hidden rounded-full bg-ink/10">
                  <motion.div
                    className={`h-full rounded-full ${m.name === "Acidity" ? "bg-ink" : "bg-orange"}`}
                    initial={false}
                    animate={{ width: `${Math.min(1, Math.max(0.05, m.v)) * 100}%` }}
                    transition={spring}
                  />
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 rounded-2xl bg-ink px-4 py-3 text-sm text-cream">
            Caffeine: about <strong className="text-yellow">{caffeine.toFixed(2)}×</strong> an all-arabica shot of the same dose
          </p>
          <p className="mt-3 text-xs text-ink/50">Illustrative. Real results depend on the lots, roast and recipe.</p>
        </div>
      </div>
    </MotionConfig>
  );
}
