import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { productSchema } from "@/lib/validators";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { price, ...rest } = parsed.data;

  // unique slug: smart-watch, smart-watch-2, ...
  const base = slugify(rest.title);
  let slug = base;
  let n = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${base}-${++n}`;
  }

  const product = await prisma.product.create({
    data: { ...rest, slug, price: Math.round(price * 100) },
  });

  return NextResponse.json(product, { status: 201 });
}