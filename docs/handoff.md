# 引継ぎメモ（handoff）

セッションをまたぐ**揮発的な引継ぎメモ**。**このファイルは毎回上書き**（最新1件だけを保持する）。
過去の失敗の蓄積は `docs/failures.md`（append-only・消さない）を見る。

## ①今回実施

`AGENTS.md` を4節（コマンド / 実装の進め方 / 結合を増やさない / 完了の証明）に絞り、手順を
skill 側へ移した。あわせて skill を `setup` と `in-out` の2つに整理した。

- **`AGENTS.md`**：20KB・14節 → 約1.5KB・4節。冒頭1行が「『未記入』の欄が残っている間は `setup` を実行する」。
- **`.claude/skills/setup/`**：初期設定を1回だけ行う。手順0（どこへ進むか）→ 1 何を作るか聞く →
  2 雛形 → 3 渡し方の疎通 → 4 チェック → 5 引継ぎ先 → 6 未記入の埋め切り → 7 公開時のみ。
  末尾に「A. 既にコードがあるとき（取り込み）」。
- **`.claude/skills/in-out/`**（新設・`checkin-checkout` を置き換え）：`in` で引継ぎを読んで作業
  ブランチを作り、`out` で引継ぎを書いてコミット〜PR〜マージまで。
- **`.claude/settings.json`**：`git commit --no-verify` / `git push --force` / `-f` を deny に追加。
  既存の Stop フック（`check-uncommitted.sh`）は残した。
- **`.gitignore`**：`.venv/` `__pycache__/` を追加（Python 分岐用）。`.vercel/` `*.pem` `coverage/`
  `*.tsbuildinfo` `out/` `next-env.d.ts` は従来どおり残す。

初稿に対して指摘した不都合のうち、4件を直した上で入れた：

1. **取り込み経路の復活** — 初稿は「まっさらから作る」手順しか無く、既存コードの上に雛形を
   かぶせる状態だった（`docs/failures.md` 2026-08-01 と同じ失敗）。手順0の分岐と手順Aを足した。
2. **「初期設定が終わった」の目印の矛盾** — 「AGENTS.md の未記入」と「`docs/handoff.md` の存在」が
   逆の答えを出していた（このリポジトリ自身が両方成立）。`in` の判定を
   「handoff が無い **または** 未記入が残っている → `setup`」に統一した。
3. **見本の削除手順** — `apps/web` / `packages/ui` を消す手順がどこにも無く、新案件が初手で赤に
   なる状態だった。手順2の先頭と手順A-2に追加（ユーザー判断：コピー時に消す）。
4. **Stop フックの消失** — 提示された `settings.json` に `hooks` が無く、貼り替えると消えていた。統合した。

**`ci-green` の指定を現物に合わせた**：新ルール「job id を `ci-green` にし `name:` は設定しない」に
従い、`ci.yml` の集約ゲートを job id `gate` + `name: ci-green` → job id `ci-green`（`name:` 無し）に
変更。チェック名は `ci-green` のまま変わらないので branch protection は影響を受けない。
`scripts/setup.sh` のコメントも追随。

**行数上限を実際に有効化した**：`max-lines: 300`（空行・コメント除外）を両 eslint config に追加。
新ルールの「わざと超えるファイルを作って赤を確認する」も実行済み（322行のファイルで
`File has too many lines (322). Maximum allowed is 300` を確認し、削除）。既存の実ソースは
最大221行（`apps/web/lib/estimate.ts`）なので影響なし。

検証：typecheck / lint / test（36 passed）/ build すべて緑。

## ②今回トラブル

無し。初稿の不都合は入れる前に洗い出し、4件とも修正済み。

## ③次回やる事

- 実際の持ち込み案件で `setup` の手順A（取り込み）を1回通して検証する。
- 新規案件で手順1〜6を通し、手順3（渡し方の疎通）と手順4（行数上限の赤確認）が
  ユーザーへの問い返し無しで完走するか見る。
- 公開するなら `setup` の手順7（Public 化 → Secret Protection → Ruleset の4点）。
