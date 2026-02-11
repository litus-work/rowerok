"use client";

import { useStore } from "@/components/providers/store-provider";
import { register } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", first_name: "", last_name: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useStore();
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (!res.ok) {
      setError("Registration failed.");
      return;
    }
    const data = await res.json();
    setToken(data.token);
    router.push("/account");
  }

  return (
    <div className="container mx-auto flex max-w-md justify-center px-4 py-20">
      <form onSubmit={onSubmit} className="w-full rounded-2xl border border-gray-100 p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>
        <div className="space-y-4">
          <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required placeholder="Username" className="w-full rounded border px-3 py-2" />
          <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="First name" className="w-full rounded border px-3 py-2" />
          <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Last name" className="w-full rounded border px-3 py-2" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full rounded border px-3 py-2" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required type="email" placeholder="Email" className="w-full rounded border px-3 py-2" />
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required type="password" placeholder="Password" className="w-full rounded border px-3 py-2" />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button disabled={loading} className="w-full rounded bg-brand py-3 font-semibold text-white disabled:opacity-50">
            {loading ? "Creating..." : "Register"}
          </button>
        </div>
        <p className="mt-4 text-center text-sm">
          Already have account? <Link href="/login" className="text-brand">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
