"use client";

import { useStore } from "@/components/providers/store-provider";
import { getMyOrders } from "@/lib/api";
import { Order } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { token } = useStore();

  useEffect(() => {
    if (!token) return;
    getMyOrders(token).then((data) => setOrders(data.results));
  }, [token]);

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="mb-4">Please sign in to view orders.</p>
        <Link href="/login" className="rounded bg-brand px-4 py-2 text-white">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link key={order.id} href={`/account/orders/${order.id}`} className="block rounded-xl border p-4 transition hover:border-brand hover:bg-orange-50/40">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Order #{order.id}</div>
              <div className="text-sm uppercase text-gray-500">{order.status}</div>
            </div>
            <div className="mt-2 text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</div>
            <div className="mt-2 font-bold">${Number(order.total_price).toLocaleString()}</div>
          </Link>
        ))}
        {!orders.length ? <div className="text-gray-500">No orders yet.</div> : null}
      </div>
    </div>
  );
}
