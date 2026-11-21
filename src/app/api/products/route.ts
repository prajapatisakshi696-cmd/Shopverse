import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const LIMIT = 12;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? undefined;
  const sort = searchParams.get("sort") ?? "newest";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  const where: Prisma.ProductWhereInput = {
    title: { contains: search, mode: "insensitive" },
    ...(category && { category }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc" ? { price: "asc" }
    : sort === "price_desc" ? { price: "desc" }
    : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip: (page - 1) * LIMIT, take: LIMIT }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, limit: LIMIT });
}