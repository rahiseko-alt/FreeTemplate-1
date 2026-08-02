import { HOME_TEXT } from "../lib/content";
import type { DailyBalancePoint } from "../lib/forecast";

interface BalanceBarChartProps {
  points: DailyBalancePoint[];
  highlightDate: string;
}

const POSITIVE = "#2a78d6";
const NEGATIVE = "#e34948";
const BASELINE = "#c3c2b7";
const MUTED = "#898781";
const PRIMARY = "#0b0b0b";

/** 財政状況の「水位」を横棒で表す。0を中心に、プラスは右・マイナスは左へ伸びる。 */
export function BalanceBarChart({ points, highlightDate }: BalanceBarChartProps) {
  const maxAbs = Math.max(1, ...points.map((p) => Math.abs(p.balance)));

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-gray-900">
        {HOME_TEXT.chartHeading}
      </h2>
      <div className="flex flex-col gap-[2px]">
        {points.map((p) => {
          const isPositive = p.balance >= 0;
          const widthPct = Math.min(50, (Math.abs(p.balance) / maxAbs) * 50);
          const isHighlight = p.date === highlightDate;

          return (
            <div key={p.date} className="flex items-center gap-2">
              <span
                className="w-12 shrink-0 text-right text-xs"
                style={{ color: isHighlight ? PRIMARY : MUTED }}
              >
                {formatShort(p.date)}
              </span>
              <div className="relative h-4 flex-1">
                <div
                  className="absolute inset-y-0 w-px"
                  style={{ left: "50%", backgroundColor: BASELINE }}
                />
                <div
                  className="absolute inset-y-0"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: isPositive ? POSITIVE : NEGATIVE,
                    left: isPositive ? "50%" : `${50 - widthPct}%`,
                    opacity: isHighlight ? 1 : 0.55,
                    borderTopLeftRadius: isPositive ? 0 : 4,
                    borderBottomLeftRadius: isPositive ? 0 : 4,
                    borderTopRightRadius: isPositive ? 4 : 0,
                    borderBottomRightRadius: isPositive ? 4 : 0,
                  }}
                />
              </div>
              {isHighlight ? (
                <span className="w-24 shrink-0 text-xs font-semibold text-gray-900">
                  {p.balance.toLocaleString("ja-JP")}円
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatShort(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}`;
}
