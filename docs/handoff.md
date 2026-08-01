# 引継ぎメモ（handoff）

セッションをまたぐ**揮発的な引継ぎメモ**。**このファイルは毎回上書き**（最新1件だけを保持する）。
過去の失敗の蓄積は `docs/failures.md`（append-only・消さない）を見る。

## ①今回実施

このテンプレの新バージョンを作成した。旧バージョンは「案件開始時に必ず `docs/roadmap.html` へ原子分解
ツリーを描く」ことを機械強制する仕組みだったが、**既に開発済みのプロダクトをこのテンプレへ持ち込んで
使う**場合には、既存の実装・実績を事後的にツリーへ翻訳し直すだけの無意味な作業になり不便、という指摘を
受けて、ツリー機構を完全に削除し、進捗管理・引継ぎを軽量な `docs/handoff.md`（このファイル。①今回実施
②今回トラブル ③次回やる事の3項目、毎回上書き）だけで行う方式に作り直した。

具体的には以下を実施：
- 削除：`docs/roadmap.html` / `scripts/verify-roadmap-evidence.mjs` / `.github/workflows/roadmap-required.yml`
  / `.claude/agents/basis-reviewer.md`（原子ツリーの criteria 凍結ゲート専用のレビュアーで、ツリーが
  無くなったため不要）。
- 新設：`docs/handoff.md`（このファイル）。
- 書き換え：`AGENTS.md`（「案件の絶対起点：まず原子ツリー」節を撤廃し、テンプレの主用途を「既存プロダクト
  の持ち込み」と明記。検証の規律から原子性の分解ルールを削除し、CI/独立検証の役割分担のみ残した）、
  `.claude/skills/checkin-checkout/SKILL.md`（roadmap の meta.handoff → docs/handoff.md ベースへ）、
  `.claude/agents/independent-verifier.md`（roadmap 専用の文言を汎用の完了報告検証に一般化）、
  `.github/workflows/ci.yml` / `.github/workflows/auto-merge.yml` / `scripts/setup.sh` / `package.json`
  / `presets/_TEMPLATE.md` / `.claude/hooks/check-uncommitted.sh`（roadmap-required / verify-roadmap 関連の
  参照を除去）。
- `docs/failures.md` は、既存29件が全て旧ツリー/tier機構に関するものだったため、ヘッダーのみへリセット
  （新方式の失敗ログとして再出発）。
- `pnpm -r typecheck/lint/test/build` と `pnpm audit --audit-level moderate` が全て緑であることを確認済み。

## ②今回トラブル

無し。

## ③次回やる事

- 本PRを出し、CIが緑であることを確認してマージする。
- 残課題（今回は対応していない）：`docs/curriculum/` `docs/design/` `docs/demo/` `docs/guide/`
  `docs/research/` 配下、および `apps/web` のサンプルアプリは、旧ツリー方式で運用していた際の具体的な
  検証記録・サンプル実装であり、新テンプレの主用途（既存プロダクトの持ち込み）にとっては不要な残骸の
  可能性がある。整理するかどうかは次セッションでユーザーに確認する。
- `.github/workflows/auto-merge.yml` のコメントに、AGENTS.md では既に廃止済みのはずの
  tier-0/1/2・basis-gate という語がまだ残っている（本セッションのスコープ外だったため未修正）。
  実装（判定ロジック）自体は check-runs の成否のみを見ており roadmap-required 依存はないが、
  コメントの記述と現行ルールが食い違っているため、次セッションで整合を取るか確認する。
