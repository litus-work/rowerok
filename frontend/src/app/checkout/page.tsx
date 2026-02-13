"use client";

import { useStore } from "@/components/providers/store-provider";
import { createOrder } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { z } from "zod";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  delivery_method: z.enum(["nova_poshta", "pickup"]),
  city: z.string().optional(),
  branch: z.string().optional(),
  payment_method: z.enum(["cash", "bank_transfer"]),
  comment: z.string().optional()
});

export default function CheckoutPage() {
  const { cart, clearCart, token } = useStore();
  const router = useRouter();
  const [form, setForm] = useState<{
    name: string;
    phone: string;
    email: string;
    delivery_method: "nova_poshta" | "pickup";
    city: string;
    branch: string;
    payment_method: "cash" | "bank_transfer";
    comment: string;
  }>({
    name: "",
    phone: "",
    email: "",
    delivery_method: "nova_poshta",
    city: "",
    branch: "",
    payment_method: "cash",
    comment: ""
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const total = useMemo(() => cart.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0), [cart]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError("Validation error. Check required fields.");
      return;
    }
    if (!cart.length) {
      setError("Cart is empty.");
      return;
    }
    setSending(true);
    const response = await createOrder(
      {
        ...parsed.data,
        items: cart.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
      },
      token,
    );
    setSending(false);
    if (!response.ok) {
      setError("Failed to place order.");
      return;
    }
    clearCart();
    router.push("/account/orders");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full rounded border px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full rounded border px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="w-full rounded border px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <select className="w-full rounded border px-3 py-2" value={form.delivery_method} onChange={(e) => setForm({ ...form, delivery_method: e.target.value as "nova_poshta" | "pickup" })}>
            <option value="nova_poshta">Nova Poshta</option>
            <option value="pickup">Pickup</option>
          </select>
          {form.delivery_method === "nova_poshta" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <input className="rounded border px-3 py-2" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <input className="rounded border px-3 py-2" placeholder="Branch" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
            </div>
          ) : null}
          <select className="w-full rounded border px-3 py-2" value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value as "cash" | "bank_transfer" })}>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank transfer</option>
          </select>
          <textarea className="w-full rounded border px-3 py-2" placeholder="Comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button disabled={sending} className="w-full rounded-xl bg-brand py-3 font-semibold text-white disabled:opacity-50">
            {sending ? "Sending..." : `Confirm Order ($${formatMoney(total)})`}
          </button>
        </form>
        <div className="h-fit rounded-2xl bg-gray-50 p-6">
          <h2 className="mb-4 text-xl font-bold">Summary</h2>
          <div className="space-y-2 text-sm">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <span>{item.product.name_uk} x{item.quantity}</span>
                <span>${formatMoney(Number(item.product.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4 font-bold">Total: ${formatMoney(total)}</div>
        </div>
      </div>
    </div>
  );
}
