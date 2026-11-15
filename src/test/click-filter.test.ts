import { describe, expect, it } from "vitest";

import { isRealClick } from "@/lib/click-filter";

const GO = "https://formation-ia.optimatt.fr/go/recFLSPd9s1TlddYs?e=article";
const CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const req = (headers: Record<string, string>) => new Request(GO, { headers });

describe("isRealClick", () => {
  it("counts a click from a page of the site", () => {
    const h = {
      "user-agent": CHROME,
      referer: "https://formation-ia.optimatt.fr/devenir-product-builder",
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "navigate",
      "sec-fetch-user": "?1",
    };
    expect(isRealClick(req(h))).toBe(true);
  });
  it("counts a same-site click from a browser without Fetch Metadata", () => {
    expect(
      isRealClick(req({ "user-agent": CHROME, referer: "https://formation-ia.optimatt.fr/" })),
    ).toBe(true);
  });
  it("ignores a request without a page of origin, even with a normal user agent", () => {
    expect(isRealClick(req({ "user-agent": CHROME }))).toBe(false);
  });
  it("ignores a request coming from another site", () => {
    expect(isRealClick(req({ "user-agent": CHROME, referer: "https://www.google.com/" }))).toBe(
      false,
    );
  });
  it("ignores a navigation not triggered by the user", () => {
    const h = {
      "user-agent": CHROME,
      referer: "https://formation-ia.optimatt.fr/",
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "navigate",
    };
    expect(isRealClick(req(h))).toBe(false);
  });
  it("ignores crawlers and prefetches", () => {
    const ref = { referer: "https://formation-ia.optimatt.fr/" };
    expect(isRealClick(req({ ...ref, "user-agent": "Googlebot/2.1" }))).toBe(false);
    expect(isRealClick(req({ ...ref, "user-agent": CHROME, "sec-purpose": "prefetch" }))).toBe(
      false,
    );
  });
});
