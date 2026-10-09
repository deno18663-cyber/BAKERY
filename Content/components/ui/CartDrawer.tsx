"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { createOrder, type Order } from "@/lib/api";
import { miniConfetti } from "@/lib/confetti";

/** Slide-over order tray with qty controls, real checkout, and a live subtotal. */
export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const [name, setName] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Order | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setPlaced(null);
    }
  }, [isOpen]);

  /** Real checkout — POSTs the cart to the backend, which prices it server-side. */
  async function checkout() {
    if (placing || items.length === 0) return;
    setPlacing(true);
    setError(null);
    try {
      const order = await createOrder(
        items.map((i) => ({ id: i.id, qty: i.qty, options: i.options })),
        { name: name.trim() || "Walk-in" },
      );
      miniConfetti();
      clear();
      setPlaced(order);
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} — couldn't reach the bakery server. Please retry in a moment.`
          : "Checkout failed. Please retry.",
      );
    } finally {
      setPlacing(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-espresso/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            role="dialog"
            aria-label="Your order"
          >
            <header className="flex items-center justify-between border-b border-espresso/10 px-6 py-5">
              <h2 className="flex items-center gap-2 font-display text-2xl">
                <ShoppingBag className="h-5 w-5 text-golden" /> Your order
              </h2>
              <button onClick={closeCart} aria-label="Close cart" className="rounded-full p-2 hover:bg-espresso/5">
                <X className="h-5 w-5" />
              </button>
            </header>

            {placed ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <CheckCircle2 className="h-14 w-14 text-sage" />
                <p className="font-display text-2xl">Order placed!</p>
                <p className="text-sm text-espresso/60">
                  Order <span className="font-mono font-semibold text-espresso">{placed.id}</span> · $
                  {placed.total.toFixed(2)}
                </p>
                <p className="text-sm text-espresso/50">We&rsquo;ll have it warm and ready for pickup.</p>
                <button
                  onClick={closeCart}
                  className="mt-2 rounded-full bg-golden px-6 py-2.5 text-sm font-semibold text-espresso transition-colors hover:bg-golden/80"
                >
                  Back to the bakery
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <span className="text-6xl" aria-hidden="true">🥖</span>
                <p className="font-display text-xl">Your cart is empty</p>
                <p className="text-sm text-espresso/50">Add something warm from the bakery.</p>
                <button
                  onClick={closeCart}
                  className="mt-2 rounded-full bg-golden px-6 py-2.5 text-sm font-semibold text-espresso transition-colors hover:bg-golden/80"
                >
                  Keep browsing
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-espresso/10 bg-vanilla p-3"
                    >
                      <span className="text-3xl" aria-hidden="true">{item.emoji}</span>
                      <div className="flex-1">
                        <p className="font-display text-base leading-tight">{item.name}</p>
                        {item.options && <p className="text-xs text-espresso/50">{item.options}</p>}
                        <p className="text-sm font-semibold text-terracotta">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setQty(item.id, item.qty - 1)}
                          aria-label="Decrease quantity"
                          className="rounded-full border border-espresso/15 p-1.5 hover:bg-espresso/5"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.id, item.qty + 1)}
                          aria-label="Increase quantity"
                          className="rounded-full border border-espresso/15 p-1.5 hover:bg-espresso/5"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                          className="ml-1 rounded-full p-1.5 text-espresso/40 hover:text-terracotta"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <footer className="border-t border-espresso/10 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-espresso/60">Subtotal</span>
                    <span className="font-display text-2xl">${total.toFixed(2)}</span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name for pickup (optional)"
                    aria-label="Name for pickup"
                    className="mt-3 w-full rounded-full border border-espresso/15 bg-vanilla px-5 py-2.5 text-sm outline-none transition-colors focus:border-golden"
                  />
                  {error && <p className="mt-2 text-xs leading-relaxed text-terracotta">{error}</p>}
                  <button
                    onClick={checkout}
                    disabled={placing}
                    className="mt-3 w-full rounded-full bg-cinnamon py-4 text-sm font-bold text-cream transition-colors hover:bg-terracotta disabled:cursor-wait disabled:opacity-60"
                  >
                    {placing ? "Placing your order…" : `Checkout · $${total.toFixed(2)}`}
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
