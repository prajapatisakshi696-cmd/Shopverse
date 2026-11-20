import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  { title: "Wireless Headphones", 
    slug: "wireless-headphones", 
    description: "Noise cancelling over-ear headphones with 30 hour battery.", 
    price: 299900, 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    category: "Electronics", stock: 25 },
  { title: "Smart Watch", 
    slug: "smart-watch", 
    description: "Fitness tracking, heart rate and sleep monitoring.", 
    price: 499900, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", 
    category: "Electronics", stock: 15 },
  { title: "Running Shoes", 
    slug: "running-shoes", 
    description: "Lightweight breathable shoes for daily running.", 
    price: 249900, 
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80", 
    category: "Fashion", stock: 40 },
  { title: "Backpack", 
    slug: "backpack", 
    description: "Water resistant 25L backpack with laptop sleeve.", 
    price: 129900, 
    image: "https://images.unsplash.com/photo-1553877520-8d09475a492f?w=600&q=80", 
    category: "Fashion", stock: 30 },
  { title: "Coffee Mug", 
    slug: "coffee-mug", 
    description: "Ceramic mug, 350ml, dishwasher safe.", 
    price: 39900, 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", 
    category: "Home", stock: 100 },
  { title: "Desk Lamp", 
    slug: "desk-lamp", 
    description: "LED lamp with 3 brightness levels and USB charging.", 
    price: 89900, 
image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",    category: "Home", stock: 50 },
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