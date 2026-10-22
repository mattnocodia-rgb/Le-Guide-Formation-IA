import { describe, expect, it } from "vitest";

import { isLinkValid, linkOfType, resolveArticleLinks, type CubeLink } from "@/lib/airtable.server";
import { applyParcours, fillParcoursLine, parseFaq, renderMarkdown } from "@/lib/markdown.server";

const link = (over: Partial<CubeLink>): CubeLink => ({
  id: "rec1",
  label: "Lien",
  type: "programme",
  theme: "general",
  url: "https://example.com/l/1",
  active: true,
  expires: null,
  ...over,
});

describe("applyParcours", () => {
  it("replaces known tags and drops paragraphs whose value is missing", () => {
    const md =
      "Ma formation a duré {parcours:duree}.\n\nIl m'est resté {parcours:reste} à payer.\n\nFin.";
    expect(applyParcours(md, { duree: "2 mois" })).toBe("Ma formation a duré 2 mois.\n\nFin.");
  });

  it("returns null for a single line with a missing value", () => {
    expect(fillParcoursLine("{parcours:nb} projets", {})).toBeNull();
    expect(fillParcoursLine("{parcours:nb} projets", { nb: "30" })).toBe("30 projets");
  });
});

describe("renderMarkdown", () => {
  it("turns cube: tags into sponsored links and keeps normal links normal", () => {
    const { html } = renderMarkdown(
      "[la masterclass](cube:principal) et [la doc](https://lovable.dev)",
      {
        principal: "https://ressources.cube.fr/l/abc",
        secondaire: null,
      },
    );
    expect(html).toContain('href="https://ressources.cube.fr/l/abc"');
    expect(html).toContain('rel="sponsored noopener"');
    expect(html).toContain('href="https://lovable.dev" rel="noopener"');
  });

  it("renders a missing partner link as plain text", () => {
    const { html } = renderMarkdown("[voir](cube:secondaire)", {
      principal: null,
      secondaire: null,
    });
    expect(html).not.toContain("<a");
  });

  it("builds a table of contents from H2 and never emits an H1", () => {
    const { html, toc } = renderMarkdown("# Titre\n\n## Première partie\n\n## Première partie", {
      principal: null,
      secondaire: null,
    });
    expect(html).not.toContain("<h1");
    expect(toc.map((t) => t.id)).toEqual(["titre", "premiere-partie", "premiere-partie-2"]);
  });

  it("escapes raw HTML coming from Airtable", () => {
    const { html } = renderMarkdown('<script>alert("x")</script>', {
      principal: null,
      secondaire: null,
    });
    expect(html).not.toContain("<script>");
  });
});

describe("parseFaq", () => {
  it("splits question / answer blocks", () => {
    const faq = parseFaq(
      "### Combien ça coûte ?\nCela dépend du financement.\n\n### Et le CPF ?\nOui.",
      {
        principal: null,
        secondaire: null,
      },
    );
    expect(faq.map((f) => f.question)).toEqual(["Combien ça coûte ?", "Et le CPF ?"]);
    expect(faq[0]?.answerText).toBe("Cela dépend du financement.");
  });
});

describe("partner links", () => {
  const today = "2026-10-22";

  it("treats inactive or expired links as invalid", () => {
    expect(isLinkValid(link({ active: false }), today)).toBe(false);
    expect(isLinkValid(link({ expires: "2026-10-21" }), today)).toBe(false);
    expect(isLinkValid(link({ expires: "2026-10-22" }), today)).toBe(true);
  });

  it("falls back to the ressources link when an article link has expired", () => {
    const links = [
      link({ id: "evt", type: "evenement", url: "https://x/evt", expires: "2026-10-01" }),
      link({ id: "res", type: "ressources", url: "https://x/res" }),
    ];
    const resolved = resolveArticleLinks({ principalId: "evt", secondaryId: null }, links, today);
    expect(resolved.principal?.url).toBe("https://x/res");
    expect(linkOfType(links, "evenement", today)).toBeNull();
  });
});

describe("table of contents", () => {
  it("decodes HTML entities in entry labels", () => {
    const { toc } = renderMarkdown("## Qu'est-ce que c'est ?", {
      principal: null,
      secondaire: null,
    });
    expect(toc[0]?.text).toBe("Qu'est-ce que c'est ?");
  });
});
