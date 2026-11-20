import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? undefined;
  const page = Number(searchParams.get("page") ?? 1);
  const limit = 12;

  const where = {
    title: { contains: search, mode: "insensitive" as const },
    ...(category && { category }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total });
}