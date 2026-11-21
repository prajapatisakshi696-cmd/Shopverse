import { Suspense } from "react";
import ProductList from "@/components/ProductList";

export default function Home() {
  return (
    <Suspense fallback={<p className="p-6">Loading...</p>}>
      <ProductList />
    </Suspense>
  );
}