import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders need Airtable,
// which the test run does not have.
describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
  const leaf = (path: string) => router.matchRoutes(path).at(-1)?.routeId;

  it.each([
    ["/", "/"],
    ["/vibe-coding-lovable", "/$slug"],
    ["/categorie/financement", "/categorie/$slug"],
    ["/a-propos", "/a-propos"],
    ["/mentions-legales", "/mentions-legales"],
  ])("matches %s", (path, routeId) => {
    expect(leaf(path)).toBe(routeId);
    expect(leaf(path)).not.toBe(rootRouteId);
  });
});
