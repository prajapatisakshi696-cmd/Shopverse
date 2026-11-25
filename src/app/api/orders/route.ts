import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validators";
import { calcShipping } from "@/lib/pricing";

class StockError extends Error {}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please login to place an order" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  // merge duplicate product ids
  const qtyById = new Map<string, number>();
  for (const item of parsed.data.items) {
    qtyById.set(item.id, (qtyById.get(item.id) ?? 0) + item.quantity);
  }
  const ids = [...qtyById.keys()];

  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  if (products.length !== ids.length) {
    return NextResponse.json({ error: "Some products are no longer available" }, { status: 400 });
  }

  // price comes from DB, never from the client
  const lines = products.map((p) => ({
    productId: p.id,
    title: p.title,
    price: p.price,
    quantity: qtyById.get(p.id)!,
  }));
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const total = subtotal + calcShipping(subtotal);

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const line of lines) {
        // only decrements if enough stock is left, so stock can never go negative
        const res = await tx.product.updateMany({
          where: { id: line.productId, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity } },
        });
        if (res.count === 0) throw new StockError(`Not enough stock for ${line.title}`);
      }

      return tx.order.create({
        data: {
          userId: session.user.id,
          total,
          shippingAddress: parsed.data.shipping,
          items: {
            create: lines.map((l) => ({
              productId: l.productId,
              quantity: l.quantity,
              price: l.price,
            })),
          },
        },
      });
    });

    return NextResponse.json({ id: order.id }, { status: 201 });
  } catch (e) {
    if (e instanceof StockError) {
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Could not place order" }, { status: 500 });
  }
}