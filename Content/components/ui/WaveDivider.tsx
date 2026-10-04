/** Decorative wave that sits at the top edge of the dark footer. */
export default function WaveDivider({ fill = "#1A1615", className }: { fill?: string; className?: string }) {
  return (
    <div className={`pointer-events-none w-full overflow-hidden leading-none ${className ?? ""}`} aria-hidden>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="block h-[54px] w-full sm:h-[70px]">
        <path
          fill={fill}
          d="M0,52 C180,92 360,10 540,42 C720,74 900,18 1080,50 C1260,82 1380,34 1440,52 L1440,90 L0,90 Z"
        />
      </svg>
    </div>
  );
}
