import { ApiList, Category, Order, Product } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/catalog/categories/`, { next: { revalidate: 120 } });
  if (!res.ok) return [];
  return res.json();
}

export async function getProducts(params?: URLSearchParams): Promise<ApiList<Product>> {
  const query = params?.toString() ?? "";
  const res = await fetch(`${API_URL}/catalog/products/${query ? `?${query}` : ""}`, { cache: "no-store" });
  if (!res.ok) return { count: 0, next: null, previous: null, results: [] };
  return res.json();
}

export async function getCategoryProducts(slug: string, params?: URLSearchParams): Promise<ApiList<Product>> {
  const query = params?.toString() ?? "";
  const res = await fetch(`${API_URL}/catalog/categories/${slug}/products/${query ? `?${query}` : ""}`, { cache: "no-store" });
  if (!res.ok) return { count: 0, next: null, previous: null, results: [] };
  return res.json();
}

export async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/catalog/products/${slug}/`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function createOrder(payload: unknown, token?: string | null): Promise<Response> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Token ${token}`;
  return fetch(`${API_URL}/orders/`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
}

export async function getMyOrders(token: string): Promise<ApiList<Order>> {
  const res = await fetch(`${API_URL}/orders/`, {
    headers: { Authorization: `Token ${token}` },
    cache: "no-store"
  });
  if (!res.ok) return { count: 0, next: null, previous: null, results: [] };
  return res.json();
}

export async function getMyOrder(token: string, orderId: number): Promise<Order | null> {
  const res = await fetch(`${API_URL}/orders/${orderId}/`, {
    headers: { Authorization: `Token ${token}` },
    cache: "no-store"
  });
  if (!res.ok) return null;
  return res.json();
}

export async function login(payload: { username: string; password: string }) {
  return fetch(`${API_URL}/users/profile/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function register(payload: { username: string; email: string; password: string; first_name?: string; last_name?: string; phone?: string }) {
  return fetch(`${API_URL}/users/profile/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function syncFavorites(token: string) {
  const res = await fetch(`${API_URL}/users/favorites/`, { headers: { Authorization: `Token ${token}` }, cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function addFavorite(token: string, productId: number) {
  return fetch(`${API_URL}/users/favorites/`, {
    method: "POST",
    headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId })
  });
}

export async function deleteFavorite(token: string, favoriteId: number) {
  return fetch(`${API_URL}/users/favorites/${favoriteId}/`, {
    method: "DELETE",
    headers: { Authorization: `Token ${token}` }
  });
}

export async function syncCompare(token: string) {
  const res = await fetch(`${API_URL}/users/comparisons/`, { headers: { Authorization: `Token ${token}` }, cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function addCompare(token: string, productId: number) {
  return fetch(`${API_URL}/users/comparisons/`, {
    method: "POST",
    headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId })
  });
}

export async function deleteCompare(token: string, compareId: number) {
  return fetch(`${API_URL}/users/comparisons/${compareId}/`, {
    method: "DELETE",
    headers: { Authorization: `Token ${token}` }
  });
}

export async function syncCart(token: string) {
  const res = await fetch(`${API_URL}/users/cart/`, { headers: { Authorization: `Token ${token}` }, cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function upsertCart(token: string, productId: number, quantity: number) {
  return fetch(`${API_URL}/users/cart/`, {
    method: "POST",
    headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, quantity })
  });
}

export async function deleteCartItem(token: string, itemId: number) {
  return fetch(`${API_URL}/users/cart/${itemId}/`, {
    method: "DELETE",
    headers: { Authorization: `Token ${token}` }
  });
}
