"use client";

import { useStore } from "@/components/providers/store-provider";
import { formatMoney } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart } = useStore();
  const subtotal = cart.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  if (!cart.length) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <Link href="/catalog" className="mt-5 inline-block rounded bg-brand px-5 py-3 font-semibold text-white">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart ({cart.length})</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="flex gap-4 rounded-xl border border-gray-100 p-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
                {item.product.main_image ? <Image src={item.product.main_image} alt={item.product.name_en} fill className="object-cover" /> : null}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="font-bold">{item.product.name_uk}</p>
                  <p className="text-sm text-gray-500">{item.product.brand}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateCartQty(item.product.id, -1)} className="rounded border px-2">
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateCartQty(item.product.id, 1)} className="rounded border px-2">
                      +
                    </button>
                    <button onClick={() => removeFromCart(item.product.id)} className="ml-2 text-sm text-red-600">
                      remove
                    </button>
                  </div>
                  <div className="font-bold">${formatMoney(Number(item.product.price) * item.quantity)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-fit rounded-2xl bg-gray-50 p-6">
          <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total</span>
            <span>${formatMoney(total)}</span>
          </div>
          <Link href="/checkout" className="mt-6 block rounded-xl bg-brand py-3 text-center font-semibold text-white">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
