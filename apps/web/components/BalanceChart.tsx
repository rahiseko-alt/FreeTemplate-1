import { HOME_TEXT } from "../lib/content";
import type { DailyBalancePoint } from "../lib/forecast";

interface BalanceChartProps {
  points: DailyBalancePoint[];
  highlightDate: string;
}

const WIDTH = 320;
const HEIGHT = 160;
const TOP_PAD = 20;
const BOTTOM_PAD = 22;

const POSITIVE = "#2a78d6";
const NEGATIVE = "#e34948";
const BASELINE = "#d8d5cb";
const MUTED = "#8b897f";

/**
 * 残高の動きを、時間の流れ（横）にそって水位が上下する1本の線と塗りで見せる。
 * 0円のところに水平の目盛り線を引き、それより上は青、下は赤にする。
 */
export function BalanceChart({ points, highlightDate }: BalanceChartProps) {
  if (points.length === 0) return null;

  const values = points.map((p) => p.balance);
  const hasNegative = values.some((v) => v < 0);
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

  // マイナスが無いときは単色にする（境界ぴったりの値がグラデーションの
  // 継ぎ目と重なって赤く見えてしまう不具合を避けるため）。
  const lineStroke = hasNegative ? "url(#balance-gradient)" : POSITIVE;
  const areaFill = hasNegative ? "url(#balance-area-gradient)" : POSITIVE;

  return (
    <div>
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
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

        <path
          d={areaPath}
          fill={areaFill}
          fillOpacity={hasNegative ? undefined : 0.12}
          stroke="none"
        />
        <path
          d={linePath}
          fill="none"
          stroke={lineStroke}
          strokeWidth={2.5}
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
              r={8}
              fill={highlight.balance < 0 ? NEGATIVE : POSITIVE}
              fillOpacity={0.15}
            />
            <circle
              cx={x(highlightIndex)}
              cy={y(highlight.balance)}
              r={4.5}
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
        <p className="mt-2 text-center text-xs font-semibold text-gray-500">
          {formatShort(highlight.date)}：
          <span
            className={
              highlight.balance < 0 ? "text-red-600" : "text-gray-900"
            }
          >
            {Math.abs(highlight.balance).toLocaleString("ja-JP")}円
            {highlight.balance < 0 ? HOME_TEXT.chartShortfallSuffix : ""}
          </span>
        </p>
      ) : null}
    </div>
  );
}

function formatShort(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}`;
}
