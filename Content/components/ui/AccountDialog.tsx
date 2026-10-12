"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Pencil, User, X } from "lucide-react";
import { useCustomerStore } from "@/lib/stores/customer-store";
import {
  fetchMyOrders,
  loginCustomer,
  logoutCustomer,
  updateMe,
  type Order,
} from "@/lib/api";

const inputCls =
  "w-full rounded-full border border-espresso/15 bg-cream px-5 py-2.5 text-sm outline-none transition-colors focus:border-golden";

/** Customer account panel: details, editing, and order history. */
export default function AccountDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const token = useCustomerStore((s) => s.token);
  const customer = useCustomerStore((s) => s.customer);
  const setSession = useCustomerStore((s) => s.setSession);
  const setCustomer = useCustomerStore((s) => s.setCustomer);
  const clearSession = useCustomerStore((s) => s.clearSession);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersState, setOrdersState] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Fresh state every time the panel opens.
  useEffect(() => {
    if (!open) return;
    setError(null);
    setEditing(false);
    setBusy(false);
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
      setPhone(customer.phone);
    } else {
      setName("");
      setEmail("");
      setPhone("");
    }
    setOrders([]);
    setOrdersState("idle");
  }, [open, customer]);

  // Load order history for signed-in customers.
  useEffect(() => {
    if (!open || !token || !customer || ordersState !== "idle") return;
    setOrdersState("loading");
    fetchMyOrders(token)
      .then((d) => {
        setOrders(d.orders);
        setOrdersState("done");
      })
      .catch(() => setOrdersState("done"));
  }, [open, token, customer, ordersState]);

  async function signIn() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const session = await loginCustomer(name.trim(), email.trim(), phone.trim());
      setSession(session.token, session.customer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Please retry.");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (busy || !token) return;
    setBusy(true);
    setError(null);
    try {
      const res = await updateMe(token, { name: name.trim(), email: email.trim(), phone: phone.trim() });
      setCustomer(res.customer);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save. Please retry.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    if (token) {
      try {
        await logoutCustomer(token);
      } catch {
        // Already dead server-side — just clear locally.
      }
    }
    clearSession();
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-espresso/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-[90] flex max-h-[85vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl bg-cream shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-48%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-48%" }}
            role="dialog"
            aria-label="Your account"
          >
            <header className="flex items-center justify-between border-b border-espresso/10 px-6 py-5">
              <h2 className="flex items-center gap-2 font-display text-2xl">
                <User className="h-5 w-5 text-golden" /> Your account
              </h2>
              <button onClick={onClose} aria-label="Close account" className="rounded-full p-2 hover:bg-espresso/5">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="overflow-y-auto px-6 py-5">
              {!customer || !token ? (
                <>
                  <p className="text-sm text-espresso/60">
                    Sign in with your details to order. No passwords — just who to bake for.
                  </p>
                  <div className="mt-4 space-y-2">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" autoComplete="name" className={inputCls} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" aria-label="Email address" autoComplete="email" className={inputCls} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit mobile number"
                      aria-label="Phone number"
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={10}
                      className={inputCls}
                    />
                  </div>
                  {error && <p className="mt-2 text-xs leading-relaxed text-terracotta">{error}</p>}
                  <button
                    onClick={signIn}
                    disabled={busy}
                    className="mt-3 w-full rounded-full bg-cinnamon py-3.5 text-sm font-bold text-cream transition-colors hover:bg-terracotta disabled:cursor-wait disabled:opacity-60"
                  >
                    {busy ? "Signing in…" : "Sign in"}
                  </button>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-espresso/10 bg-vanilla p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-espresso/50">Your details</p>
                      {!editing && (
                        <button
                          onClick={() => setEditing(true)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-espresso/15 px-3.5 py-1.5 text-xs font-semibold text-espresso/70 transition-colors hover:border-golden hover:text-espresso"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                      )}
                    </div>
                    {editing ? (
                      <div className="mt-3 space-y-2">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" autoComplete="name" className={inputCls} />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" aria-label="Email address" autoComplete="email" className={inputCls} />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="10-digit mobile number"
                          aria-label="Phone number"
                          autoComplete="tel"
                          inputMode="numeric"
                          maxLength={10}
                          className={inputCls}
                        />
                        {error && <p className="text-xs leading-relaxed text-terracotta">{error}</p>}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => {
                              setEditing(false);
                              setError(null);
                              setName(customer.name);
                              setEmail(customer.email);
                              setPhone(customer.phone);
                            }}
                            className="flex-1 rounded-full border border-espresso/15 px-4 py-2.5 text-sm font-semibold text-espresso/70 transition-colors hover:border-espresso/40"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={save}
                            disabled={busy}
                            className="flex-1 rounded-full bg-golden px-4 py-2.5 text-sm font-bold text-espresso transition-colors hover:bg-golden/85 disabled:cursor-wait disabled:opacity-60"
                          >
                            {busy ? "Saving…" : "Save"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <dl className="mt-3 space-y-1.5 text-sm">
                        <div className="flex justify-between gap-4">
                          <dt className="text-espresso/50">Name</dt>
                          <dd className="font-semibold">{customer.name}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-espresso/50">Email</dt>
                          <dd className="break-all font-semibold">{customer.email}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-espresso/50">Phone</dt>
                          <dd className="font-semibold">+91 {customer.phone}</dd>
                        </div>
                      </dl>
                    )}
                  </div>

                  <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-espresso/50">
                    Your orders
                  </p>
                  {ordersState !== "done" ? (
                    <p className="text-sm text-espresso/50">Loading…</p>
                  ) : orders.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-espresso/15 p-4 text-center text-sm text-espresso/50">
                      No orders yet — the oven awaits.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {orders.map((o) => (
                        <li key={o.id} className="rounded-2xl border border-espresso/10 bg-vanilla p-3 text-sm">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs text-espresso/50">{o.id.slice(-6)}</span>
                            <span className="rounded-full bg-espresso/5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-espresso/60">
                              {o.status}
                            </span>
                          </div>
                          <p className="mt-1.5 text-espresso/75">
                            {o.lines.map((l) => `${l.name} × ${l.qty}`).join(" · ")}
                          </p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-xs text-espresso/45">
                              {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                            <span className="font-display font-semibold text-terracotta">${o.total.toFixed(2)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    onClick={signOut}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-espresso/15 py-3 text-sm font-semibold text-espresso/70 transition-colors hover:border-terracotta hover:text-terracotta"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
