/** YouTube helpers shared by the server (Airtable « Vidéos ») and the article page. */

const ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Extracts the 11-character video id from any usual YouTube link:
 * youtube.com/shorts/ID, youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID,
 * m.youtube.com, youtube-nocookie.com. Returns null for anything else.
 */
export function youtubeId(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  const host = u.hostname.replace(/^(www|m|music)\./, "");
  let candidate: string | null = null;
  if (host === "youtu.be") {
    candidate = u.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const [, first, second] = u.pathname.split("/");
    if (first === "watch") candidate = u.searchParams.get("v");
    else if (first === "shorts" || first === "embed" || first === "live")
      candidate = second ?? null;
  }
  return candidate && ID.test(candidate) ? candidate : null;
}

export const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const youtubeEmbed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;
export const youtubeWatch = (id: string) => `https://www.youtube.com/shorts/${id}`;

export type ArticlePart = { html: string; video: number | null };

/**
 * Splits the rendered article HTML so each Short can sit beside a part of the text: video 0
 * goes with the intro (up to the end of the first paragraph), video 1 with the section that
 * starts at the 2nd H2 after it, video 2 at the 4th H2, and so on. `placed` is how many
 * videos found a part; the others are shown after the article body.
 */
export function splitForVideos(
  html: string,
  count: number,
): { parts: ArticlePart[]; placed: number } {
  if (count <= 0) return { parts: [{ html, video: null }], placed: 0 };
  const introEnd = html.indexOf("</p>");
  if (introEnd < 0) return { parts: [{ html, video: 0 }], placed: 1 };
  const cut = introEnd + "</p>".length;
  const parts: ArticlePart[] = [{ html: html.slice(0, cut), video: 0 }];
  const rest = html.slice(cut);
  const h2s = [...rest.matchAll(/<h2[\s>]/g)].map((m) => m.index ?? 0);
  let from = 0;
  let current: number | null = null;
  let placed = 1;
  for (let k = 1; k < count; k++) {
    const at = h2s[2 * k - 1];
    if (at === undefined) break;
    parts.push({ html: rest.slice(from, at), video: current });
    from = at;
    current = k;
    placed++;
  }
  parts.push({ html: rest.slice(from), video: current });
  return { parts: parts.filter((p) => p.html.trim() || p.video !== null), placed };
}
