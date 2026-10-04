"use client";

import { useBakeryStore } from "@/lib/stores/bakery-store";
import { openStatus } from "@/lib/bakery-schedule";
import { useMounted } from "@/lib/use-mounted";

/** Live open/closed pill — "Open today until 7 PM" — driven by the bakery clock. */
export default function LiveStatusPill({ className }: { className?: string }) {
  const mounted = useMounted();
  const now = useBakeryStore((s) => s.now);
  const status = openStatus(new Date(now));
  const open = mounted ? status.open : false;
  const label = mounted ? status.label : "…";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
        open ? "border-sage/40 bg-sage/10 text-espresso" : "border-terracotta/30 bg-terracotta/10 text-terracotta"
      } ${className ?? ""}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full ${open ? "animate-ping bg-sage opacity-60" : "bg-terracotta"}`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${open ? "bg-sage" : "bg-terracotta"}`} />
      </span>
      {label}
    </span>
  );
}
