import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist — but the bakery does. Head back for something warm.",
  robots: { index: false, follow: true },
};

/** Branded 404 — keeps lost visitors inside the bakery, not on a dead end. */
export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24 text-center">
      <span className="text-7xl" aria-hidden="true">
        🥐
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-terracotta">
        Error 404 · Gone before evening
      </p>
      <h1 className="mt-3 max-w-xl font-display text-4xl leading-tight sm:text-5xl">
        This crumb didn&rsquo;t lead anywhere.
      </h1>
      <p className="mt-4 max-w-md text-lg text-espresso/70">
        The page you&rsquo;re after isn&rsquo;t on the shelf. The good news: everything else still is.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-cinnamon px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-terracotta"
        >
          Back to the bakery
        </Link>
        <Link
          href="/#menu"
          className="rounded-full border border-espresso/15 px-7 py-3.5 text-sm font-semibold text-espresso/70 transition-colors hover:border-espresso/40"
        >
          Browse the menu
        </Link>
        <Link
          href="/#visit"
          className="rounded-full border border-espresso/15 px-7 py-3.5 text-sm font-semibold text-espresso/70 transition-colors hover:border-espresso/40"
        >
          Visit us
        </Link>
      </div>
    </section>
  );
}
