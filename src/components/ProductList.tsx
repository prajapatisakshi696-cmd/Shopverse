"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useGetProductsQuery } from "@/services/api";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/features/cart/cartSlice";

const CATEGORIES = ["Electronics", "Fashion", "Home"];

export const formatPrice = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(paise / 100);

export default function ProductList() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const dispatch = useAppDispatch();

  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "newest";
  const page = Number(params.get("page") ?? 1);

  const [text, setText] = useState(search);

  const setParam = (updates: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!("page" in updates)) next.delete("page");
    router.replace(`${pathname}?${next.toString()}`);
  };

  // debounce search so we don't hit the API on every keystroke
  useEffect(() => {
    if (text === search) return;
    const t = setTimeout(() => setParam({ search: text }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const { data, isLoading, isFetching, isError } = useGetProductsQuery({
    search, category, sort, page,
  });

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search products..."
          className="flex-1 rounded border px-3 py-2"
        />
        <select
          value={category}
          onChange={(e) => setParam({ category: e.target.value })}
          className="rounded border px-3 py-2"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={sort}
          onChange={(e) => setParam({ sort: e.target.value })}
          className="rounded border px-3 py-2"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      )}

      {isError && <p className="text-red-600">Something went wrong. Please try again.</p>}

      {data && data.products.length === 0 && (
        <p className="text-gray-500">No products found.</p>
      )}

      <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}>
        {data?.products.map((p) => (
          <div key={p.id} className="rounded-lg border p-4">
            <Link href={`/products/${p.slug}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.title} className="mb-3 h-48 w-full rounded object-cover" />
              <h2 className="font-semibold">{p.title}</h2>
            </Link>
            <p className="mb-3 text-gray-600">{formatPrice(p.price)}</p>
            <button
              disabled={p.stock === 0}
              onClick={() =>
                dispatch(addToCart({ id: p.id, title: p.title, price: p.price, image: p.image }))
              }
              className="w-full rounded bg-black py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {p.stock === 0 ? "Out of stock" : "Add to cart"}
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setParam({ page: String(page - 1) })}
            className="rounded border px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setParam({ page: String(page + 1) })}
            className="rounded border px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}