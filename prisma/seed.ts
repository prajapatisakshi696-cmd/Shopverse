import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (name: string, bg: string) =>
  `https://placehold.co/600x400/${bg}/ffffff?text=${encodeURIComponent(name)}`;

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const raw = [
  // Electronics
  ["Wireless Headphones", "Noise cancelling over-ear headphones, 30 hour battery.", 299900, "Electronics", 25],
  ["Smart Watch", "Fitness tracking, heart rate and sleep monitoring.", 499900, "Electronics", 15],
  ["Bluetooth Speaker", "Portable waterproof speaker with deep bass.", 199900, "Electronics", 40],
  ["Mechanical Keyboard", "Hot-swappable keys with RGB backlight.", 349900, "Electronics", 20],
  ["Wireless Mouse", "Ergonomic mouse with silent clicks.", 79900, "Electronics", 60],
  ["Power Bank 20000mAh", "Fast charging power bank with dual USB ports.", 189900, "Electronics", 35],
  // Fashion
  ["Running Shoes", "Lightweight breathable shoes for daily running.", 249900, "Fashion", 40],
  ["Backpack", "Water resistant 25L backpack with laptop sleeve.", 129900, "Fashion", 30],
  ["Denim Jacket", "Classic fit denim jacket, all season wear.", 219900, "Fashion", 18],
  ["Cotton T-Shirt", "Soft 100% cotton regular fit t-shirt.", 59900, "Fashion", 100],
  ["Sunglasses", "UV400 polarized sunglasses with metal frame.", 99900, "Fashion", 45],
  ["Leather Wallet", "Slim genuine leather wallet with card slots.", 69900, "Fashion", 55],
  // Home
  ["Coffee Mug", "Ceramic mug, 350ml, dishwasher safe.", 39900, "Home", 100],
  ["Desk Lamp", "LED lamp with 3 brightness levels and USB charging.", 89900, "Home", 50],
  ["Cotton Bedsheet", "Double bed bedsheet with 2 pillow covers.", 119900, "Home", 28],
  ["Wall Clock", "Silent sweep minimalist wall clock.", 49900, "Home", 33],
  ["Water Bottle", "Insulated steel bottle, keeps cold for 24 hours.", 54900, "Home", 80],
  ["Scented Candle Set", "Set of 3 soy wax candles.", 74900, "Home", 22],
] as const;

const colors: Record<string, string> = {
  Electronics: "1e3a8a",
  Fashion: "9d174d",
  Home: "065f46",
};

const products = raw.map(([title, description, price, category, stock]) => ({
  title,
  slug: slugify(title),
  description,
  price,
  category,
  stock,
  image: `/products/${slugify(title)}.svg`,
}));

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log("Seeded", products.length, "products");

  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? "Admin@123",
    10
  );
  await prisma.user.upsert({
    where: { email: "admin@shopverse.com" },
    update: { name: "Store Admin" },
    create: {
      name: "Store Admin",
      email: "admin@shopverse.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin user ready");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());