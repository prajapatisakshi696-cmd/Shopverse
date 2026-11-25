import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus size={16} /> Add product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.title} className="h-10 w-10 rounded-lg object-cover" />
                    <span className="font-medium">{p.title}</span>
                  </div>
                </td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">{formatPrice(p.price)}</td>
                <td className={`p-4 font-medium ${p.stock < 10 ? "text-amber-600" : ""}`}>{p.stock}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
                      aria-label={`Edit ${p.title}`}
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteProductButton id={p.id} title={p.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}