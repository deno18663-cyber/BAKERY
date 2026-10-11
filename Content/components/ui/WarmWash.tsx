/**
 * WarmWash — a whisper of bakery warmth behind the light sections.
 * Two wide, soft washes (antique white + bisque) hug the section edges
 * with their dense cores inside the viewport, fading gently inward.
 * They sit behind the content (`-z-10`) so text and cards stay crisp.
 * Pass `flip` on alternating sections so the warmth feels organic,
 * not stamped.
 */
export default function WarmWash({ flip = false }: { flip?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className={`absolute -top-24 h-[26rem] w-[42rem] rounded-full bg-[#faebd7] opacity-90 blur-[100px] sm:h-[30rem] sm:w-[52rem] ${
          flip ? "-right-24" : "-left-24"
        }`}
      />
      <div
        className={`absolute -bottom-24 h-[22rem] w-[36rem] rounded-full bg-[#ffe4c4] opacity-80 blur-[100px] sm:h-[26rem] sm:w-[44rem] ${
          flip ? "-left-24" : "-right-24"
        }`}
      />
    </div>
  );
}
