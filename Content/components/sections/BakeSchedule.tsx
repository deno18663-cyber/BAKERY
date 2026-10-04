"use client";

import { useEffect, useState } from "react";
import { Flame, Timer } from "lucide-react";
import { SCHEDULE } from "@/lib/content";
import type { ScheduleItem } from "@/lib/types";
import { fetchSchedule } from "@/lib/api";
import { useBakeryStore } from "@/lib/stores/bakery-store";
import { cycleStatus, formatMinutes } from "@/lib/bakery-schedule";
import { useMounted } from "@/lib/use-mounted";
import Reveal from "@/components/ui/Reveal";

function PhaseBadge({ item, now }: { item: ScheduleItem; now: number }) {
  const status = cycleStatus(item, new Date(now));
  const ready = status.minutesUntilReady === 0;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
        status.phase === "oven"
          ? "bg-terracotta/25 text-[#ffb3b0]"
          : ready
            ? "bg-sage/25 text-sage"
            : "bg-cream/10 text-cream/50"
      }`}
    >
      {status.phase === "oven" && <Flame className="h-3 w-3 animate-pulse-soft" />}
      {status.phase === "cooling" && <Timer className="h-3 w-3" />}
      {status.label}
    </span>
  );
}

function PhaseText({ item, now }: { item: ScheduleItem; now: number }) {
  const status = cycleStatus(item, new Date(now));
  const ready = status.minutesUntilReady === 0;
  if (status.phase === "oven") {
    return (
      <>
        <p className="text-sm text-cream/60">
          Pulls in <span className="font-bold text-golden">{formatMinutes(status.minutesToNext)}</span>, ready after cooling.
        </p>
        <p className="text-sm text-cream/40">On the stone at 240°C — coming out {formatMinutes(status.minutesUntilReady)}.</p>
      </>
    );
  }
  if (ready) {
    return (
      <>
        <p className="text-sm text-cream/60">
          <span className="font-bold text-sage">Fresh and ready now.</span> On the rack, flour-dusted.
        </p>
        <p className="text-sm text-cream/40">Next batch in {formatMinutes(status.minutesToNext)}.</p>
      </>
    );
  }
  return (
    <>
      <p className="text-sm text-cream/60">
        Next batch in <span className="font-bold text-golden">{formatMinutes(status.minutesToNext)}</span>.
      </p>
      <p className="text-sm text-cream/40">Out of the oven in {formatMinutes(status.minutesUntilReady)}.</p>
    </>
  );
}

/**
 * "Fresh Out of the Oven" — a deterministic, clock-driven simulation of the
 * day's bake cycles. Every visitor sees the same schedule for their local
 * time. (Illustrative — not real oven telemetry.)
 */
export default function BakeSchedule() {
  const mounted = useMounted();
  const now = useBakeryStore((s) => s.now);
  // Bake lineup from the backend (same catalog math as lib/bakery-schedule),
  // falling back to the static set when the backend is offline.
  const [items, setItems] = useState<ScheduleItem[]>(SCHEDULE);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = () => {
      fetchSchedule()
        .then((d) => {
          if (alive && d.items.length > 0) {
            setItems(d.items);
            setLive(true);
          }
        })
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 60000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <section id="schedule" className="relative overflow-hidden bg-espresso px-6 py-24 text-cream lg:px-16">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-terracotta/20 blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-golden/15 blur-[120px]" aria-hidden />

      <Reveal className="relative max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-golden">Fresh out of the oven</p>
        <h2 className="mt-3 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
          What&rsquo;s baking <em className="text-golden">right now</em>
        </h2>
        <p className="mt-4 text-cream/60">
          A taste of today&rsquo;s bake plan — the next batch of each is counted down live.
        </p>
      </Reveal>

      <div className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.06}>
            <article className="group rounded-3xl border border-cream/10 bg-cream/5 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-golden/40">
              <div className="flex items-start justify-between">
                <span className="text-4xl transition-transform duration-300 group-hover:scale-110">{item.emoji}</span>
                {mounted ? (
                  <PhaseBadge item={item} now={now} />
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-cream/40">
                    …
                  </span>
                )}
              </div>

              <h3 className="mt-4 font-display text-xl text-cream">{item.name}</h3>

              <div className="mt-4 space-y-1.5">{mounted && <PhaseText item={item} now={now} />}</div>
            </article>
          </Reveal>
        ))}
      </div>

      <p className="relative mt-8 text-xs text-cream/35">
        {live
          ? "Live from the bakery server — the next batch of each is counted down as it happens."
          : "Times are illustrative, generated from your local clock — a snapshot of the kind of rhythm the bakery keeps."}
      </p>
    </section>
  );
}
