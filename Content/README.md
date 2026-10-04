# Oven & Artisan — Bakery Website

A world-class, fully interactive single-page bakery site: procedural 3D pastries,
smooth (Lenis) scroll, scroll-driven 3D, a live "Build-Your-Own" customizer, a
bake schedule, and a slide-over cart.

## Run it

**Easy way (double-click):** run `open-website.bat` → the site opens in your
browser at http://localhost:3000.

**Developer way:**

```
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run check      # lint + typecheck + build in one go
```

## Edit your content

All text, menu items, prices, reviews, hours, address, and the bake schedule
live in **one file**: `lib/content.ts`. Change it and the whole site updates.

## The 3D experience

The hero croissant and the cake/box in the customizer are generated
procedurally — no model files to download. If a device has WebGL disabled or
is very low-powered, the site automatically shows beautiful 2D/SVG artwork
instead. You can force the 2D version with `?force2d=1` on the URL.

## Project layout

- `app/` — page, layout, fonts, design tokens (`globals.css`)
- `components/sections/` — one component per page section
- `components/three/` — the WebGL scene, models, and 2D fallbacks
- `components/ui/` — reusable motion/Cart UI
- `lib/` — content, stores, bakery-schedule, scroll state, confetti
