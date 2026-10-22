// Server-only Airtable access. Never import from client code.
import { categoryByName } from "./site";

const BASE_ID = "app6gtf0nc4rI82yH";
const ARTICLES_TABLE = "tblG61pdKCFtR0eJY";
const LINKS_TABLE = "tblmEC5w2FEWaOwLV";
const CACHE_TTL_MS = 5 * 60 * 1000;

type AirtableRecord = { id: string; fields: Record<string, unknown> };

const cache = new Map<string, { at: number; data: AirtableRecord[] }>();
const inflight = new Map<string, Promise<AirtableRecord[]>>();

async function fetchAll(table: string, params: Record<string, string> = {}): Promise<AirtableRecord[]> {
  const token = process.env["AIRTABLE_TOKEN"];
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
const firstId = (v: unknown) => (Array.isArray(v) && typeof v[0] === "string" ? (v[0] as string) : null);

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
  principalId: string | null;
  secondaryId: string | null;
  readingMinutes: number;
};

export type CubeLink = { id: string; label: string; type: string; url: string; active: boolean; expires: string | null };

export function readingMinutes(text: string) {
  const words = text.replace(/[#*_>`|\-[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export async function getPublishedArticles(): Promise<ArticleRecord[]> {
  const records = await fetchAll(ARTICLES_TABLE, { filterByFormula: "{Statut}='Publié'" });
  return records
    .filter((r) => str(r.fields["Statut"]) === "Publié" && str(r.fields["Slug"]) && str(r.fields["Titre"]))
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
        principalId: firstId(f["Lien principal"]),
        secondaryId: firstId(f["Lien secondaire"]),
        readingMinutes: readingMinutes(content),
      };
    })
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
}

export async function getCubeLinks(): Promise<CubeLink[]> {
  const records = await fetchAll(LINKS_TABLE);
  return records.map((r) => ({
    id: r.id,
    label: str(r.fields["Libellé"]),
    type: str(r.fields["Type"]),
    url: str(r.fields["URL"]),
    active: r.fields["Actif"] === true,
    expires: str(r.fields["Expire le"]) || null,
  }));
}

/** Today's date (YYYY-MM-DD) in Europe/Paris. */
export function todayParis(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function isLinkValid(link: CubeLink | undefined, today = todayParis()): link is CubeLink {
  if (!link || !link.active || !link.url) return false;
  if (!link.expires) return true;
  return link.expires.slice(0, 10) >= today;
}

/** Resolve the URLs for cube:principal / cube:secondaire, falling back to the "ressources" link. */
export function resolveCubeUrls(article: Pick<ArticleRecord, "principalId" | "secondaryId">, links: CubeLink[], today = todayParis()) {
  const byId = new Map(links.map((l) => [l.id, l]));
  const fallback = links.find((l) => l.type === "ressources" && isLinkValid(l, today)) ?? links.find((l) => l.type === "ressources" && l.url);
  const pick = (id: string | null) => {
    const l = id ? byId.get(id) : undefined;
    return isLinkValid(l, today) ? l.url : (fallback?.url ?? null);
  };
  return { principal: pick(article.principalId), secondaire: pick(article.secondaryId) };
}
