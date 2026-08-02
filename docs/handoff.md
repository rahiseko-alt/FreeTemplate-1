# 引継ぎメモ（handoff）

セッションをまたぐ**揮発的な引継ぎメモ**。**このファイルは毎回上書き**（最新1件だけを保持する）。
過去の失敗の蓄積は `docs/failures.md`（append-only・消さない）を見る。

## ①今回実施

ルールを全面的に作り直した。`AGENTS.md` は毎回読む短い規律だけにし、手順は skill へ移した。

- **`AGENTS.md`**：20KB・14節 → 約1.5KB・4節（コマンド / 実装の進め方 / 結合を増やさない / 完了の証明）。
  冒頭1行が「『未記入』の欄が残っている間は `setup` を実行する」。
- **`.claude/skills/setup/`**：初期設定を1回だけ行う手順（0 どこへ進むか → 1 何を作るか聞く →
  2 雛形 → 3 渡し方の疎通 → 4 チェック → 5 引継ぎ先 → 6 未記入の埋め切り → 7 公開時のみ）。
  末尾に「A. 既にコードがあるとき（取り込み）」。
- **`.claude/skills/in-out/`**：`checkin-checkout` を置き換え。`out` の既定は**コミットと push まで**。
  PR とマージは言われたときだけ。
- **摩擦の削減**：Stop フック（`check-uncommitted.sh`）を削除。ターン終了ごとに未コミットを検出して
  exit 2 で止めるため、`out` から PR を外した意味が無くなる。`.claude/settings.json` に残したのは
  `git commit --no-verify` / `git push --force` / `-f` の deny のみ。
- **`ci-green` の統一**：集約ゲートを job id `gate` + `name: ci-green` → job id `ci-green`（`name:` 無し）に。
  チェック名は変わらないので branch protection に影響しない。`scripts/setup.sh` も追随。
- **行数上限を実際に有効化**：`max-lines: 300` を両 eslint config に追加。322行のファイルで実際に
  赤になることを確認してから削除した。既存の実ソースは最大221行で影響なし。
- **見本を新ルールに適合**：`apps/web/lib/content.ts` を新設し、重複していた文言を集約。
- **`.gitignore`**：`.venv/` `__pycache__/` を追加。

提示されたルール案には、そのまま入れると壊れる箇所が4つあったので直してから入れた
（取り込み経路の欠落 / 初期設定の済判定が矛盾 / 見本の削除手順が無い / Stop フックの消失）。

証拠：commit `449518c`、CI 全チェック緑（`ci-green` 含む）
https://github.com/rahiseko-alt/FreeTemplate-1/actions/runs/30735447424

## ②今回トラブル

Stop フックを一度「既にあるものだから」と残し、次のターンで摩擦源だと分かって削除した
（教訓は `docs/failures.md`）。

## ③次回やる事

- PR #13 は open のまま。マージするかどうかは未定（ユーザーの指示待ち）。
- 実際の案件で `setup` を1回通して検証する（既存コードなら手順A、新規なら手順1〜6）。
- 公開するなら `setup` の手順7（Public 化 → Secret Protection → Ruleset の4点）。
