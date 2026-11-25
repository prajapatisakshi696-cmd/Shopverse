import { mkdirSync, writeFileSync } from "node:fs";

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const gradients = {
  Electronics: ["#4f46e5", "#06b6d4"],
  Fashion: ["#ec4899", "#f97316"],
  Home: ["#10b981", "#3b82f6"],
};

const items = [
  ["Wireless Headphones", "Electronics", "🎧"],
  ["Smart Watch", "Electronics", "⌚"],
  ["Bluetooth Speaker", "Electronics", "🔊"],
  ["Mechanical Keyboard", "Electronics", "⌨️"],
  ["Wireless Mouse", "Electronics", "🖱️"],
  ["Power Bank 20000mAh", "Electronics", "🔋"],
  ["Running Shoes", "Fashion", "👟"],
  ["Backpack", "Fashion", "🎒"],
  ["Denim Jacket", "Fashion", "🧥"],
  ["Cotton T-Shirt", "Fashion", "👕"],
  ["Sunglasses", "Fashion", "🕶️"],
  ["Leather Wallet", "Fashion", "👛"],
  ["Coffee Mug", "Home", "☕"],
  ["Desk Lamp", "Home", "💡"],
  ["Cotton Bedsheet", "Home", "🛏️"],
  ["Wall Clock", "Home", "🕰️"],
  ["Water Bottle", "Home", "🥤"],
  ["Scented Candle Set", "Home", "🕯️"],
];

mkdirSync("public/products", { recursive: true });

for (const [title, category, emoji] of items) {
  const [a, b] = gradients[category];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#g)"/>
  <circle cx="500" cy="60" r="120" fill="#fff" fill-opacity="0.12"/>
  <circle cx="80" cy="360" r="140" fill="#fff" fill-opacity="0.10"/>
  <circle cx="300" cy="185" r="115" fill="#fff" fill-opacity="0.18"/>
  <text x="300" y="228" font-size="140" text-anchor="middle" font-family="Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif">${emoji}</text>
  <text x="300" y="365" font-size="26" font-weight="700" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">${title}</text>
</svg>`;
  writeFileSync(`public/products/${slugify(title)}.svg`, svg);
}

console.log("Generated", items.length, "images");
