/**
 * Oven & Artisan — shared content types.
 * Keep this file type-only: it exists so `tsc` catches mistakes in lib/content.ts.
 */

export type ProductCategory = "pastries" | "breads" | "cakes" | "gluten-free";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  desc: string;
  emoji: string;
  /** accent color used for hover cards / swatches */
  color: string;
  badge?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  desc: string;
  tags: string[];
  emoji: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number; // 1–5
  date: string;
  text: string;
  initials: string;
  color: string;
}

export interface DayHours {
  day: string;
  /** "HH:MM" 24h, or null when closed */
  open: string | null;
  close: string | null;
}

export interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  socials: {
    instagram: string;
    facebook: string;
    email: string;
  };
}

export interface StoryStep {
  number: string;
  title: string;
  body: string;
  icon: string;
}

export interface CustomizerChoice {
  id: string;
  label: string;
  /** hex used to recolor the 3D preview */
  color: string;
}

export interface ScheduleItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  /** minutes the batch spends in the oven */
  bakeMin: number;
  /** minutes the batch spends cooling before it's sellable */
  coolMin: number;
  /** minutes of idle time before the next batch starts */
  idleMin: number;
}

export interface HeroContent {
  eyebrow: string;
  headline: string[]; // one string per line → split-letter reveal
  sub: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

export interface NavLink {
  id: string;
  label: string;
}
