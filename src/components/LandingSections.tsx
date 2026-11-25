import Link from "next/link";
import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";
import Reveal from "./Reveal";

const categories = [
  { name: "Electronics", emoji: "🎧", bg: "from-indigo-500 to-cyan-400" },
  { name: "Fashion", emoji: "👟", bg: "from-pink-500 to-orange-400" },
  { name: "Home", emoji: "🕯️", bg: "from-emerald-500 to-blue-500" },
];

const perks = [
  { icon: Truck, title: "Free delivery", text: "On orders above ₹999" },
  { icon: RotateCcw, title: "Easy returns", text: "7-day return policy" },
  { icon: ShieldCheck, title: "Secure checkout", text: "Your data stays safe" },
  { icon: Headset, title: "Support", text: "We are here to help" },
];

export default function LandingSections() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-14">
        <Reveal>
          <h2 className="text-2xl font-bold">Shop by category</h2>
        </Reveal>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.1}>
              <Link
                href={`/?category=${c.name}#products`}
                className={`group relative block overflow-hidden rounded-2xl bg-gradient-to-br ${c.bg} p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}
              >
                <span className="absolute -right-4 -top-4 text-8xl opacity-30 transition duration-300 group-hover:scale-125 group-hover:rotate-12">
                  {c.emoji}
                </span>
                <p className="text-sm text-white/80">Explore</p>
                <h3 className="text-2xl font-bold">{c.name}</h3>
                <p className="mt-6 text-sm font-semibold">Shop now →</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08} className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-slate-500">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}