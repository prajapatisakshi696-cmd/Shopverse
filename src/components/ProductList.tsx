"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useGetProductsQuery } from "@/services/api";
import ProductCard from "./ProductCard";

const CATEGORIES = ["Electronics", "Fashion", "Home"];

export default function ProductList() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "newest";
  const page = Number(params.get("page") ?? 1);
  const [text, setText] = useState(search);

  const setParam = (updates: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!("page" in updates)) next.delete("page");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (text === search) return;
    const t = setTimeout(() => setParam({ search: text }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const { data, isLoading, isFetching, isError } = useGetProductsQuery({ search, category, sort, page });
  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  const pill = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      active ? "bg-indigo-600 text-white shadow" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
    }`;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <p className="mb-3 inline-block rounded-full bg-white/15 px-4 py-1 text-sm backdrop-blur">
            Free delivery on orders above ₹999
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Everything you need, delivered to your door.
          </h1>
          <p className="mt-4 max-w-xl text-indigo-100">
            Discover electronics, fashion and home essentials at prices you will love.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Search products..."
                className="input !pl-11"
              />
            </div>
            <select value={sort} onChange={(e) => setParam({ sort: e.target.value })} className="input sm:w-56">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => setParam({ category: "" })} className={pill(category === "")}>All</button>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setParam({ category: c })} className={pill(category === c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        )}

        {isError && (
          <p className="rounded-xl bg-red-50 p-4 text-red-600">Something went wrong. Please try again.</p>
        )}

        {data && data.products.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
            No products found. Try a different search or category.
          </div>
        )}

        <div className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}>
          {data?.products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button disabled={page <= 1} onClick={() => setParam({ page: String(page - 1) })} className="btn-outline">
              Previous
            </button>
            <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setParam({ page: String(page + 1) })} className="btn-outline">
              Next
            </button>
          </div>
        )}
      </main>
    </>
  );
}