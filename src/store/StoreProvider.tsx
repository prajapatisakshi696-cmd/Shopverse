"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import { hydrateCart } from "@/features/cart/cartSlice";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // lazy initializer runs only once, so each browser session gets one store
  const [store] = useState(makeStore);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) store.dispatch(hydrateCart(JSON.parse(saved)));
    } catch {
      // ignore corrupted localStorage data
    }

    return store.subscribe(() => {
      try {
        localStorage.setItem("cart", JSON.stringify(store.getState().cart.items));
      } catch {
        // storage can be full or blocked
      }
    });
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}