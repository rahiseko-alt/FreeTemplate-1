// 共通の文言・値の置き場所（AGENTS.md「コマンド」欄が指すファイル）。
// 画面に出る文言と、複数箇所から参照される定数はここに1つだけ書く
// （AGENTS.md「結合を増やさない」1：同じ値・同じ文言を2箇所以上に書かない）。
//
// 注意：CI の起動スモーク（.github/workflows/ci.yml / prod-smoke.yml）は
// HOME_HEADING の値をリテラルで grep している。これはアプリ側の実装を読まずに
// 外から到達性を確かめるための意図的な二重化なので、値を変えるときは両ワークフローも直す。

/** サイト共通のメタ情報（app/layout.tsx が参照）。 */
export const SITE = {
  title: "cc-v2",
  description: "pnpm monorepo (apps/web + packages/ui)",
} as const;

/** トップページの見出し。CI スモークのマーカーでもある。 */
export const HOME_HEADING = "cc-v2 monorepo";

/** トップページの説明文。 */
export const HOME_DESCRIPTION = "apps/web + packages/ui";

/** トップページから見積りアプリへ渡すリンクの文言と遷移先。 */
export const ESTIMATE_LINK = {
  label: "工数・コスト概算アプリを開く",
  href: "/estimate",
} as const;

/** 共有 UI の動作確認用ボタンの文言。 */
export const SHARED_BUTTON_LABEL = "Shared UI Button";
