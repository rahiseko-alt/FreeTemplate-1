import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "../app/page";
import { HOME_DESCRIPTION, HOME_HEADING } from "../lib/content";

describe("Home page", () => {
  it("renders the heading and description", () => {
    const html = renderToStaticMarkup(<Home />);
    expect(html).toContain(HOME_HEADING);
    expect(html).toContain(HOME_DESCRIPTION);
  });
});
