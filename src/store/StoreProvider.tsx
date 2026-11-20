"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";
import { hydrateCart } from "@/features/cart/cartSlice";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) storeRef.current = makeStore();

  useEffect(() => {
    const store = storeRef.current!;
    try {
      const saved = localStorage.getItem("cart");
      if (saved) store.dispatch(hydrateCart(JSON.parse(saved)));
    } catch {}
    return store.subscribe(() => {
      localStorage.setItem("cart", JSON.stringify(store.getState().cart.items));
    });
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}