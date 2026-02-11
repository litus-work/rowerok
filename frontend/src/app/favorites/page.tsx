"use client";

import { ProductCard } from "@/components/catalog/product-card";
import { useStore } from "@/components/providers/store-provider";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites } = useStore();
  if (!favorites.length) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">No Favorites Yet</h1>
        <Link href="/catalog" className="mt-5 inline-block rounded bg-brand px-5 py-3 font-semibold text-white">
          Browse bikes
        </Link>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Favorites</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
