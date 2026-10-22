import { Marked, type Tokens } from "marked";

export type CubeUrls = { principal: string | null; secondaire: string | null };
export type TocItem = { id: string; text: string };

function escapeAttr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function renderMarkdown(md: string, cube: CubeUrls) {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, { tokens, depth, text }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        const level = Math.min(Math.max(depth, 2), 4); // H1 is reserved for the page title
        let id = slugify(text) || "section";
        let n = 2;
        while (used.has(id)) id = `${slugify(text)}-${n++}`;
        used.add(id);
        if (level === 2) toc.push({ id, text: inner.replace(/<[^>]+>/g, "") });
        return `<h${level} id="${id}">${inner}</h${level}>\n`;
      },
      link(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, { href, title, tokens }: Tokens.Link) {
        const inner = this.parser.parseInline(tokens);
        const t = title ? ` title="${escapeAttr(title)}"` : "";
        const m = /^cube:(principal|secondaire)$/i.exec(href.trim());
        if (m) {
          const url = m[1].toLowerCase() === "principal" ? cube.principal : cube.secondaire;
          if (!url) return `<span>${inner}</span>`;
          return `<a href="${escapeAttr(url)}" class="lien-partenaire" rel="sponsored noopener" target="_blank"${t}>${inner}</a>`;
        }
        if (href.startsWith("cube:")) return `<span>${inner}</span>`;
        const external = /^https?:\/\//i.test(href);
        return `<a href="${escapeAttr(href)}"${external ? ' rel="noopener" target="_blank"' : ""}${t}>${inner}</a>`;
      },
      table(this: unknown, token: Tokens.Table) {
        return `<div class="table-wrap">${Marked.prototype.parser ? "" : ""}${defaultTable(token)}</div>`;
      },
    },
  });
  const html = marked.parse(md, { async: false }) as string;
  return { html, toc };
}

const tableRenderer = new Marked({ gfm: true });
function defaultTable(token: Tokens.Table) {
  return tableRenderer.parser([token]);
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
        question: first.trim(),
        answerHtml: renderMarkdown(answer, cube).html,
        answerText: answer.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_#>`]/g, "").trim(),
      };
    })
    .filter((f) => f.question && f.answerText);
}
