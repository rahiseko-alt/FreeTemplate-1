import { HOME_TEXT } from "../lib/content";
import type { DailyBalancePoint } from "../lib/forecast";

interface BalanceChartProps {
  points: DailyBalancePoint[];
  highlightDate: string;
}

const WIDTH = 320;
const HEIGHT = 140;
const TOP_PAD = 16;
const BOTTOM_PAD = 20;

const POSITIVE = "#2a78d6";
const NEGATIVE = "#e34948";
const BASELINE = "#c3c2b7";
const MUTED = "#898781";

/**
 * 残高の動きを、時間の流れ（横）にそって水位が上下する1本の線と塗りで見せる。
 * 0円のところに水平の目盛り線を引き、それより上は青、下は赤にする。
 */
export function BalanceChart({ points, highlightDate }: BalanceChartProps) {
  if (points.length === 0) return null;

  const values = points.map((p) => p.balance);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const span = max - min || 1;

  const plotHeight = HEIGHT - TOP_PAD - BOTTOM_PAD;
  const x = (i: number) =>
    points.length === 1 ? WIDTH / 2 : (i / (points.length - 1)) * WIDTH;
  const y = (balance: number) =>
    TOP_PAD + plotHeight - ((balance - min) / span) * plotHeight;

  const zeroY = y(0);
  const zeroFraction = (zeroY / HEIGHT) * 100;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.balance)}`)
    .join(" ");
  const areaPath = `${linePath} L${x(points.length - 1)},${zeroY} L${x(0)},${zeroY} Z`;

  const highlightIndex = points.findIndex((p) => p.date === highlightDate);
  const highlight = highlightIndex >= 0 ? points[highlightIndex] : undefined;
  const firstPoint = points[0] as DailyBalancePoint;
  const lastPoint = points[points.length - 1] as DailyBalancePoint;

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-gray-900">
        {HOME_TEXT.chartHeading}
      </h2>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img">
        <title>{HOME_TEXT.chartHeading}</title>
        <defs>
          <linearGradient
            id="balance-gradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2={HEIGHT}
          >
            <stop offset={`${zeroFraction}%`} stopColor={POSITIVE} />
            <stop offset={`${zeroFraction}%`} stopColor={NEGATIVE} />
          </linearGradient>
          <linearGradient
            id="balance-area-gradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2={HEIGHT}
          >
            <stop offset={`${zeroFraction}%`} stopColor={POSITIVE} stopOpacity={0.12} />
            <stop offset={`${zeroFraction}%`} stopColor={NEGATIVE} stopOpacity={0.12} />
          </linearGradient>
        </defs>

        {/* 0円の水平線（水位の基準） */}
        <line
          x1={0}
          y1={zeroY}
          x2={WIDTH}
          y2={zeroY}
          stroke={BASELINE}
          strokeWidth={1}
        />
        <text x={2} y={zeroY - 4} fontSize={9} fill={MUTED}>
          0円
        </text>

        <path d={areaPath} fill="url(#balance-area-gradient)" stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke="url(#balance-gradient)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {highlight ? (
          <g>
            <line
              x1={x(highlightIndex)}
              y1={TOP_PAD}
              x2={x(highlightIndex)}
              y2={HEIGHT - BOTTOM_PAD}
              stroke={BASELINE}
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            <circle
              cx={x(highlightIndex)}
              cy={y(highlight.balance)}
              r={4}
              fill={highlight.balance < 0 ? NEGATIVE : POSITIVE}
              stroke="#fff"
              strokeWidth={2}
            />
          </g>
        ) : null}

        {/* 日付ラベルは端と対象日だけ（詰め込みすぎない） */}
        <text x={0} y={HEIGHT - 4} fontSize={9} fill={MUTED}>
          {formatShort(firstPoint.date)}
        </text>
        <text
          x={WIDTH}
          y={HEIGHT - 4}
          fontSize={9}
          fill={MUTED}
          textAnchor="end"
        >
          {formatShort(lastPoint.date)}
        </text>
      </svg>

      {highlight ? (
        <p className="mt-1 text-center text-xs font-semibold text-gray-900">
          {formatShort(highlight.date)}：{highlight.balance.toLocaleString("ja-JP")}円
        </p>
      ) : null}
    </div>
  );
}

function formatShort(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}`;
}
