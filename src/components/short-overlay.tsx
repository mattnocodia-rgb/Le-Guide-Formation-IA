import { useRef, useState } from "react";

/** Vertical 9:16 Short laid over a case-study illustration: plays muted in a loop, sound on click. */
export function ShortOverlay({ src, projet, left }: { src: string; projet: string; left: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (sound) {
      v.muted = true;
      setSound(false);
    } else {
      v.muted = false;
      v.currentTime = 0;
      void v.play();
      setSound(true);
    }
  }

  return (
    <div
      className={`absolute -bottom-6 z-10 w-[34%] max-w-[190px] min-w-[120px] ${left ? "-left-4 -rotate-2" : "-right-4 rotate-2"}`}
    >
      <div className="sheet overflow-hidden rounded-[18px] p-1.5 shadow-[var(--shadow-card)]">
        <video
          ref={ref}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={`Exemple de short réalisé : « ${projet} »`}
          className="block aspect-[9/16] w-full rounded-[12px] bg-ink object-cover"
        />
      </div>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={sound}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 text-[13px] font-semibold whitespace-nowrap text-paper shadow-[var(--shadow-card)]"
      >
        {sound ? "🔇 Couper le son" : "🔊 Écouter"}
      </button>
    </div>
  );
}
