"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/content";
import { useCartStore } from "@/lib/stores/cart-store";
import LiveStatusPill from "@/components/ui/LiveStatusPill";
import Logo from "@/components/ui/Logo";
import { scrollToTarget } from "@/components/smooth/SmoothScroll";

export default function Header() {
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const openCart = useCartStore((s) => s.openCart);
  const [menuOpen, setMenuOpen] = useState(false);
  const badgeScale = useSpring(1, { stiffness: 320, damping: 18 });

  useEffect(() => {
    if (count > 0) {
      badgeScale.set(1.45);
      const t = setTimeout(() => badgeScale.set(1), 170);
      return () => clearTimeout(t);
    }
  }, [count, badgeScale]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-espresso/5 bg-cream/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#hero");
            }}
            className="group flex items-center gap-2.5"
          >
            <Logo className="h-8 w-8 transition-transform duration-700 group-hover:rotate-[360deg]" />
            <span className="font-display text-lg tracking-tight">
              Oven <span className="text-golden">&</span> Artisan
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(`#${l.id}`);
                }}
                className="text-sm font-medium text-espresso/70 transition-colors hover:text-terracotta"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LiveStatusPill className="hidden md:inline-flex" />
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative rounded-full border border-espresso/10 bg-cream p-2.5 shadow-sm transition-transform hover:scale-105"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <motion.span
                  style={{ scale: badgeScale }}
                  className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[11px] font-bold text-cream"
                >
                  {count}
                </motion.span>
              )}
            </button>
            <button
              className="rounded-full border border-espresso/10 bg-cream p-2.5 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-espresso/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-[70] h-full w-72 bg-cream p-6 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl">Menu</span>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-5" aria-label="Mobile">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      scrollToTarget(`#${l.id}`);
                    }}
                    className="font-display text-2xl text-espresso transition-colors hover:text-terracotta"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
