"use client";

import { useStore } from "@/components/providers/store-provider";
import { formatMoney } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";

export default function ComparePage() {
  const { compare, addToCart, toggleCompare } = useStore();

  if (compare.length < 2) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Compare Bikes</h1>
        <p className="mt-3 text-gray-500">Add at least 2 bikes to compare.</p>
        <Link href="/catalog" className="mt-5 inline-block rounded bg-brand px-5 py-3 font-semibold text-white">
          Find bikes
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto overflow-x-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Compare Models</h1>
      <div className="min-w-[900px] grid grid-cols-4 gap-4">
        <div className="pt-40 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <div className="h-10 border-b">Price</div>
          <div className="h-10 border-b">Frame</div>
          <div className="h-10 border-b">Wheel</div>
          <div className="h-10 border-b">Material</div>
          <div className="h-10 border-b">Brakes</div>
          <div className="h-10 border-b">Gears</div>
        </div>
        {compare.map((product) => (
          <div key={product.id}>
            <button onClick={() => toggleCompare(product)} className="mb-3 text-sm text-red-600">
              Remove
            </button>
            <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
              {product.main_image ? <Image src={product.main_image} alt={product.name_en} fill className="object-cover" /> : null}
            </div>
            <div className="mb-2 font-bold">{product.name_uk}</div>
            <button onClick={() => addToCart(product)} className="mb-3 rounded bg-gray-900 px-3 py-1.5 text-sm text-white">
              Add to cart
            </button>
            <div className="text-sm">
              <div className="h-10 border-b">${formatMoney(product.price)}</div>
              <div className="h-10 border-b">{product.frame_size}</div>
              <div className="h-10 border-b">{product.wheel_size}</div>
              <div className="h-10 border-b">{product.frame_material}</div>
              <div className="h-10 border-b">{product.brake_type}</div>
              <div className="h-10 border-b">{product.gears}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
