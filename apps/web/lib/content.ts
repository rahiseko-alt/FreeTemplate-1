// 共通の文言・値の置き場所（AGENTS.md「コマンド」欄が指すファイル）。
// 画面に出る文言と、複数箇所から参照される定数はここに1つだけ書く
// （AGENTS.md「結合を増やさない」1：同じ値・同じ文言を2箇所以上に書かない）。
//
// 注意：CI の起動スモーク（.github/workflows/ci.yml / prod-smoke.yml）は
// HOME_HEADING の値をリテラルで grep している。値を変えるときは両ワークフローも直す。

/** サイト共通のメタ情報（app/layout.tsx が参照）。 */
export const SITE = {
  title: "家計簿くん",
  description: "家計簿アプリ",
} as const;

/** トップページの見出し。CI スモークのマーカーでもある。 */
export const HOME_HEADING = "家計簿くん";

/** トップページの説明文。 */
export const HOME_DESCRIPTION = "任意の日付の残高予測";

export const NAV = {
  home: "ホーム",
  detail: "詳細",
} as const;

export const HOME_TEXT = {
  forecastLabel: "予測残高",
  targetDateLabel: "対象日",
  changeDateButton: "日付を変更する",
  todayLabel: "今日の残高",
  chartHeading: "財政状況",
  detailLink: "詳細を見る",
} as const;

export const CALENDAR_TEXT = {
  prevMonth: "前の月",
  nextMonth: "次の月",
  select: "この日を選ぶ",
  close: "閉じる",
} as const;

export const DETAIL_TEXT = {
  heading: "詳細",
  expenseListHeading: "支出（日毎）",
  incomeListHeading: "収入（日毎）",
  emptyExpense: "支出の記録はまだありません",
  emptyIncome: "収入の記録はまだありません",
  entryFormHeading: "手入力",
  dateLabel: "日付",
  typeLabel: "種別",
  typeIncome: "収入",
  typeExpense: "支出",
  amountLabel: "金額",
  memoLabel: "メモ",
  addButton: "追加する",
  deleteButton: "削除",
  fixedDailyHeading: "毎日の固定支出",
  fixedDailyEmpty: "毎日の固定支出はまだありません",
  fixedDailyAmountLabel: "金額（1日あたり）",
  fixedDailyAddButton: "固定支出を追加する",
  recurringHeading: "毎月の定額（自動検出）",
  recurringEmpty: "まだ検出された定額の収支はありません（同じ日付・同じ金額の入力が2ヶ月分たまると表示されます）",
  recurringExpenseLabel: "支出",
  recurringIncomeLabel: "収入",
  backLink: "ホームに戻る",
} as const;
