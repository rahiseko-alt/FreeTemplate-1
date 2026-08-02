import { DETAIL_TEXT } from "../lib/content";
import { formatJP } from "../lib/date";
import type { Transaction } from "../lib/types";

interface TransactionListProps {
  heading: string;
  emptyMessage: string;
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

/** 日毎の支出・収入の一覧（新しい日付が上）。 */
export function TransactionList({
  heading,
  emptyMessage,
  transactions,
  onDelete,
}: TransactionListProps) {
  const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section className="rounded-lg border border-gray-200 p-4">
      <h2 className="mb-2 text-sm font-semibold text-gray-900">{heading}</h2>
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-100">
          {sorted.map((t) => (
            <li key={t.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-gray-900">{formatJP(t.date)}</p>
                {t.memo ? (
                  <p className="text-xs text-gray-500">{t.memo}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">
                  {t.amount.toLocaleString("ja-JP")}円
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(t.id)}
                  className="min-h-11 min-w-11 text-xs text-gray-400"
                >
                  {DETAIL_TEXT.deleteButton}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
