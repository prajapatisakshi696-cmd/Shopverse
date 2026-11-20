"use client";

import { useGetProductsQuery } from "@/services/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/features/cart/cartSlice";

const formatPrice = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(paise / 100);

export default function Home() {
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const { data, isLoading, isError } = useGetProductsQuery({});

  return (
    <main className="mx-auto max-w-6xl p-6">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">ShopVerse</h1>
        <span className="rounded-full bg-black px-4 py-2 text-sm text-white">
          Cart: {cartCount}
        </span>
      </header>

      {isLoading && <p>Loading products...</p>}
      {isError && <p className="text-red-600">Something went wrong. Please try again.</p>}

      {data && data.products.length === 0 && (
        <p className="text-gray-500">No products yet. We will add some in the next step.</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.products.map((product) => (
          <div key={product.id} className="rounded-lg border p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.title}
              className="mb-3 h-48 w-full rounded object-cover"
            />
            <h2 className="font-semibold">{product.title}</h2>
            <p className="mb-3 text-gray-600">{formatPrice(product.price)}</p>
            <button
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
              className="w-full rounded bg-black py-2 text-white hover:bg-gray-800"
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}