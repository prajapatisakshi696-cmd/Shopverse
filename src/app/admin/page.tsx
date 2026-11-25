import Link from "next/link";
import { Package, ShoppingBag, Users, IndianRupee, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function AdminPage() {
  const [products, orders, users, revenue, lowStock] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.product.count({ where: { stock: { lt: 10 } } }),
  ]);

  const stats = [
    { label: "Products", value: products, icon: Package },
    { label: "Orders", value: orders, icon: ShoppingBag },
    { label: "Customers", value: users, icon: Users },
    { label: "Revenue", value: formatPrice(revenue._sum.total ?? 0), icon: IndianRupee },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon size={20} />
            </div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {lowStock > 0 && (
        <p className="mt-6 flex items-center gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
          <AlertTriangle size={16} /> {lowStock} product(s) have less than 10 items in stock.
        </p>
      )}

      <div className="mt-8 flex gap-3">
        <Link href="/admin/products" className="btn-primary">Manage products</Link>
        <Link href="/admin/orders" className="btn-outline">Manage orders</Link>
      </div>
    </main>
  );
}