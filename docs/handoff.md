# 引継ぎメモ（handoff）

セッションをまたぐ**揮発的な引継ぎメモ**。**このファイルは毎回上書き**（最新1件だけを保持する）。
過去の失敗の蓄積は `docs/failures.md`（append-only・消さない）を見る。

## ①今回実施

「アプリ作れよ」の指示を受け、`setup` の手順1〜6（新規・雛形づくり）を実行した。
ヒアリング結果：利用者＝自分だけ、利用方法＝ブラウザでURL、アプリ名＝「家計簿くん」。
機能の中身はまだ無い（意図的。入口から出口を1回通すのが今回のスコープ）。

- 同梱の見本を削除：`packages/ui`（丸ごと）、`apps/web/app/estimate/*`、
  `apps/web/lib/estimate.ts` / `estimateForm.ts`、対応テスト、`apps/web/app/api/boom/route.ts`、
  `apps/web/AGENTS.md`（内容はルートの `AGENTS.md` に統合）。
- `pnpm-workspace.yaml` を `apps/*` のみに変更（`packages/ui` を消したため）。
  `apps/web/package.json` から `@repo/ui` 依存を削除、`next.config.ts` の
  `transpilePackages` も削除。
- 空のトップページ（見出し「家計簿くん」＋説明文のみ）と、渡し方・チェックの動作確認用の
  最小関数 `apps/web/lib/format.ts`（`formatMessage`）とそのテストを新設。
  `apps/web/lib/content.ts` を「家計簿くん」向けに書き換え（文言はここに集約、2箇所以上に書かない）。
- CI のマーカー文言を `cc-v2 monorepo` → `家計簿くん` に統一（`.github/workflows/ci.yml`・
  `prod-smoke.yml`）。`prod-smoke.yml` の `PROD_URL` は暫定で
  `https://kakeibo-kun.vercel.app` を置いた（Vercel 接続後、実際の割当ドメインに要更新）。
- ルートの `package.json` の `name` を `cc-v2` → `kakeibo-kun` に、`README.md` を
  テンプレ説明から実案件（家計簿くん）の起動手順に書き換え。
- `AGENTS.md` の「コマンド」節を実コマンドで埋めた（未記入を解消）。
- ローカルで `pnpm install` → `typecheck` / `lint` / `test` / `build` /
  `audit --audit-level moderate` を全て緑で確認。さらに `next start` を実際に起動し、
  トップページのマーカー「家計簿くん」と `/api/health` の 200 を curl で確認済み。

証拠：ローカルでの上記コマンド実行結果（全て成功）。CI の run URL は次回 push 後に確定。

## ②今回トラブル

無し。

## ③次回やる事

- **push して CI（`ci-green`）が緑になることを確認する。** 今回はまだ push していない
  （ローカル検証まで）。
- **Vercel 接続はユーザーがブラウザで行う必要がある**（未実施）。接続後、実際の公開URLが
  分かったら `prod-smoke.yml` の `PROD_URL`（暫定値 `https://kakeibo-kun.vercel.app`）を
  実URLに合わせて更新し、`prod-smoke` が緑になることを確認する。それまで `prod-smoke` は
  赤のままで正常（本番未デプロイのため）。
- 家計簿くんの実機能（収支の記録・一覧など）はまだ何も無い。次は「実装の進め方」に従い、
  機能を1つ選んで入口から出口までの空通しから始める。
- 公開設定（`setup` 手順7：Public化 → Secret Protection → Ruleset）はまだ未実施。
