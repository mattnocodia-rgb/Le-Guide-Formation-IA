import { describe, expect, it } from "vitest";

import { splitForVideos, youtubeId } from "@/lib/video";

describe("youtubeId", () => {
  it("reads the id from the usual YouTube links", () => {
    expect(youtubeId("https://youtube.com/shorts/dQw4w9WgXcQ?si=abc")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=3")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://m.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("  https://youtu.be/dQw4w9WgXcQ  ")).toBe("dQw4w9WgXcQ");
  });
  it("rejects anything that is not a YouTube video", () => {
    expect(youtubeId("")).toBeNull();
    expect(youtubeId("not a url")).toBeNull();
    expect(youtubeId("https://www.instagram.com/reel/abc")).toBeNull();
    expect(youtubeId("https://youtube.com/@chaine")).toBeNull();
    expect(youtubeId("https://youtube.com.evil.com/shorts/dQw4w9WgXcQ")).toBeNull();
    expect(youtubeId("https://youtu.be/short")).toBeNull();
    expect(youtubeId('https://youtu.be/dQw4w9WgXc"')).toBeNull();
    expect(youtubeId("javascript:alert(1)")).toBeNull();
  });
});

describe("splitForVideos", () => {
  const html =
    '<p>Intro</p><p>Suite</p><h2>A</h2><p>a</p><h2 id="b">B</h2><p>b</p><h2>C</h2><p>c</p><h2>D</h2><p>d</p>';

  it("leaves the article whole without video", () => {
    expect(splitForVideos(html, 0)).toEqual({ parts: [{ html, video: null }], placed: 0 });
  });
  it("puts the first video beside the intro paragraph", () => {
    const { parts, placed } = splitForVideos(html, 1);
    expect(placed).toBe(1);
    expect(parts[0]).toEqual({ html: "<p>Intro</p>", video: 0 });
    expect(parts.map((p) => p.html).join("")).toBe(html);
  });
  it("puts the next videos at the 2nd, 4th… H2", () => {
    const { parts, placed } = splitForVideos(html, 2);
    expect(placed).toBe(2);
    expect(parts.map((p) => p.video)).toEqual([0, null, 1]);
    expect(parts[2]?.html.startsWith('<h2 id="b">B</h2>')).toBe(true);
    expect(parts.map((p) => p.html).join("")).toBe(html);
  });
  it("reports the videos that found no place", () => {
    const { placed } = splitForVideos(html, 4);
    expect(placed).toBe(3);
  });
});
