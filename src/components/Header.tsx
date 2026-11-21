"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";

export default function Header() {
  const count = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-6">
        <Link href="/" className="text-2xl font-bold">
          ShopVerse
        </Link>
        <span className="rounded-full bg-black px-4 py-2 text-sm text-white">
          Cart: {count}
        </span>
      </div>
    </header>
  );
}