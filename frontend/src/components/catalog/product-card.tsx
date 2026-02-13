"use client";

import { useStore } from "@/components/providers/store-provider";
import { formatMoney } from "@/lib/format";
import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

function t(product: Product, locale: "uk" | "en") {
  return locale === "uk" ? product.name_uk : product.name_en;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, toggleCompare, favorites, compare, locale } = useStore();
  const isFavorite = favorites.some((p) => p.id === product.id);
  const isCompared = compare.some((p) => p.id === product.id);
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-xl">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-gray-100">
          {product.main_image ? <Image src={product.main_image} alt={t(product, locale)} fill className="object-cover" /> : null}
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div className="text-xs uppercase tracking-wide text-gray-500">
          {product.category.name_en} - {product.brand}
        </div>
        <Link href={`/product/${product.slug}`} className="line-clamp-1 block text-lg font-bold hover:text-brand">
          {t(product, locale)}
        </Link>
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">${formatMoney(product.price)}</div>
          <button onClick={() => addToCart(product)} className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-brand">
            Add
          </button>
        </div>
        <div className="flex gap-2 text-sm">
          <button onClick={() => toggleFavorite(product)} className="rounded border px-2 py-1">
            {isFavorite ? "Unfavorite" : "Favorite"}
          </button>
          <button onClick={() => toggleCompare(product)} className="rounded border px-2 py-1">
            {isCompared ? "Compared" : "Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}
