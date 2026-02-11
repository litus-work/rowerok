"use client";

import { useStore } from "@/components/providers/store-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/catalog", label: "Bikes" },
  { href: "/compare", label: "Compare" },
  { href: "/favorites", label: "Favorites" },
  { href: "/account", label: "Account" }
];

export function Header() {
  const pathname = usePathname();
  const { cart, locale, setLocale } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          ROWER <span className="text-brand">OK</span>
        </Link>
        <nav className="hidden gap-7 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? "text-brand" : "text-gray-700 hover:text-brand"}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as "uk" | "en")}
            className="rounded border border-gray-200 px-2 py-1 text-sm"
          >
            <option value="uk">UKR</option>
            <option value="en">ENG</option>
          </select>
          <Link href="/cart" className="rounded bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white">
            Cart ({cartCount})
          </Link>
        </div>
      </div>
    </header>
  );
}
