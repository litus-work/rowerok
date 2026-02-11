"use client";

import { useStore } from "@/components/providers/store-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { token, setToken } = useStore();
  const router = useRouter();

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-4 text-3xl font-bold">My Account</h1>
        <p className="mb-6 text-gray-600">Please sign in to view account details.</p>
        <Link href="/login" className="rounded bg-brand px-5 py-3 font-semibold text-white">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">My Account</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/account/orders" className="rounded-xl border p-6 hover:border-brand">
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-gray-500">Track and view your orders.</p>
        </Link>
        <Link href="/favorites" className="rounded-xl border p-6 hover:border-brand">
          <h2 className="text-xl font-semibold">Favorites</h2>
          <p className="text-gray-500">Saved products.</p>
        </Link>
      </div>
      <button
        className="mt-6 rounded border border-red-200 px-4 py-2 text-red-600"
        onClick={() => {
          setToken(null);
          router.push("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}
