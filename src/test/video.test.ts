import { describe, expect, it } from "vitest";

import { youtubeId } from "@/lib/video";

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
