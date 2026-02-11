"use client";

import { useStore } from "@/components/providers/store-provider";
import { login } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setToken } = useStore();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login({ username, password });
    setLoading(false);
    if (!res.ok) {
      setError("Invalid credentials.");
      return;
    }
    const data = await res.json();
    setToken(data.token);
    router.push("/account");
  }

  return (
    <div className="container mx-auto flex max-w-md justify-center px-4 py-20">
      <form onSubmit={onSubmit} className="w-full rounded-2xl border border-gray-100 p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold">Sign In</h1>
        <div className="space-y-4">
          <input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username" className="w-full rounded border px-3 py-2" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="Password" className="w-full rounded border px-3 py-2" />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button disabled={loading} className="w-full rounded bg-brand py-3 font-semibold text-white disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
        <p className="mt-4 text-center text-sm">
          No account? <Link href="/register" className="text-brand">Register</Link>
        </p>
      </form>
    </div>
  );
}
