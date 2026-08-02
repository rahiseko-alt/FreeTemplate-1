import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "../app/page";
import {
  ESTIMATE_LINK,
  HOME_DESCRIPTION,
  HOME_HEADING,
  SHARED_BUTTON_LABEL,
} from "../lib/content";

// 本物のテスト（echo の置き換え）。トップページが主要コンテンツを描画し、
// packages/ui の共有 Button を実際に組み込んでいることを静的マークアップで検証する。
// 期待値は lib/content.ts から取る（文言を2箇所に書かない）。
describe("Home page", () => {
  it("renders the heading and description", () => {
    const html = renderToStaticMarkup(<Home />);
    expect(html).toContain(HOME_HEADING);
    expect(html).toContain(HOME_DESCRIPTION);
  });

  it("links to the estimate app", () => {
    const html = renderToStaticMarkup(<Home />);
    expect(html).toContain(`href="${ESTIMATE_LINK.href}"`);
    expect(html).toContain(ESTIMATE_LINK.label);
  });

  it("mounts the shared UI Button", () => {
    const html = renderToStaticMarkup(<Home />);
    expect(html).toContain("<button");
    expect(html).toContain(SHARED_BUTTON_LABEL);
    expect(html).toContain("bg-black");
  });
});
