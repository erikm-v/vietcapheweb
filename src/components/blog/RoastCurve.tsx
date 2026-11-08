import { useRef } from "react";
import { MotionConfig, motion, useInView } from "motion/react";

type Profile = { charge: number; tp: number; tpAt: number; end: number; endAt: number; k: number; fc: number };

const W = 760;
const H = 400;
const pad = { l: 52, r: 24, t: 24, b: 44 };
const tMax = 12;
const yMin = 80;
const yMax = 245;

const x = (t: number) => pad.l + (t / tMax) * (W - pad.l - pad.r);
const y = (c: number) => pad.t + (1 - (c - yMin) / (yMax - yMin)) * (H - pad.t - pad.b);

function temp(p: Profile, t: number) {
  if (t <= p.tpAt) {
    const u = t / p.tpAt;
    return p.tp + (p.charge - p.tp) * (1 - u) ** 2.4;
  }
  const u = t - p.tpAt;
  const span = p.endAt - p.tpAt;
  return p.tp + ((p.end - p.tp) * (1 - Math.exp(-p.k * u))) / (1 - Math.exp(-p.k * span));
}

function path(p: Profile) {
  const pts: string[] = [];
  for (let t = 0; t <= p.endAt + 0.001; t += 0.1) pts.push(`${x(t).toFixed(1)},${y(temp(p, t)).toFixed(1)}`);
  return `M${pts.join(" L")}`;
}

function crossing(p: Profile, c: number) {
  for (let t = p.tpAt; t <= p.endAt; t += 0.02) if (temp(p, t) >= c) return t;
  return p.endAt;
}

const arabica: Profile = { charge: 200, tp: 92, tpAt: 1.1, end: 207, endAt: 10, k: 0.2, fc: 196 };
const robusta: Profile = { charge: 212, tp: 98, tpAt: 1.25, end: 216, endAt: 11.6, k: 0.12, fc: 199 };

const phases = [
  { name: "Drying", from: 0, to: 5, fill: "#ffc93c" },
  { name: "Maillard", from: 5, to: 9.1, fill: "#ff6a13" },
  { name: "Development", from: 9.1, to: 11.6, fill: "#4a2a16" },
];

export default function RoastCurve() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const fcA = crossing(arabica, arabica.fc);
  const fcR = crossing(robusta, robusta.fc);

  return (
    <MotionConfig reducedMotion="user">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Illustrative bean temperature curves for washed arabica and honey-processed robusta. The robusta curve charges hotter, reaches a quieter first crack slightly later and finishes a few degrees higher.">
        {phases.map((ph) => (
          <g key={ph.name}>
            <rect x={x(ph.from)} y={pad.t} width={x(ph.to) - x(ph.from)} height={H - pad.t - pad.b} fill={ph.fill} opacity={0.09} />
            <text x={(x(ph.from) + x(ph.to)) / 2} y={pad.t + 18} textAnchor="middle" className="fill-ink/50 text-[12px] font-bold uppercase tracking-wider">
              {ph.name}
            </text>
          </g>
        ))}

        {[100, 150, 200].map((c) => (
          <g key={c}>
            <line x1={pad.l} x2={W - pad.r} y1={y(c)} y2={y(c)} stroke="#140d09" strokeOpacity="0.08" />
            <text x={pad.l - 10} y={y(c) + 4} textAnchor="end" className="fill-ink/45 text-[12px] font-semibold">{c}°</text>
          </g>
        ))}
        {[0, 2, 4, 6, 8, 10, 12].map((t) => (
          <text key={t} x={x(t)} y={H - pad.b + 22} textAnchor="middle" className="fill-ink/45 text-[12px] font-semibold">{t} min</text>
        ))}

        <motion.path d={path(arabica)} fill="none" stroke="#140d09" strokeOpacity="0.35" strokeWidth="3" strokeDasharray="7 6"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.6, ease: "easeInOut" }} />
        <motion.path d={path(robusta)} fill="none" stroke="#ff6a13" strokeWidth="4.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }} />

        <motion.g initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.6 }}>
          <circle cx={x(fcA)} cy={y(arabica.fc)} r="6" fill="#fffaf2" stroke="#140d09" strokeOpacity="0.5" strokeWidth="2.5" />
          <text x={x(fcA) + 4} y={y(arabica.fc) + 84} className="fill-ink/55 text-[12px] font-semibold">Arabica first crack: loud and clear</text>
        </motion.g>
        <motion.g initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 2.3 }}>
          <circle cx={x(fcR)} cy={y(robusta.fc)} r="7" fill="#ff6a13" stroke="#fffaf2" strokeWidth="3" />
          <line x1={x(fcR)} x2={x(fcR)} y1={y(robusta.fc) + 9} y2={y(robusta.fc) + 24} stroke="#ff6a13" strokeWidth="2" />
          <text x={x(fcR) - 30} y={y(robusta.fc) + 38} className="fill-ink text-[13px] font-bold">Robusta first crack: quiet,</text>
          <text x={x(fcR) - 30} y={y(robusta.fc) + 54} className="fill-ink text-[13px] font-bold">watch temp and colour</text>
        </motion.g>
        <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 2.7 }}>
          <text x={x(robusta.endAt) + 2} y={y(robusta.end) - 14} textAnchor="end" className="fill-ink/70 text-[12px] font-semibold">Drop a few degrees higher</text>
        </motion.g>

        <g transform={`translate(${x(8.4)} ${y(118)})`}>
          <line x1="0" x2="26" y1="0" y2="0" stroke="#ff6a13" strokeWidth="4.5" strokeLinecap="round" />
          <text x="34" y="4" className="fill-ink text-[12px] font-bold">Honey robusta</text>
          <line x1="0" x2="26" y1="20" y2="20" stroke="#140d09" strokeOpacity="0.35" strokeWidth="3" strokeDasharray="7 6" />
          <text x="34" y="24" className="fill-ink/60 text-[12px] font-semibold">Washed arabica</text>
        </g>
      </svg>
    </MotionConfig>
  );
}
