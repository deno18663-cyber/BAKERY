/**
 * Oven & Artisan — backend API client.
 *
 * Base URL comes from `NEXT_PUBLIC_API_URL` (see `.env.local`).
 * Every helper falls back gracefully: components keep working with the
 * static data in `lib/content.ts` when the backend isn't reachable.
 */

export const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = (await res.json().catch(() => null)) as T & { error?: string };
  if (!res.ok) {
    throw new ApiError(res.status, (data as { error?: string })?.error ?? `Request failed (${res.status})`);
  }
  return data as T;
}

/* ── Customer auth (passwordless: name + email + phone) ─── */

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

/** Sign in (or register) — returns a session token + customer. */
export function loginCustomer(name: string, email: string, phone: string): Promise<{ token: string; customer: Customer }> {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ name, email, phone }),
  });
}

/** Validate a stored token; throws ApiError(401) when expired. */
export function fetchMe(token: string): Promise<{ customer: Customer }> {
  return apiFetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** End the session server-side (local state is cleared by the caller). */
export function logoutCustomer(token: string): Promise<{ ok: boolean }> {
  return apiFetch("/api/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/* ── Orders (login required) ────────────────────────────── */

export interface OrderLineInput {
  id: string;
  qty: number;
  options?: string;
}

export interface OrderLine extends OrderLineInput {
  name: string;
  emoji: string;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  type: string;
  lines: OrderLine[];
  subtotal: number;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
}

/** Real checkout — login required. Totals are computed server-side
 *  from the catalog and the customer is taken from the session. */
export function createOrder(items: OrderLineInput[], token: string, note?: string): Promise<Order> {
  return apiFetch<Order>("/api/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ items, note }),
  });
}

/* ── Reviews ────────────────────────────────────────────── */

export interface ApiReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
  initials: string;
  color: string;
}

export function fetchReviews(): Promise<ApiReview[]> {
  return apiFetch<ApiReview[]>("/api/reviews");
}

/* ── Newsletter ─────────────────────────────────────────── */

/**
 * Newsletter signup. `company` is a honeypot — real users leave it empty;
 * bots that fill it get a fake success and are never subscribed.
 */
export function subscribeNewsletter(email: string, company = ""): Promise<{ ok: boolean; message: string }> {
  return apiFetch("/api/newsletter", {
    method: "POST",
    body: JSON.stringify({ email, company }),
  });
}

/* ── Schedule / store ───────────────────────────────────── */

export interface ScheduleStatus {
  phase: "oven" | "cooling" | "idle";
  label: string;
  minutesToNext: number;
  minutesUntilReady: number;
  cycleMin: number;
}

export interface ScheduleItemLive {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bakeMin: number;
  coolMin: number;
  idleMin: number;
  status: ScheduleStatus;
}

export interface ScheduleResponse {
  serverTime: string;
  open: { open: boolean; label: string; closesAt: string | null; opensAt: string | null };
  items: ScheduleItemLive[];
}

export function fetchSchedule(): Promise<ScheduleResponse> {
  return apiFetch<ScheduleResponse>("/api/store-info/schedule");
}
