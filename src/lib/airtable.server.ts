// Server-only Airtable access. Never import from client code.
// Airtable is the single source of truth: articles, partner links, the logbook
// ("Carnet de bord") and the author's personal facts ("Mon parcours").
import { categoryByName } from "./site";

const BASE_ID = "app6gtf0nc4rI82yH";
const TABLES = {
  articles: "tblG61pdKCFtR0eJY",
  links: "tblmEC5w2FEWaOwLV",
  carnet: "tbl9Y59XRWlIN5c1l",
  parcours: "tblVFyBP0XotwEUWZ",
  clics: "tbliZYx7zZoIm5kvR",
} as const;
const CACHE_TTL_MS = 5 * 60 * 1000;

type AirtableRecord = { id: string; fields: Record<string, unknown> };

const cache = new Map<string, { at: number; data: AirtableRecord[] }>();
const inflight = new Map<string, Promise<AirtableRecord[]>>();

export function readToken(name = "AIRTABLE_TOKEN"): string | undefined {
  // `process` exists on the server runtime; guard so a missing global never throws.
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  const token = env?.[name];
  return token && token.trim() ? token.trim() : undefined;
}

async function fetchAll(
  table: string,
  params: Record<string, string> = {},
): Promise<AirtableRecord[]> {
  const token = readToken();
  if (!token) return [];
  const key = `${table}?${new URLSearchParams(params).toString()}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data;
  const pending = inflight.get(key);
  if (pending) return pending;

  const p = (async () => {
    const out: AirtableRecord[] = [];
    let offset: string | undefined;
    try {
      do {
        const qs = new URLSearchParams({ ...params, pageSize: "100" });
        if (offset) qs.set("offset", offset);
        const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${table}?${qs}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error(`Airtable ${table} [${res.status}]: ${await res.text()}`);
          return hit?.data ?? [];
        }
        const json = (await res.json()) as { records: AirtableRecord[]; offset?: string };
        out.push(...json.records);
        offset = json.offset;
      } while (offset);
      cache.set(key, { at: Date.now(), data: out });
      return out;
    } catch (e) {
      console.error("Airtable fetch failed", e);
      return hit?.data ?? [];
    } finally {
      inflight.delete(key);
    }
  })();
  inflight.set(key, p);
  return p;
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const firstId = (v: unknown) =>
  Array.isArray(v) && typeof v[0] === "string" ? (v[0] as string) : null;

/* ------------------------------------------------------------------ Articles */

export type ArticleRecord = {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  faq: string;
  sources: string;
  dansMonCas: string;
  masterclass: string;
  principalId: string | null;
  secondaryId: string | null;
  readingMinutes: number;
};

export function readingMinutes(text: string) {
  const words = text
    .replace(/[#*_>`|\-[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export async function getPublishedArticles(): Promise<ArticleRecord[]> {
  const records = await fetchAll(TABLES.articles, { filterByFormula: "{Statut}='Publié'" });
  return records
    .filter(
      (r) =>
        str(r.fields["Statut"]) === "Publié" && str(r.fields["Slug"]) && str(r.fields["Titre"]),
    )
    .map((r) => {
      const f = r.fields;
      const category = str(f["Catégorie"]);
      const content = str(f["Contenu"]);
      const publishedAt = str(f["Publié le"]) || null;
      return {
        id: r.id,
        title: str(f["Titre"]),
        slug: str(f["Slug"]),
        category,
        categorySlug: categoryByName(category)?.slug ?? null,
        publishedAt,
        updatedAt: str(f["Mis à jour le"]) || publishedAt,
        metaTitle: str(f["Meta title"]),
        metaDescription: str(f["Meta description"]),
        excerpt: str(f["Extrait"]),
        content,
        faq: str(f["FAQ"]),
        sources: str(f["Sources"]),
        dansMonCas: str(f["Dans mon cas"]),
        masterclass: str(f["Masterclass source"]),
        principalId: firstId(f["Lien principal"]),
        secondaryId: firstId(f["Lien secondaire"]),
        readingMinutes: readingMinutes(content),
      };
    })
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
}

/* -------------------------------------------------------------- Liens Cube */

export type CubeLink = {
  id: string;
  label: string;
  type: string;
  theme: string;
  url: string;
  active: boolean;
  expires: string | null;
};

export async function getCubeLinks(): Promise<CubeLink[]> {
  const records = await fetchAll(TABLES.links);
  return records.map((r) => ({
    id: r.id,
    label: str(r.fields["Libellé"]),
    type: str(r.fields["Type"]),
    theme: str(r.fields["Thème"]),
    url: str(r.fields["URL"]),
    active: r.fields["Actif"] === true,
    expires: str(r.fields["Expire le"]) || null,
  }));
}

/** Today's date (YYYY-MM-DD) in Europe/Paris. */
export function todayParis(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function isLinkValid(link: CubeLink | undefined, today = todayParis()): link is CubeLink {
  if (!link || !link.active || !link.url) return false;
  if (!link.expires) return true;
  return link.expires.slice(0, 10) >= today;
}

/** First valid link of a given type (e.g. "ressources", "rdv", "evenement", "communaute"). */
export function linkOfType(links: CubeLink[], type: string, today = todayParis()) {
  return links.find((l) => l.type === type && isLinkValid(l, today)) ?? null;
}

/** Resolve the links used by cube:principal / cube:secondaire, falling back to the "ressources" link. */
export function resolveArticleLinks(
  article: Pick<ArticleRecord, "principalId" | "secondaryId">,
  links: CubeLink[],
  today = todayParis(),
) {
  const byId = new Map(links.map((l) => [l.id, l]));
  const fallback = linkOfType(links, "ressources", today);
  const pick = (id: string | null) => {
    const l = id ? byId.get(id) : undefined;
    return isLinkValid(l, today) ? l : fallback;
  };
  return { principal: pick(article.principalId), secondaire: pick(article.secondaryId) };
}

/* ------------------------------------------------------------ Carnet de bord */

export type CarnetEntry = { id: string; texte: string; date: string | null };

export async function getCarnet(limit = 3): Promise<CarnetEntry[]> {
  const records = await fetchAll(TABLES.carnet, { filterByFormula: "{Visible}" });
  return records
    .filter((r) => r.fields["Visible"] === true && str(r.fields["Texte"]))
    .map((r) => ({ id: r.id, texte: str(r.fields["Texte"]), date: str(r.fields["Date"]) || null }))
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, limit);
}

/* ------------------------------------------------------------- Mon parcours */

/** Key/value facts about the author. Empty values are left out, so they never reach the page. */
export async function getParcours(): Promise<Record<string, string>> {
  const records = await fetchAll(TABLES.parcours);
  const out: Record<string, string> = {};
  for (const r of records) {
    const key = str(r.fields["Clé"]);
    const value = str(r.fields["Valeur"]);
    if (key && value) out[key] = value;
  }
  return out;
}

/* -------------------------------------------------------------------- Clics */

/**
 * Records one click on a partner link. Uses AIRTABLE_WRITE_TOKEN when set, otherwise
 * AIRTABLE_TOKEN (which then needs the data.records:write scope). Never throws:
 * a failed write must never block the redirect.
 */
export async function recordClick(click: {
  linkId: string;
  page: string;
  place: string;
  test: boolean;
}) {
  const token = readToken("AIRTABLE_WRITE_TOKEN") ?? readToken();
  if (!token) return;
  try {
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLES.clics}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        typecast: true,
        records: [
          {
            fields: {
              Date: new Date().toISOString(),
              Lien: [click.linkId],
              Page: click.page.slice(0, 200),
              Emplacement: click.place,
              Test: click.test,
            },
          },
        ],
      }),
    });
    if (!res.ok) console.error(`Airtable clics [${res.status}]: ${await res.text()}`);
  } catch (e) {
    console.error("Airtable click write failed", e);
  }
}
