import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/header/Header";
import SmoothScroll from "@/components/smooth/SmoothScroll";
import CustomCursor from "@/components/cursor/CustomCursor";
import CartDrawer from "@/components/ui/CartDrawer";
import CapabilitiesProvider from "@/components/providers/CapabilitiesProvider";
import BakeryProvider from "@/components/providers/BakeryProvider";
import { STORE } from "@/lib/content";
import { GA_ID, SITE_URL } from "@/lib/site";

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

const DESCRIPTION =
  "An artisanal bakery crafting sourdough, croissants, and custom celebration cakes — slow-fermented for 48 hours, hand-shaped, and baked fresh all day.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Oven & Artisan — Slow-baked, never mass-produced",
    template: "%s · Oven & Artisan",
  },
  description: DESCRIPTION,
  keywords: ["artisan bakery", "sourdough", "croissant", "custom cakes", "bake box", "Oven and Artisan"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Oven & Artisan — Slow-baked, never mass-produced",
    description: "Sourdough, croissants & custom celebration cakes. Slow-baked, never mass-produced.",
    url: "/",
    siteName: "Oven & Artisan",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Oven & Artisan — slow-baked, never mass-produced. Sourdough, croissants, celebration cakes.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oven & Artisan — Slow-baked, never mass-produced",
    description: "Sourdough, croissants & custom celebration cakes. Baked fresh all day.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

/** Structured data so search engines understand the business listing. */
const BAKERY_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Oven & Artisan",
  slogan: "Slow-baked, never mass-produced",
  description: DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    streetAddress: STORE.address,
  },
  telephone: STORE.phone,
  servesCuisine: ["Bakery", "Sourdough", "Pastries", "Cakes"],
  priceRange: "$",
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jakarta.variable}`}>
        <script type="application/ld+json">{JSON.stringify(BAKERY_SCHEMA)}</script>
        {GA_ID !== "" && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
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
