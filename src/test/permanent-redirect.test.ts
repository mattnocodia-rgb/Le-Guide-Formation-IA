import { describe, expect, it } from "vitest";

import { permanentRedirectLocation } from "@/lib/permanent-redirect";

describe("Permanent public redirects", () => {
  it("retires boutique in favour of realisations", () => {
    expect(permanentRedirectLocation(new URL("https://example.com/boutique"))).toBe(
      "/realisations",
    );
  });
  it("redirects the trailing-slash variant in one hop and preserves query parameters", () => {
    expect(
      permanentRedirectLocation(new URL("https://example.com/boutique/?utm_source=email")),
    ).toBe("/realisations?utm_source=email");
  });
  it("keeps the existing slash normalization", () => {
    expect(permanentRedirectLocation(new URL("https://example.com/automatisation/"))).toBe(
      "/automatisation",
    );
  });
  it("leaves the destination and the home page untouched", () => {
    expect(permanentRedirectLocation(new URL("https://example.com/realisations"))).toBeNull();
    expect(permanentRedirectLocation(new URL("https://example.com/"))).toBeNull();
  });
});
