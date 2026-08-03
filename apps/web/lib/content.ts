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
export const HOME_DESCRIPTION = "この先いつ、いくら残るかが分かります";

export const HOME_TEXT = {
  forecastHeading: "残高予測",
  dateQuestion: "いつのお金が知りたい？",
  changeDateSuffix: "を変える",
  futureConnector: "には",
  futureCaption: "残っていそうです",
  futureShortfallCaption: "たりなくなりそうです",
  todayCaption: "今は",
  todayCaptionSuffix: "残っています",
  todayShortfallCaptionSuffix: "たりません",
  currentBalancePrefix: "今もっているお金：",
  currentShortfallPrefix: "今たりないお金：",
  currentBalanceSuffix: "円",
  chartHeading: "お金の動き",
  chartShortfallSuffix: "たりない",
} as const;

export const CALENDAR_TEXT = {
  prevMonth: "前の月",
  nextMonth: "次の月",
  select: "この日を選ぶ",
  close: "閉じる",
} as const;

export const DETAIL_TEXT = {
  expenseListHeading: "out",
  incomeListHeading: "in",
  emptyExpense: "まだ記録がありません",
  emptyIncome: "まだ記録がありません",
  entryFormHeading: "記録する",
  dateLabel: "日付",
  changeDateSuffix: "を変える",
  typeLabel: "種類",
  typeIncome: "in",
  typeExpense: "out",
  amountLabel: "いくら",
  amountError: "きんがくを入れてね",
  memoLabel: "メモ",
  addButton: "記録する",
  deleteButton: "けす",
  fixedDailyHeading: "毎日きまって使うお金",
  fixedDailyEmpty: "まだ記録がありません",
  fixedDailyAmountLabel: "1日にいくら",
  fixedDailyAddButton: "追加する",
  recurringHeading: "毎月きまって出入りするお金",
  recurringEmptyMain: "まだ何もありません",
  recurringEmptyNote: "自分で入力しなくても、きろくがたまると自動で出てきます",
  recurringExpenseLabel: "fixed out",
  recurringIncomeLabel: "fixed in",
} as const;
