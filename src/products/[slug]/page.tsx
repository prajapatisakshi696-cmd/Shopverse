"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ShoppingCart, Truck, ShieldCheck } from "lucide-react";
import { useGetProductQuery } from "@/services/api";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/features/cart/cartSlice";
import { formatPrice } from "@/lib/format";
export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { data: product, isLoading, isError } = useGetProductQuery(slug);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
          <div className="space-y-4">
            <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-24 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="mb-4 text-red-600">Product not found.</p>
        <Link href="/" className="btn-outline">
          Back to products
        </Link>
      </main>
    );
  }

  const out = product.stock === 0;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft size={16} /> Back to products
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            {product.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold">{product.title}</h1>
          <p className="mt-3 text-3xl font-extrabold text-indigo-600">
            {formatPrice(product.price)}
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            {product.description}
          </p>

          <p
            className={`mt-4 text-sm font-medium ${
              out
                ? "text-red-600"
                : product.stock < 10
                ? "text-amber-600"
                : "text-emerald-600"
            }`}
          >
            {out
              ? "Out of stock"
              : product.stock < 10
              ? `Only ${product.stock} left`
              : "In stock"}
          </p>

          <button
            disabled={out}
            onClick={() =>
              dispatch(
                addToCart({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                })
              )
            }
            className="btn-primary mt-6 w-full !py-3.5 text-base"
          >
            <ShoppingCart size={18} /> Add to cart
          </button>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
              <Truck size={18} className="text-indigo-600" /> Free delivery
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
              <ShieldCheck size={18} className="text-indigo-600" /> 7-day returns
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}