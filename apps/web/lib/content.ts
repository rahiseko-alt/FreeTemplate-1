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
export const HOME_DESCRIPTION = "準備中";
