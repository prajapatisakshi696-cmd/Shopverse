"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetProductQuery } from "@/services/api";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/features/cart/cartSlice";
import { formatPrice } from "@/components/ProductList";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { data: product, isLoading, isError } = useGetProductQuery(slug);

  if (isLoading) return <p className="p-6">Loading...</p>;

  if (isError || !product) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p className="mb-4 text-red-600">Product not found.</p>
        <Link href="/" className="underline">
          Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link href="/" className="mb-6 inline-block text-sm underline">
        ← Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.title}
          className="w-full rounded-lg object-cover"
        />

        <div>
          <p className="text-sm text-gray-500">{product.category}</p>
          <h1 className="mb-2 text-3xl font-bold">{product.title}</h1>
          <p className="mb-4 text-2xl">{formatPrice(product.price)}</p>
          <p className="mb-6 text-gray-700">{product.description}</p>
          <p className="mb-4 text-sm">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <button
            disabled={product.stock === 0}
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
            className="w-full rounded bg-black py-3 text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            Add to cart
          </button>
        </div>
      </div>
    </main>
  );
}