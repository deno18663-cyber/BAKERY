import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import SmoothScroll from "@/components/smooth/SmoothScroll";
import CustomCursor from "@/components/cursor/CustomCursor";
import CartDrawer from "@/components/ui/CartDrawer";
import CapabilitiesProvider from "@/components/providers/CapabilitiesProvider";
import BakeryProvider from "@/components/providers/BakeryProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ovenandartisan.com"),
  title: {
    default: "Oven & Artisan — Slow-baked, never mass-produced",
    template: "%s · Oven & Artisan",
  },
  description:
    "An artisanal bakery crafting sourdough, croissants, and custom celebration cakes — slow-fermented for 48 hours, hand-shaped, and baked fresh all day.",
  keywords: ["artisan bakery", "sourdough", "croissant", "custom cakes", "bake box", "Oven and Artisan"],
  openGraph: {
    title: "Oven & Artisan",
    description: "Slow-baked, never mass-produced. Sourdough, croissants & custom celebration cakes.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jakarta.variable}`}>
        <SmoothScroll />
        <CapabilitiesProvider />
        <BakeryProvider />
        <CustomCursor />
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-cream" />
        <Header />
        <CartDrawer />
        <main className="relative z-20">{children}</main>
      </body>
    </html>
  );
}
