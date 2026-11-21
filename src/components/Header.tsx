"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useAppSelector } from "@/store/hooks";

export default function Header() {
  const { data: session, status } = useSession();
  const count = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-6">
        <Link href="/" className="text-2xl font-bold">ShopVerse</Link>

        <nav className="flex items-center gap-4 text-sm">
          {status === "authenticated" ? (
            <>
              {session.user.role === "ADMIN" && <Link href="/admin" className="underline">Admin</Link>}
              <Link href="/account" className="underline">{session.user.name}</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="underline">Logout</button>
            </>
          ) : status === "unauthenticated" ? (
            <>
              <Link href="/login" className="underline">Login</Link>
              <Link href="/register" className="underline">Register</Link>
            </>
          ) : null}
          <span className="rounded-full bg-black px-4 py-2 text-white">Cart: {count}</span>
        </nav>
      </div>
    </header>
  );
}