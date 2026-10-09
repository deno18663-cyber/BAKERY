"use client";

import Link from "next/link";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.4a4 4 0 1 1-7.9 1.1 4 4 0 0 1 7.9-1.1Z" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
import { HOURS, NAV_LINKS, STORE } from "@/lib/content";
import Logo from "@/components/ui/Logo";
import WaveDivider from "@/components/ui/WaveDivider";
import { useMounted } from "@/lib/use-mounted";
import { scrollToTarget } from "@/components/smooth/SmoothScroll";

export default function Footer() {
  const mounted = useMounted();
  const todayIdx = (new Date().getDay() + 6) % 7;
  const today = HOURS[todayIdx];

  return (
    <footer className="relative bg-espresso text-cream">
      <WaveDivider fill="#1A1615" className="-mt-px" />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#hero");
            }}
            className="flex items-center gap-2.5"
          >
            <Logo className="h-9 w-9" />
            <span className="font-display text-xl">
              Oven <span className="text-golden">&</span> Artisan
            </span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
            Slow-fermented, hand-shaped, stone-baked. We make a little, carefully, every day.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={STORE.socials.instagram} aria-label="Instagram" target="_blank" rel="noreferrer" className="rounded-full border border-cream/15 p-2.5 transition-colors hover:border-golden hover:text-golden">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href={STORE.socials.facebook} aria-label="Facebook" target="_blank" rel="noreferrer" className="rounded-full border border-cream/15 p-2.5 transition-colors hover:border-golden hover:text-golden">
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a href={`mailto:${STORE.socials.email}`} aria-label="Email" className="rounded-full border border-cream/15 p-2.5 transition-colors hover:border-golden hover:text-golden">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="Footer">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-golden">Explore</h3>
          <ul className="mt-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget(`#${l.id}`);
                  }}
                  className="text-sm text-cream/70 transition-colors hover:text-cream"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hours */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-golden">Hours</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
            {HOURS.map((d) => (
              <li key={d.day} className="flex justify-between gap-4">
                <span>{d.day}</span>
                <span className="text-cream/50">
                  {d.open && d.close ? `${d.open.slice(0, 5)}–${d.close.slice(0, 5)}` : "Closed"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visit */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-golden">Visit us</h3>
          <ul className="mt-4 space-y-3 text-sm text-cream/70">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-golden" />
              <span>{STORE.name}
                <br />
                {STORE.address}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-golden" />
              <a href={`tel:${STORE.phone.replace(/[^+\d]/g, "")}`} className="hover:text-cream">
                {STORE.phone}
              </a>
            </li>
          </ul>
          <button
            onClick={() => scrollToTarget("#hero")}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-xs font-semibold text-cream/70 transition-colors hover:border-golden hover:text-golden"
          >
            <ArrowUp className="h-3.5 w-3.5" /> Back to top
          </button>
        </div>
      </div>

      <div className="border-t border-cream/10 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-cream/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Oven &amp; Artisan. Slow-baked, never mass-produced.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-cream">
              Privacy Policy
            </Link>
            <Link href="/#faq" className="transition-colors hover:text-cream">
              FAQ
            </Link>
            {mounted && (
              <p>Today: {today.open ? `${today.day} · ${today.open.slice(0, 5)}–${today.close!.slice(0, 5)}` : `${today.day} · Closed`}</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
