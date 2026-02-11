"use client";

import { addCompare, addFavorite, deleteCartItem, deleteCompare, deleteFavorite, syncCart, syncCompare, syncFavorites, upsertCart } from "@/lib/api";
import { CartItem, Product } from "@/lib/types";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type Locale = "uk" | "en";

type StoreContextType = {
  cart: CartItem[];
  favorites: Product[];
  compare: Product[];
  locale: Locale;
  token: string | null;
  setLocale: (locale: Locale) => void;
  setToken: (token: string | null) => void;
  addToCart: (product: Product) => void;
  updateCartQty: (productId: number, delta: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  toggleFavorite: (product: Product) => void;
  toggleCompare: (product: Product) => void;
};

const StoreContext = createContext<StoreContextType | null>(null);

const LS_KEYS = {
  cart: "rowerok_cart",
  favorites: "rowerok_favorites",
  compare: "rowerok_compare",
  locale: "rowerok_locale",
  token: "rowerok_token"
};

type RemoteItemMap = Record<number, number>;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [compare, setCompare] = useState<Product[]>([]);
  const [locale, setLocaleState] = useState<Locale>("uk");
  const [token, setTokenState] = useState<string | null>(null);
  const [favoriteIdsMap, setFavoriteIdsMap] = useState<RemoteItemMap>({});
  const [compareIdsMap, setCompareIdsMap] = useState<RemoteItemMap>({});
  const [cartIdsMap, setCartIdsMap] = useState<RemoteItemMap>({});

  useEffect(() => {
    const cartRaw = localStorage.getItem(LS_KEYS.cart);
    const favoritesRaw = localStorage.getItem(LS_KEYS.favorites);
    const compareRaw = localStorage.getItem(LS_KEYS.compare);
    const localeRaw = localStorage.getItem(LS_KEYS.locale);
    const tokenRaw = localStorage.getItem(LS_KEYS.token);
    if (cartRaw) setCart(JSON.parse(cartRaw));
    if (favoritesRaw) setFavorites(JSON.parse(favoritesRaw));
    if (compareRaw) setCompare(JSON.parse(compareRaw));
    if (localeRaw === "uk" || localeRaw === "en") setLocaleState(localeRaw);
    if (tokenRaw) setTokenState(tokenRaw);
  }, []);

  useEffect(() => localStorage.setItem(LS_KEYS.cart, JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem(LS_KEYS.favorites, JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem(LS_KEYS.compare, JSON.stringify(compare)), [compare]);
  useEffect(() => localStorage.setItem(LS_KEYS.locale, locale), [locale]);
  useEffect(() => {
    if (token) localStorage.setItem(LS_KEYS.token, token);
    else localStorage.removeItem(LS_KEYS.token);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    syncFavorites(token).then((items) => {
      const mapped = (items.results || items).map((i: any) => i.product);
      const idMap: RemoteItemMap = {};
      (items.results || items).forEach((i: any) => {
        idMap[i.product.id] = i.id;
      });
      setFavoriteIdsMap(idMap);
      if (mapped.length) setFavorites(mapped);
    });
    syncCompare(token).then((items) => {
      const mapped = (items.results || items).map((i: any) => i.product);
      const idMap: RemoteItemMap = {};
      (items.results || items).forEach((i: any) => {
        idMap[i.product.id] = i.id;
      });
      setCompareIdsMap(idMap);
      if (mapped.length) setCompare(mapped);
    });
    syncCart(token).then((items) => {
      const mapped = (items.results || items).map((i: any) => ({ product: i.product, quantity: i.quantity }));
      const idMap: RemoteItemMap = {};
      (items.results || items).forEach((i: any) => {
        idMap[i.product.id] = i.id;
      });
      setCartIdsMap(idMap);
      if (mapped.length) setCart(mapped);
    });
  }, [token]);

  const value = useMemo<StoreContextType>(
    () => ({
      cart,
      favorites,
      compare,
      locale,
      token,
      setLocale: setLocaleState,
      setToken: setTokenState,
      addToCart: (product) => {
        setCart((prev) => {
          const existing = prev.find((item) => item.product.id === product.id);
          const next = existing
            ? prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
            : [...prev, { product, quantity: 1 }];
          if (token) {
            const qty = next.find((x) => x.product.id === product.id)?.quantity || 1;
            upsertCart(token, product.id, qty).then(async (res) => {
              const body = await res.json();
              setCartIdsMap((m) => ({ ...m, [product.id]: body.id || m[product.id] }));
            });
          }
          return next;
        });
      },
      updateCartQty: (productId, delta) => {
        setCart((prev) => {
          const next = prev.map((item) => (item.product.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
          if (token) {
            const qty = next.find((x) => x.product.id === productId)?.quantity || 1;
            upsertCart(token, productId, qty);
          }
          return next;
        });
      },
      removeFromCart: (productId) =>
        setCart((prev) => {
          if (token && cartIdsMap[productId]) deleteCartItem(token, cartIdsMap[productId]);
          return prev.filter((item) => item.product.id !== productId);
        }),
      clearCart: () =>
        setCart((prev) => {
          if (token) {
            Object.values(cartIdsMap).forEach((id) => {
              deleteCartItem(token, id);
            });
          }
          return [];
        }),
      toggleFavorite: (product) =>
        setFavorites((prev) => {
          const exists = prev.some((p) => p.id === product.id);
          if (token) {
            if (exists && favoriteIdsMap[product.id]) deleteFavorite(token, favoriteIdsMap[product.id]);
            if (!exists)
              addFavorite(token, product.id).then(async (res) => {
                const body = await res.json();
                setFavoriteIdsMap((m) => ({ ...m, [product.id]: body.id }));
              });
          }
          return exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
        }),
      toggleCompare: (product) =>
        setCompare((prev) => {
          const exists = prev.some((p) => p.id === product.id);
          if (exists) {
            if (token && compareIdsMap[product.id]) deleteCompare(token, compareIdsMap[product.id]);
            return prev.filter((p) => p.id !== product.id);
          }
          if (prev.length >= 4) return prev;
          if (token)
            addCompare(token, product.id).then(async (res) => {
              const body = await res.json();
              setCompareIdsMap((m) => ({ ...m, [product.id]: body.id }));
            });
          return [...prev, product];
        })
    }),
    [cart, compare, compareIdsMap, favorites, favoriteIdsMap, locale, token, cartIdsMap]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
