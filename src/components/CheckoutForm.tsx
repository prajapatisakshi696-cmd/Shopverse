"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutInput } from "@/lib/validators";
import { useCreateOrderMutation } from "@/services/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/features/cart/cartSlice";
import { formatPrice } from "@/lib/format";
import { calcShipping } from "@/lib/pricing";

export default function CheckoutForm({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fullName: defaultName },
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;

  const onSubmit = async (shippingData: CheckoutInput) => {
    setError("");
    try {
      const res = await createOrder({
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        shipping: shippingData,
      }).unwrap();
      dispatch(clearCart());
      router.push(`/orders/${res.id}`);
    } catch (e) {
      const err = e as { data?: { error?: string } };
      setError(err.data?.error ?? "Something went wrong. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-slate-500">Your cart is empty.</p>
        <Link href="/" className="btn-primary mt-6">Browse products</Link>
      </main>
    );
  }

  const field = (name: keyof CheckoutInput, placeholder: string) => (
    <div>
      <input {...register(name)} placeholder={placeholder} className="input" />
      {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Shipping details</h2>
          {field("fullName", "Full name")}
          {field("phone", "Mobile number")}
          {field("address", "Address")}
          <div className="grid gap-4 sm:grid-cols-2">
            {field("city", "City")}
            {field("pincode", "Pincode")}
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            Payment: <strong>Cash on Delivery</strong>
          </div>

          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

          <button disabled={isLoading} className="btn-primary w-full !py-3">
            {isLoading ? "Placing order..." : `Place order • ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Your items</h2>
          <ul className="space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-2">
                <span className="line-clamp-1">{i.title} × {i.quantity}</span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
            <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
        </aside>
      </div>
    </main>
  );
}