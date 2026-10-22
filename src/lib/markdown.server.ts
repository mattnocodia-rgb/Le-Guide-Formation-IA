import { Marked, type Tokens } from "marked";

export type CubeUrls = { principal: string | null; secondaire: string | null };
export type TocItem = { id: string; text: string };

function escapeAttr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function decodeEntities(s: string) {
  return s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const PARCOURS_TAG = /\{parcours:([a-z0-9_]+)\}/gi;

/**
 * Replace {parcours:clé} tags with the author's values from Airtable.
 * A paragraph (block separated by a blank line) holding a tag with no value is
 * dropped entirely, so a half-finished sentence never reaches the page.
 */
export function applyParcours(md: string, parcours: Record<string, string>) {
  if (!md) return "";
  return md
    .split(/\n{2,}/)
    .filter((block) => {
      for (const m of block.matchAll(PARCOURS_TAG)) {
        if (!parcours[(m[1] ?? "").toLowerCase()]) return false;
      }
      return true;
    })
    .map((block) =>
      block.replace(PARCOURS_TAG, (_, key: string) => parcours[key.toLowerCase()] ?? ""),
    )
    .join("\n\n")
    .trim();
}

/** Replace {parcours:clé} in a single line of plain text; returns null when a value is missing. */
export function fillParcoursLine(text: string, parcours: Record<string, string>) {
  let missing = false;
  const out = text.replace(PARCOURS_TAG, (_, key: string) => {
    const v = parcours[key.toLowerCase()];
    if (!v) missing = true;
    return v ?? "";
  });
  return missing ? null : out;
}

export function renderMarkdown(md: string, cube: CubeUrls) {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading(
        this: { parser: { parseInline: (t: Tokens.Generic[]) => string } },
        { tokens, depth, text }: Tokens.Heading,
      ) {
        const inner = this.parser.parseInline(tokens);
        const level = Math.min(Math.max(depth, 2), 4); // H1 is reserved for the page title
        const base = slugify(text) || "section";
        let id = base;
        let n = 2;
        while (used.has(id)) id = `${base}-${n++}`;
        used.add(id);
        if (level === 2) toc.push({ id, text: decodeEntities(inner.replace(/<[^>]+>/g, "")) });
        return `<h${level} id="${id}">${inner}</h${level}>\n`;
      },
      link(
        this: { parser: { parseInline: (t: Tokens.Generic[]) => string } },
        { href, title, tokens }: Tokens.Link,
      ) {
        const inner = this.parser.parseInline(tokens);
        const t = title ? ` title="${escapeAttr(title)}"` : "";
        const m = /^cube:(principal|secondaire)$/i.exec(href.trim());
        if (m) {
          const url = (m[1] ?? "").toLowerCase() === "principal" ? cube.principal : cube.secondaire;
          if (!url) return `<span>${inner}</span>`;
          return `<a href="${escapeAttr(url)}" class="lien-partenaire" rel="sponsored noopener" target="_blank"${t}>${inner}</a><sup class="mention-partenaire">partenaire</sup>`;
        }
        if (href.startsWith("cube:")) return `<span>${inner}</span>`;
        const external = /^https?:\/\//i.test(href);
        return `<a href="${escapeAttr(href)}"${external ? ' rel="noopener" target="_blank"' : ""}${t}>${inner}</a>`;
      },
      // Raw HTML in Airtable text is not trusted: show it as text.
      html({ text }: Tokens.HTML | Tokens.Tag) {
        return escapeAttr(text);
      },
    },
  });
  const html = (marked.parse(md, { async: false }) as string)
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>");
  return { html, toc };
}

export type FaqItem = { question: string; answerHtml: string; answerText: string };

export function parseFaq(raw: string, cube: CubeUrls): FaqItem[] {
  if (!raw.trim()) return [];
  return raw
    .split(/^#{2,4}\s+/m)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block) => {
      const [first, ...rest] = block.split("\n");
      const answer = rest.join("\n").trim();
      return {
        question: (first ?? "").trim(),
        answerHtml: renderMarkdown(answer, cube).html,
        answerText: answer
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/[*_#>`]/g, "")
          .trim(),
      };
    })
    .filter((f) => f.question && f.answerText);
}
