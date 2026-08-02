# 引継ぎメモ（handoff）

セッションをまたぐ**揮発的な引継ぎメモ**。**このファイルは毎回上書き**（最新1件だけを保持する）。
過去の失敗の蓄積は `docs/failures.md`（append-only・消さない）を見る。

## ①今回実施

`AGENTS.md` を「毎セッション必ず読む短い規律」だけに絞り込み、手順は `setup` スキルへ移した。
20KB・14節 → 約1.5KB・4節。

- **`AGENTS.md`（全面差し替え）**：「コマンド」（開発サーバ / テスト全件・1件だけ / lint・型チェック /
  必須の環境変数（名前だけ）/ 共通の文言・値の置き場所）、「実装の進め方」（入口から出口まで1回通してから
  中身）、「結合を増やさない」（4条＋判定基準）、「完了の証明」の4節のみ。冒頭1行が
  「『未記入』の欄が残っている間は `setup` を実行する」。
- **`.claude/skills/setup/SKILL.md`（新設）**：旧 `AGENTS.md` の手順を移設。
  0. プロダクトの所在確認（`git branch -a`／同梱サンプルはコードに数えない／3分岐）
  A. 取り込み7手順（無確認実行＋事後報告。`ci-green` 維持、チェックを削らない、
     同梱サンプル削除のガードはそのまま維持）
  B. ゼロから始める（鉄板構成＋非エンジニア向けFAQ5問）
  C. 機械強制の有効化（Rulesets のハマりどころ4点、Secret Protection）
  ＋「確認せずに進める／必ず確認する」
- **宙吊り参照の解消**：`checkin-checkout/SKILL.md`（handoff の入口を `docs/handoff.md` に固定。
  独自記録がある場合は参照先1行を辿る方式へ）、`presets/_TEMPLATE.md`（新しい欄の形に合わせて簡素化）、
  `README.md`、`apps/web/AGENTS.md`。
- **サンプルを新ルールに適合**：`apps/web` に「共通の文言・値の置き場所」が存在しなかったため
  `apps/web/lib/content.ts` を新設し、`page.tsx` / `layout.tsx` / `home.test.tsx` の重複文言を集約した
  （「結合を増やさない」1 の実例になる）。CI スモークの grep はアプリを読まずに外から確かめるための
  意図的な二重化として残し、その旨を `content.ts` に明記。

検証：typecheck / lint / test（36 tests passed）/ build / audit すべて緑。起動スモークもローカルで
HTTP 200＋マーカー `cc-v2 monorepo` を確認。

## ②今回トラブル

`apps/web/AGENTS.md` の「共通の文言・値の置き場所」に、実在を確かめずに `lib/estimate.ts` と
書いた。実際は計算エンジンで文言は持っておらず、置き場所自体が存在しなかった。
`content.ts` を新設して解消（教訓は `docs/failures.md`）。

## ③次回やる事

- 新しい `AGENTS.md` + `setup` を、実際の持ち込み案件で1回通して検証する
  （`setup` の A. 取り込みがユーザーへの問い返し無しで完走し、「コマンド」欄の5項目が
  実在のコードから埋まるか。`ci-green` が維持されるか）。
- このリポジトリの `main` に branch protection（`ci-green` 必須）と Secret Protection が
  適用済みかは未確認。未適用なら `setup` の「C. 機械強制の有効化」に従って設定する。
