"use client";

import { useStore } from "@/components/providers/store-provider";
import { Product } from "@/lib/types";

export default function ProductPurchaseActions({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, toggleCompare } = useStore();
  return (
    <div className="flex gap-3">
      <button onClick={() => addToCart(product)} className="flex-1 rounded-xl bg-brand px-5 py-3 font-bold text-white hover:bg-brand-dark">
        Add to Cart
      </button>
      <button onClick={() => toggleFavorite(product)} className="rounded-xl border border-gray-200 px-4 py-3">
        Favorite
      </button>
      <button onClick={() => toggleCompare(product)} className="rounded-xl border border-gray-200 px-4 py-3">
        Compare
      </button>
    </div>
  );
}
