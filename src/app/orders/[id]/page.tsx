import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

type ShippingAddress = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: {
      items: {
        include: { product: { select: { title: true, image: true } } },
      },
    },
  });
  if (!order) notFound();

  const address = order.shippingAddress as unknown as ShippingAddress;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 text-center">
        <CheckCircle2 size={56} className="mx-auto text-emerald-500" />
        <h1 className="mt-4 text-3xl font-bold">Order placed!</h1>
        <p className="mt-2 text-slate-500">Order ID: {order.id}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <ul className="divide-y">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.product.image}
                alt={item.product.title}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{item.product.title}</p>
                <p className="text-sm text-slate-500">Qty {item.quantity}</p>
              </div>
              <span className="font-semibold">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
          <span>Total paid (COD)</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm">
        <h2 className="mb-2 font-semibold">Delivering to</h2>
        <p>
          {address.fullName} • {address.phone}
        </p>
        <p className="text-slate-500">
          {address.address}, {address.city} - {address.pincode}
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/account" className="btn-outline">
          View all orders
        </Link>
        <Link href="/" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    </main>
  );
}