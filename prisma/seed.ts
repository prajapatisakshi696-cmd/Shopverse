import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  { title: "Wireless Headphones", slug: "wireless-headphones", description: "Noise cancelling over-ear headphones with 30 hour battery.", price: 299900, image: "https://picsum.photos/seed/headphones/600/400", category: "Electronics", stock: 25 },
  { title: "Smart Watch", slug: "smart-watch", description: "Fitness tracking, heart rate and sleep monitoring.", price: 499900, image: "https://picsum.photos/seed/watch/600/400", category: "Electronics", stock: 15 },
  { title: "Running Shoes", slug: "running-shoes", description: "Lightweight breathable shoes for daily running.", price: 249900, image: "https://picsum.photos/seed/shoes/600/400", category: "Fashion", stock: 40 },
  { title: "Backpack", slug: "backpack", description: "Water resistant 25L backpack with laptop sleeve.", price: 129900, image: "https://picsum.photos/seed/backpack/600/400", category: "Fashion", stock: 30 },
  { title: "Coffee Mug", slug: "coffee-mug", description: "Ceramic mug, 350ml, dishwasher safe.", price: 39900, image: "https://picsum.photos/seed/mug/600/400", category: "Home", stock: 100 },
  { title: "Desk Lamp", slug: "desk-lamp", description: "LED lamp with 3 brightness levels and USB charging.", price: 89900, image: "https://picsum.photos/seed/lamp/600/400", category: "Home", stock: 50 },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log("Seeded", products.length, "products");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());