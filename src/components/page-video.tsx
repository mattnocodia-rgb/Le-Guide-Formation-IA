import { useState } from "react";

/**
 * Vertical video that sums up a page, played on demand: only the poster (≈ 25 KB) is loaded with
 * the page; the video (≈ 2.5 MB, WebM first, MP4 fallback for Safari) is fetched when the visitor
 * clicks play, and starts with sound and native controls.
 */
export function PageVideo({
  webm,
  mp4,
  poster,
  title,
  duration,
  children,
}: {
  webm: string;
  mp4: string;
  poster: string;
  title: string;
  /** Shown to the visitor, e.g. « 1 min 42 ». */
  duration: string;
  /** One or two sentences next to the video. */
  children: React.ReactNode;
}) {
  const [play, setPlay] = useState(false);

  return (
    <section aria-label={`En vidéo : ${title}`} className="container-wide max-w-[880px] pt-12">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
        <div className="sheet w-[260px] max-w-[80%] shrink-0 -rotate-1 p-2 shadow-[var(--shadow-card)]">
          {play ? (
            <video
              controls
              autoPlay
              playsInline
              preload="auto"
              poster={poster}
              width={720}
              height={1280}
              aria-label={title}
              className="block aspect-[9/16] w-full bg-ink object-cover"
            >
              <source src={webm} type="video/webm" />
              <source src={mp4} type="video/mp4" />
            </video>
          ) : (
            <button
              type="button"
              onClick={() => setPlay(true)}
              aria-label={`Lire la vidéo : ${title} (${duration})`}
              className="relative block w-full cursor-pointer"
            >
              <img
                src={poster}
                alt=""
                width={720}
                height={1280}
                loading="lazy"
                decoding="async"
                className="block aspect-[9/16] w-full object-cover"
              />
              {/* Below the hook title and above the avatar, so the poster stays readable. */}
              <span className="absolute inset-x-0 top-[60%] flex justify-center">
                <span className="rounded-full bg-ink px-5 py-3 text-[16px] font-semibold whitespace-nowrap text-paper shadow-[var(--shadow-card)]">
                  ▶ Lire la vidéo
                </span>
              </span>
            </button>
          )}
        </div>
        <div className="min-w-0">
          <p className="note m-0 -rotate-1 text-[26px]">en vidéo, {duration}</p>
          <div className="m-0 mt-2 max-w-[440px] text-[17px] leading-relaxed text-ink-soft">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
