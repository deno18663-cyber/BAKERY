"use strict";

/**
 * Seed data — mirrors the frontend's Content/lib/content.ts
 * so the site and the API start with identical catalogs.
 * Edit prices/items here; the frontend keeps reading its own
 * copy until you wire it to fetch from this API (see README).
 */

const PRODUCTS = [
  { id: "croissant-signe", name: "Signé Croissant", category: "pastries", price: 4.5, desc: "72-layer laminated butter croissant, crisp shell, honeycomb crumb.", emoji: "🥐", color: "#E09F3E", badge: "Bestseller" },
  { id: "pain-choc", name: "Pain au Chocolat", category: "pastries", price: 5, desc: "Dark Valrhona batons tucked into feathery laminated dough.", emoji: "🍫", color: "#9E2A2B" },
  { id: "sourdough-country", name: "Country Sourdough", category: "breads", price: 9, desc: "48-hour fermented, dark blistered crust, custardy open crumb.", emoji: "🍞", color: "#C98A4B", badge: "Signature" },
  { id: "baguette-sesame", name: "Sesame Baguette", category: "breads", price: 6.5, desc: "Golden sesame-crusted batard with a shattering crackle.", emoji: "🥖", color: "#889681" },
  { id: "rye-molasses", name: "Rye & Molasses", category: "breads", price: 8.5, desc: "Dark, dense, softly sweet — perfect with smoked cheese.", emoji: "🍂", color: "#540B0E" },
  { id: "cake-terracotta", name: "Terracotta Chocolate Cake", category: "cakes", price: 48, desc: "Molten-centre chocolate cake, baked-to-order. Feeds 8.", emoji: "🎂", color: "#9E2A2B", badge: "Order ahead" },
  { id: "cake-vanilla", name: "Vanilla Celebration Cake", category: "cakes", price: 45, desc: "Vanilla bean sponge, silky buttercream, customised to you.", emoji: "🍰", color: "#FFF8F0" },
  { id: "gf-banana", name: "Gluten-Free Banana Loaf", category: "gluten-free", price: 7.5, desc: "Buckwheat & oat flour, dark banana, toasted walnuts.", emoji: "🍌", color: "#889681" },
  { id: "gf-buckwheat", name: "Buckwheat Morning Muffin", category: "gluten-free", price: 4, desc: "Naturally gluten-free, studded with blueberry and lemon zest.", emoji: "🧁", color: "#E09F3E" },
];

const MENU = [
  { id: "m-croissant", name: "Signé Croissant", category: "pastries", price: 4.5, desc: "72-layer laminated butter croissant.", tags: ["laminated", "butter"], emoji: "🥐" },
  { id: "m-pain-choc", name: "Pain au Chocolat", category: "pastries", price: 5, desc: "Valrhona dark chocolate batons.", tags: ["chocolate", "laminated"], emoji: "🍫" },
  { id: "m-kouign", name: "Kouign-amann", category: "pastries", price: 5.5, desc: "Caramelised Breton pastry, salty-sweet shatter.", tags: ["caramel", "flaky"], emoji: "🧈" },
  { id: "m-sourdough", name: "Country Sourdough", category: "breads", price: 9, desc: "48-hour fermented, dark crust.", tags: ["sourdough", "stone-milled"], emoji: "🍞" },
  { id: "m-baguette", name: "Sesame Baguette", category: "breads", price: 6.5, desc: "Golden sesame-crusted batard.", tags: ["sesame", "crusty"], emoji: "🥖" },
  { id: "m-rye", name: "Rye & Molasses", category: "breads", price: 8.5, desc: "Dark, dense, softly sweet.", tags: ["rye", "molasses"], emoji: "🍂" },
  { id: "m-cake-choc", name: "Terracotta Chocolate Cake", category: "cakes", price: 48, desc: "Molten-centre, baked-to-order.", tags: ["baked-to-order", "chocolate"], emoji: "🎂" },
  { id: "m-cake-van", name: "Vanilla Celebration Cake", category: "cakes", price: 45, desc: "Vanilla bean sponge, buttercream.", tags: ["customisable", "celebrations"], emoji: "🍰" },
  { id: "m-cake-red", name: "Red Velvet Layer Cake", category: "cakes", price: 50, desc: "Three layers, velvet crumb, cream cheese.", tags: ["red velvet", "layer"], emoji: "❤️" },
  { id: "m-gf-banana", name: "GF Banana Loaf", category: "gluten-free", price: 7.5, desc: "Buckwheat & oat flour, walnuts.", tags: ["banana", "walnut"], emoji: "🍌" },
  { id: "m-gf-muffin", name: "Buckwheat Morning Muffin", category: "gluten-free", price: 4, desc: "Blueberry and lemon zest.", tags: ["blueberry", "lemon"], emoji: "🧁" },
  { id: "m-gf-cookie", name: "GF Brown Butter Cookie", category: "gluten-free", price: 4.5, desc: "Sea-salt, brown butter, toasty edges.", tags: ["brown butter", "sea salt"], emoji: "🍪" },
];

const CUSTOMIZER = {
  bases: [
    { id: "vanilla", label: "Vanilla Sponge", color: "#F5E7D0" },
    { id: "chocolate", label: "Chocolate Sponge", color: "#6B3A2A" },
    { id: "redvelvet", label: "Red Velvet", color: "#8C2431" },
    { id: "carrot", label: "Carrot & Walnut", color: "#C98A4B" },
  ],
  frostings: [
    { id: "vanilla-buttercream", label: "Vanilla Buttercream", color: "#FFF8F0" },
    { id: "choc-ganache", label: "Chocolate Ganache", color: "#4A2C22" },
    { id: "strawberry", label: "Strawberry Cream", color: "#E8A0A0" },
    { id: "matcha", label: "Matcha Cream", color: "#889681" },
  ],
  toppings: [
    { id: "berries", label: "Fresh Berries", color: "#9E2A2B" },
    { id: "shavings", label: "Shaved Chocolate", color: "#3A2418" },
    { id: "caramel", label: "Caramel Drizzle", color: "#C98A4B" },
    { id: "pistachio", label: "Pistachio Crumble", color: "#7A8B5A" },
    { id: "gold", label: "Gold Leaf", color: "#E09F3E" },
    { id: "flowers", label: "Edible Flowers", color: "#E8A0A0" },
  ],
  boxSlots: [
    { id: "box-croissant", name: "Mini Signé Croissant", category: "pastries", price: 3, desc: "A palm-sized laminated croissant.", emoji: "🥐", color: "#E09F3E" },
    { id: "box-painchoc", name: "Mini Pain au Chocolat", category: "pastries", price: 3.5, desc: "Pocket-size, dark chocolate core.", emoji: "🍫", color: "#9E2A2B" },
    { id: "box-cinnamon", name: "Cinnamon Roll", category: "pastries", price: 4, desc: "Soft, spiced, cream-cheese glazed.", emoji: "🍥", color: "#C98A4B" },
    { id: "box-banana", name: "Banana Loaf Slice", category: "gluten-free", price: 3.5, desc: "Thick slice, toasted walnuts.", emoji: "🍌", color: "#889681" },
    { id: "box-brownie", name: "Dark Brownie", category: "cakes", price: 3.5, desc: "Fudgy, molten centre.", emoji: "🍫", color: "#540B0E" },
    { id: "box-macaron", name: "Vanilla Macaron", category: "gluten-free", price: 3, desc: "Crisp shell, silk centre.", emoji: "🍬", color: "#FFF8F0" },
  ],
  boxPrice: 24,
  customCakePrice: 54,
};

const REVIEWS = [
  { id: "r1", name: "Maya Lindqvist", rating: 5, date: "2 days ago", text: "The Signé croissant is a genuinely religious experience. Flaky, buttery, and the lamination is flawless.", initials: "ML", color: "#E09F3E" },
  { id: "r2", name: "Devon Okafor", rating: 5, date: "1 week ago", text: "Ordered a custom red velvet for my daughter's birthday — they matched the exact colour I sent. Unreal.", initials: "DO", color: "#9E2A2B" },
  { id: "r3", name: "Sofia Reyes", rating: 5, date: "2 weeks ago", text: "Their sourdough ruined every other bakery for me. That crust crackle. That open crumb. 10/10.", initials: "SR", color: "#889681" },
  { id: "r4", name: "James Whitfield", rating: 4, date: "3 weeks ago", text: "The Build-a-Box is genius — my office Friday box was the highlight of the week. Slightly expensive, worth it.", initials: "JW", color: "#540B0E" },
  { id: "r5", name: "Aisha Bello", rating: 5, date: "1 month ago", text: "Gluten-free banana loaf that tastes like the real thing. My Celiac daughter cried. Happy tears!", initials: "AB", color: "#C98A4B" },
  { id: "r6", name: "Tom & Ruth Nguyen", rating: 5, date: "1 month ago", text: "We ordered the Terracotta Chocolate Cake for our anniversary. Molten in the middle, gone in ten minutes.", initials: "TN", color: "#E09F3E" },
];

const HOURS = [
  { day: "Monday", open: "07:00", close: "19:00" },
  { day: "Tuesday", open: "07:00", close: "19:00" },
  { day: "Wednesday", open: "07:00", close: "19:00" },
  { day: "Thursday", open: "07:00", close: "19:00" },
  { day: "Friday", open: "07:00", close: "19:00" },
  { day: "Saturday", open: "08:00", close: "18:00" },
  { day: "Sunday", open: "08:00", close: "15:00" },
];

const STORE = {
  name: "Oven & Artisan · Mill Street",
  address: "14 Mill Street, Old Town District",
  phone: "+1 (555) 014-7766",
  lat: 40.7128,
  lng: -74.006,
  socials: {
    instagram: "https://instagram.com/ovenandartisan",
    facebook: "https://facebook.com/ovenandartisan",
    email: "hello@ovenandartisan.com",
  },
};

const SCHEDULE = [
  { id: "sourdough", name: "Country Sourdough", emoji: "🍞", color: "#C98A4B", bakeMin: 45, coolMin: 30, idleMin: 60 },
  { id: "croissant", name: "Butter Croissants", emoji: "🥐", color: "#E09F3E", bakeMin: 18, coolMin: 10, idleMin: 22 },
  { id: "bagels", name: "Stone Bagels", emoji: "🥯", color: "#889681", bakeMin: 20, coolMin: 12, idleMin: 28 },
  { id: "focaccia", name: "Rosemary Focaccia", emoji: "🫓", color: "#E8C99A", bakeMin: 25, coolMin: 15, idleMin: 50 },
  { id: "rye", name: "Rye & Molasses", emoji: "🍂", color: "#540B0E", bakeMin: 50, coolMin: 25, idleMin: 75 },
  { id: "baguette", name: "Sesame Baguette", emoji: "🥖", color: "#D9A441", bakeMin: 22, coolMin: 10, idleMin: 28 },
];

function buildInitialDb() {
  return {
    version: 1,
    products: PRODUCTS,
    menu: MENU,
    customizer: CUSTOMIZER,
    reviews: REVIEWS,
    hours: HOURS,
    store: STORE,
    schedule: SCHEDULE,
    orders: [],
    subscribers: [],
  };
}

module.exports = { buildInitialDb, PRODUCTS, MENU, CUSTOMIZER, REVIEWS, HOURS, STORE, SCHEDULE };
