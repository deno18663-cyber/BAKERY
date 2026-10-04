/** Croissant mark used in the header + footer. */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M4 19.5C6.5 14.5 10.5 11 16 11s9.5 3.5 12 8.5c-3.2 2.6-5.4 2.4-8.4 1.3-1.7 2.9-5 2.9-6.7 0-3 1.1-5.2 1.3-8.9-1.3Z"
        fill="#E09F3E"
      />
      <path
        d="M7 20.2c2.3-3.6 5-5.8 8.5-6.3M18.6 13.4c3 .5 5.7 2.6 7.6 5.8"
        stroke="#9E2A2B"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
