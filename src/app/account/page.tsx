import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

const statusStyle: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  PAID: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: { select: { title: true } } } } },
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">My Account</h1>
      <p className="mt-1 text-slate-500">{session.user.name} • {session.user.email}</p>

      <h2 className="mb-4 mt-10 text-xl font-semibold">Order history</h2>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
          You have not placed any orders yet.
          <div className="mt-4"><Link href="/" className="btn-primary">Start shopping</Link></div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-slate-500">
                    {order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <p className="font-mono text-xs text-slate-400">#{order.id.slice(-8)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <p className="mt-3 line-clamp-1 text-sm text-slate-600">
                {order.items.map((i) => `${i.product.title} × ${i.quantity}`).join(", ")}
              </p>
              <p className="mt-2 font-bold">{formatPrice(order.total)}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}