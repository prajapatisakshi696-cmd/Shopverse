"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeFromCart, updateQuantity } from "@/features/cart/cartSlice";
import { formatPrice } from "@/lib/format";
import { calcShipping, FREE_SHIPPING_ABOVE } from "@/lib/pricing";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-indigo-50 text-indigo-600">
          <ShoppingBag size={28} />
        </div>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Looks like you have not added anything yet.</p>
        <Link href="/" className="btn-primary mt-6">Start shopping</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <h2 className="font-semibold">{item.title}</h2>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-slate-400 hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200">
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                      disabled={item.quantity <= 1}
                      className="p-2 disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.min(10, item.quantity + 1) }))}
                      disabled={item.quantity >= 10}
                      className="p-2 disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="rounded-lg bg-indigo-50 p-2 text-xs text-indigo-700">
                Add {formatPrice(FREE_SHIPPING_ABOVE - subtotal)} more for free delivery
              </p>
            )}
            <div className="flex justify-between border-t pt-3 text-base font-bold">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full">Proceed to checkout</Link>
          <Link href="/" className="btn-outline mt-3 w-full">Continue shopping</Link>
        </aside>
      </div>
    </main>
  );
}