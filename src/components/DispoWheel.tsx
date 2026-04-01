"use client";

import { useCallback, useMemo, useRef, useState } from "react";

const DEFAULT_SEGMENTS = [
  "Double",
  "Pass",
  "Flip",
  "Hold",
  "Rally",
  "Cash",
];

type Props = {
  segments?: string[];
};

function wedgePath(
  index: number,
  total: number,
  innerR: number,
  outerR: number,
): string {
  const a0 = (-Math.PI / 2) + (index * 2 * Math.PI) / total;
  const a1 = (-Math.PI / 2) + ((index + 1) * 2 * Math.PI) / total;
  const x0o = Math.cos(a0) * outerR;
  const y0o = Math.sin(a0) * outerR;
  const x1o = Math.cos(a1) * outerR;
  const y1o = Math.sin(a1) * outerR;
  const x0i = Math.cos(a0) * innerR;
  const y0i = Math.sin(a0) * innerR;
  const x1i = Math.cos(a1) * innerR;
  const y1i = Math.sin(a1) * innerR;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return [
    `M ${x0i} ${y0i}`,
    `L ${x0o} ${y0o}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${x1o} ${y1o}`,
    `L ${x1i} ${y1i}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${x0i} ${y0i}`,
    "Z",
  ].join(" ");
}

const PALETTE = [
  "#ff5c8a",
  "#7c5cff",
  "#00d4aa",
  "#ffb020",
  "#5cb8ff",
  "#e85cff",
  "#ff6b35",
  "#4ecdc4",
];

export function DispoWheel({ segments = DEFAULT_SEGMENTS }: Props) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const rotationRef = useRef(0);
  rotationRef.current = rotation;

  const n = segments.length;
  const slice = 360 / n;

  const colors = useMemo(
    () => segments.map((_, i) => PALETTE[i % PALETTE.length]),
    [segments],
  );

  const spin = useCallback(() => {
    if (spinning || n < 2) return;
    setSpinning(true);
    setWinner(null);

    const winIndex = Math.floor(Math.random() * n);
    const midDeg = winIndex * slice + slice / 2;
    const fullSpins = 5 + Math.floor(Math.random() * 4);
    const rem =
      (((midDeg + rotationRef.current) % 360) + 360) % 360;
    let delta = 360 * fullSpins - rem;
    if (delta < 360 * 4) delta += 360 * Math.ceil((360 * 4 - delta) / 360);

    const next = rotationRef.current + delta;
    setRotation(next);

    window.setTimeout(() => {
      setWinner(segments[winIndex] ?? null);
      setSpinning(false);
    }, 5200);
  }, [spinning, n, slice, segments]);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8">
      <div className="relative aspect-square w-full max-w-[min(100%,360px)]">
        {/* Pointer */}
        <div
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1"
          aria-hidden
        >
          <div className="h-0 w-0 border-x-[14px] border-x-transparent border-t-[22px] border-t-zinc-900 drop-shadow-md dark:border-t-zinc-100" />
        </div>

        <div
          className="absolute inset-[10%] rounded-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)] ring-4 ring-zinc-900/10 dark:ring-white/10"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 5s cubic-bezier(0.12, 0.85, 0.08, 1)"
              : "none",
          }}
        >
          <svg
            viewBox="-110 -110 220 220"
            className="h-full w-full rounded-full"
            role="img"
            aria-label="Dispo spinner wheel"
          >
            <defs>
              <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="b" />
                <feOffset dy="1" />
                <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k1="0" k3="0" k4="0" />
                <feFlood floodColor="#000" floodOpacity="0.25" />
                <feComposite in2="b" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {segments.map((label, i) => (
              <path
                key={label + i}
                d={wedgePath(i, n, 28, 100)}
                fill={colors[i]}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth={0.5}
                filter="url(#innerShadow)"
              />
            ))}
            {segments.map((label, i) => {
              const mid = (-90 + i * slice + slice / 2) * (Math.PI / 180);
              const tx = Math.cos(mid) * 62;
              const ty = Math.sin(mid) * 62;
              return (
                <text
                  key={`t-${label}-${i}`}
                  x={tx}
                  y={ty}
                  fill="white"
                  fontSize={n > 6 ? 10 : 12}
                  fontWeight={700}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${90 + i * slice + slice / 2}, ${tx}, ${ty})`}
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  {label.length > 8 ? `${label.slice(0, 7)}…` : label}
                </text>
              );
            })}
            <circle cx={0} cy={0} r={26} fill="#18181b" />
            <circle cx={0} cy={0} r={22} fill="#27272a" stroke="#3f3f46" strokeWidth={1} />
          </svg>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          className="rounded-full bg-zinc-900 px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {spinning ? "Spinning…" : "Spin"}
        </button>

        {winner && (
          <p className="animate-fade-up text-center text-2xl font-bold tracking-tight text-zinc-100">
            {winner}
          </p>
        )}
      </div>
    </div>
  );
}
