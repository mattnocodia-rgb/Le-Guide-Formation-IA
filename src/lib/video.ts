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
