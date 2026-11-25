"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/features/cart/cartSlice";
import type { Product } from "@/services/api";
import { formatPrice } from "@/lib/format";
import { motion } from "framer-motion";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);
  const out = product.stock === 0;

  const handleAdd = () => {
    dispatch(addToCart({ id: product.id, title: product.title, price: product.price, image: product.image }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
       initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-40px" }}
  transition={{ duration: 0.4 }}
  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
>
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.title}
          className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur">
          {product.category}
        </span>
        {out && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 font-semibold hover:text-indigo-600">{product.title}</h3>
        </Link>
        <p className="mt-1 line-clamp-2 h-10 text-sm text-slate-500">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          <motion.button
          whileTap={{ scale: 0.92 }}
            onClick={handleAdd}
            disabled={out}
            className="btn-primary !px-4 !py-2"
          >
            {added ? <><Check size={16} /> Added</> : <><ShoppingCart size={16} /> Add</>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}