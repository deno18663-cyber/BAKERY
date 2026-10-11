/**
 * WarmWash — a whisper of bakery warmth behind the light sections.
 * Two large, heavily-blurred washes (antique white + bisque) that sit
 * behind the content (`-z-10`) so text and cards stay crisp.
 * Pass `flip` on alternating sections so the warmth feels organic,
 * not stamped.
 */
export default function WarmWash({ flip = false }: { flip?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className={`absolute -top-40 h-[30rem] w-[30rem] rounded-full bg-[#faebd7] opacity-80 blur-[130px] sm:h-[38rem] sm:w-[38rem] ${
          flip ? "-right-48" : "-left-48"
        }`}
      />
      <div
        className={`absolute -bottom-48 h-[26rem] w-[26rem] rounded-full bg-[#ffe4c4] opacity-70 blur-[120px] sm:h-[34rem] sm:w-[34rem] ${
          flip ? "-left-40" : "-right-40"
        }`}
      />
    </div>
  );
}
