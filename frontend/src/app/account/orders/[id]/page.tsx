"use client";

import { useStore } from "@/components/providers/store-provider";
import { getMyOrder } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { Order } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const { token } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !params?.id) return;
    const id = Number(params.id);
    getMyOrder(token, id).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [params?.id, token]);

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="mb-4">Please sign in to view order details.</p>
        <Link href="/login" className="rounded bg-brand px-4 py-2 text-white">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="mb-4">Order not found.</p>
        <Link href="/account/orders" className="text-brand">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        <div className="text-sm uppercase text-gray-500">{order.status}</div>
      </div>
      <div className="mb-8 rounded-xl border p-5">
        <div className="grid gap-2 text-sm text-gray-700 md:grid-cols-2">
          <div>Date: {new Date(order.created_at).toLocaleString()}</div>
          <div>Name: {order.name}</div>
          <div>Phone: {order.phone}</div>
          <div>Email: {order.email}</div>
          <div>Delivery: {order.delivery_method}</div>
          <div>Payment: {order.payment_method}</div>
          {order.city ? <div>City: {order.city}</div> : null}
          {order.branch ? <div>Branch: {order.branch}</div> : null}
        </div>
      </div>

      <h2 className="mb-3 text-xl font-semibold">Items</h2>
      <div className="space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.product_main_image ? (
                  <div className="relative h-14 w-20 overflow-hidden rounded-md bg-gray-100">
                    <Image src={item.product_main_image} alt={item.product_name_uk} fill className="object-cover" />
                  </div>
                ) : null}
                <Link href={`/product/${item.product_slug}`} className="font-semibold hover:text-brand">
                  {item.product_name_uk}
                </Link>
              </div>
              <div className="font-semibold">${formatMoney(Number(item.price) * item.quantity)}</div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Qty: {item.quantity} x ${formatMoney(item.price)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-gray-50 p-4 text-lg font-bold">Total: ${formatMoney(order.total_price)}</div>

      {order.comment ? <div className="mt-4 rounded-xl border p-4 text-sm text-gray-700">Comment: {order.comment}</div> : null}

      <Link href="/account/orders" className="mt-6 inline-block text-brand">
        Back to orders
      </Link>
    </div>
  );
}
