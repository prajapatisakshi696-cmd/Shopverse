"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    badge: "New arrivals",
    title: "Next-gen gadgets for everyday life",
    text: "Headphones, smart watches and more, with fast delivery.",
    cta: "Shop Electronics",
    href: "/?category=Electronics#products",
    emoji: "🎧",
    bg: "from-indigo-700 via-indigo-600 to-cyan-500",
  },
  {
    badge: "Trending now",
    title: "Style that fits your day",
    text: "Shoes, jackets and accessories at honest prices.",
    cta: "Shop Fashion",
    href: "/?category=Fashion#products",
    emoji: "👟",
    bg: "from-pink-600 via-rose-500 to-orange-400",
  },
  {
    badge: "Free delivery above ₹999",
    title: "Make your home feel special",
    text: "Lamps, candles and everyday essentials for every room.",
    cta: "Shop Home",
    href: "/?category=Home#products",
    emoji: "🕯️",
    bg: "from-emerald-600 via-teal-500 to-blue-500",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [paused, go]);

  const slide = slides[index];

  return (
    <section
      className="relative h-[460px] overflow-hidden text-white sm:h-[520px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-8 px-6">
            <div className="max-w-xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur"
              >
                {slide.badge}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-4 text-lg text-white/85"
              >
                {slide.text}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-8 flex gap-3"
              >
                <Link
                  href={slide.href}
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-105"
                >
                  {slide.cta}
                </Link>
                <Link
                  href="/#products"
                  className="rounded-xl border border-white/50 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
                >
                  All products
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
              className="hidden md:block"
            >
              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="grid h-72 w-72 place-items-center rounded-full bg-white/15 text-[9rem] backdrop-blur"
              >
                {slide.emoji}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur transition hover:bg-white/40"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur transition hover:bg-white/40"
      >
        <ChevronRight />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}