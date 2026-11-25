import { Suspense } from "react";
import HeroSlider from "@/components/HeroSlider";
import LandingSections from "@/components/LandingSections";
import ProductList from "@/components/ProductList";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <LandingSections />
      <Suspense fallback={<p className="p-6">Loading...</p>}>
        <ProductList />
      </Suspense>
    </>
  );
}