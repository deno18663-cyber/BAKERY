# Oven & Artisan — Backend

Express API for the **Oven & Artisan** bakery website (the Next.js frontend lives in `../Content`).
No database server needed — data is stored in `data/db.json` (created + seeded on first run from the same catalog the frontend uses).

## Quick start

```bat
cd Backend
npm install
npm start
```

Then open `http://localhost:4000/api/health` — you should see `{ "ok": true, ... }`.

- `npm run dev` — auto-reloads on file changes (`node --watch`).
- Or double-click **`open-backend.bat`** to start it in a window.
- The frontend runs separately on `http://localhost:3000` (see `../Content`, started with `open-website.bat`).

Config (optional): copy `.env.example` → `.env`

| Var | Default | What it does |
|---|---|---|
| `PORT` | `4000` | Port the API listens on |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin(s), comma-separated |

## Endpoints

| Method | Path | Body / query | Description |
|---|---|---|---|
| GET | `/api/health` | — | Liveness check |
| GET | `/api/products?category=` | `pastries\|breads\|cakes\|gluten-free` | Product catalog |
| GET | `/api/products/:id` | — | One product |
| GET | `/api/menu?category=&search=` | filter + free-text search | Full menu |
| GET | `/api/menu/:id` | — | One menu item |
| GET | `/api/customizer` | — | Cake/box builder options + prices |
| POST | `/api/orders` | `{ items:[{id, qty, options?}], customer:{name, phone?}, note? }` | **Checkout** — totals computed server-side |
| POST | `/api/orders/custom` | cake: `{kind:'cake', base, frosting, toppings[], customer, message?}` · box: `{kind:'box', slots:[6 ids], customer, message?}` | Custom cake / bake-box order |
| GET | `/api/orders?limit=` | default 20, max 100 | List orders (newest first) |
| GET | `/api/orders/:id` | — | One order |
| PATCH | `/api/orders/:id/status` | `{status: pending\|ready\|completed\|cancelled}` | Update order status |
| GET/POST | `/api/reviews` | POST `{name, rating 1-5, text}` | Reviews carousel data |
| GET/POST | `/api/newsletter` (alias `/api/subscribe`) | POST `{email}` | "Proofing list" signup |
| GET | `/api/store-info/store` · `/hours` · `/schedule` | `/schedule?at=ISO` to override clock | Store info, hours, live bake phases |

`GET /api/store` and `GET /api/hours` also work as short aliases.

## Examples

```bash
# catalog
curl http://localhost:4000/api/products
curl "http://localhost:4000/api/menu?search=sourdough"

# checkout (price is looked up server-side; send ids + qty only)
curl -X POST http://localhost:4000/api/orders ^
  -H "Content-Type: application/json" ^
  -d "{\"items\":[{\"id\":\"croissant-signe\",\"qty\":2},{\"id\":\"sourdough-country\",\"qty\":1}],\"customer\":{\"name\":\"Maya\"}}"

# custom celebration cake
curl -X POST http://localhost:4000/api/orders/custom ^
  -H "Content-Type: application/json" ^
  -d "{\"kind\":\"cake\",\"base\":\"redvelvet\",\"frosting\":\"choc-ganache\",\"toppings\":[\"berries\",\"gold\"],\"customer\":{\"name\":\"Devon\"}}"

# bake box (exactly 6 slot ids from /api/customizer)
curl -X POST http://localhost:4000/api/orders/custom ^
  -H "Content-Type: application/json" ^
  -d "{\"kind\":\"box\",\"slots\":[\"box-croissant\",\"box-painchoc\",\"box-cinnamon\",\"box-banana\",\"box-brownie\",\"box-macaron\"],\"customer\":{\"name\":\"Office\"}}"

# review + newsletter
curl -X POST http://localhost:4000/api/reviews -H "Content-Type: application/json" -d "{\"name\":\"Sam\",\"rating\":5,\"text\":\"Best crust in town.\"}"
curl -X POST http://localhost:4000/api/newsletter -H "Content-Type: application/json" -d "{\"email\":\"you@example.com\"}"
```

## Connect the frontend

In `../Content`, create `.env.local` with:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

then `fetch(\`${process.env.NEXT_PUBLIC_API_URL}/api/products\`)` from any client component.
Suggested swaps: `CartDrawer` checkout → `POST /api/orders`, newsletter form → `POST /api/newsletter`, `ReviewsCarousel` → `GET /api/reviews`, bake schedule → `GET /api/store-info/schedule`.

## Staff order dashboard (locked)

Open `http://localhost:4000/admin` in a browser — you'll get a key prompt.
The key is `ADMIN_KEY` from `.env` (see `.env.example`). Bookmark
`http://localhost:4000/admin?key=YOUR_KEY`, or type it each visit.

Protected (need the key): the dashboard page, order listing, order status
changes, subscriber list. Public (customers need these): checkout, menu /
products, reviews, newsletter signup, store info. To rotate a leaked key,
change `ADMIN_KEY` and restart (Render: change the env var, it redeploys).

## Deploy for free (Render + Vercel)

Backend (this folder) → **Render** · Frontend (`../Content`) → **Vercel**.

1. Push this repo to GitHub.
2. Render Dashboard → New → **Blueprint** → select the repo (`render.yaml`
   is at the repo root). It creates a free web service with health check
   `/api/health`. Copy its URL, e.g. `https://oven-and-artisan-backend.onrender.com`.
3. Vercel → Add New → Project → select the repo, set **Root Directory** to
   `Content`, add env var `NEXT_PUBLIC_API_URL=<render-url>`, Deploy.
4. Back in Render → service → Environment → set
   `FRONTEND_URL=https://<your-site>.vercel.app` (allows the live site
   through CORS). It redeploys automatically.
5. In the same Environment screen add `ADMIN_KEY` = a long random string
   (generate: `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`).
   Without it the dashboard refuses to serve. Open
   `https://<your-service>.onrender.com/admin` and unlock with that key.

> ⚠️ Render's free tier sleeps after inactivity (first request takes ~1 min
> to wake) and its disk is **ephemeral** — orders reset when the service
> restarts. Fine for a demo; attach a free Postgres/persistent disk (or any
> paid tier) when you want orders to survive permanently.

## Reset the data

Stop the server, delete `data/db.json`, start again — it re-seeds from `src/seed.js`.
