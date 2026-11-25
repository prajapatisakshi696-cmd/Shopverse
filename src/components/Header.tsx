"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export default function Header() {
  const { data: session, status } = useSession();
  const count = useAppSelector((s) =>
    s.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
  <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
    <ShoppingBag size={18} />
  </span>
  <span>
    Shop<span className="text-indigo-600">Verse</span>
  </span>
</Link>

        <nav className="flex items-center gap-2 text-sm font-medium">
          {status === "authenticated" && (
            <>
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="hidden items-center gap-1 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 sm:flex">
                  <LayoutDashboard size={16} /> Admin
                </Link>
              )}
              <Link href="/account" className="flex items-center gap-1 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
                <User size={16} /> <span className="hidden sm:inline">{session.user.name}</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
          {status === "unauthenticated" && (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Login</Link>
              <Link href="/register" className="btn-primary !py-2">Sign up</Link>
            </>
          )}
          <Link href="/cart" className="relative ml-1 rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50" aria-label="Cart">
            <ShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}