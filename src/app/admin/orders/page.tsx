import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { title: true } } } },
    },
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Orders</h1>

      {orders.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-500">
          No orders yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="p-4">
                    <p className="font-mono text-xs">#{o.id.slice(-8)}</p>
                    <p className="text-xs text-slate-500">
                      {o.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{o.user.name}</p>
                    <p className="text-xs text-slate-500">{o.user.email}</p>
                  </td>
                  <td className="max-w-xs p-4 text-slate-600">
                    {o.items.map((i) => `${i.product.title} × ${i.quantity}`).join(", ")}
                  </td>
                  <td className="p-4 font-semibold">{formatPrice(o.total)}</td>
                  <td className="p-4">
                    <OrderStatusSelect id={o.id} status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}