import tseslint from "typescript-eslint";

// packages/ui の本物の lint（echo の置き換え）。
// 型情報なしの recommended で軽量に回す（source-only パッケージ）。
export default tseslint.config(
  { ignores: ["node_modules/**", "dist/**"] },
  ...tseslint.configs.recommended,
  {
    // 行数上限は既定では無効なので明示的に入れる（AGENTS.md「結合を増やさない」の最終段）。
    rules: {
      "max-lines": [
        "error",
        { max: 300, skipBlankLines: true, skipComments: true },
      ],
    },
  },
);
