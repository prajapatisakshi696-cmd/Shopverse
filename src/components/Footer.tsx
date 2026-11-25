import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
         <Link href="/" className="flex items-center gap-2 text-xl font-bold">
  <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
    <ShoppingBag size={18} />
  </span>
  <span>
    Shop<span className="text-indigo-600">Verse</span>
  </span>
</Link>
          <p className="mt-3 text-sm text-slate-500">
            Electronics, fashion and home essentials at prices you will love.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Shop</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/?category=Electronics" className="hover:text-indigo-600">Electronics</Link></li>
            <li><Link href="/?category=Fashion" className="hover:text-indigo-600">Fashion</Link></li>
            <li><Link href="/?category=Home" className="hover:text-indigo-600">Home</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Account</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/login" className="hover:text-indigo-600">Login</Link></li>
            <li><Link href="/register" className="hover:text-indigo-600">Register</Link></li>
            <li><Link href="/account" className="hover:text-indigo-600">My Account</Link></li>
            <li><Link href="/cart" className="hover:text-indigo-600">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Support</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>Free delivery above ₹999</li>
            <li>7-day easy returns</li>
            <li>support@shopverse.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} ShopVerse. All rights reserved.</p>
          <p>Built with Next.js, TypeScript, Redux Toolkit and Prisma</p>
        </div>
      </div>
    </footer>
  );
}