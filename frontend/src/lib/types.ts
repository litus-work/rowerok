export type Category = {
  id: number;
  slug: string;
  name_uk: string;
  name_en: string;
  description_uk: string;
  description_en: string;
};

export type Product = {
  id: number;
  slug: string;
  name_uk: string;
  name_en: string;
  brand: string;
  price: string;
  category: Category;
  frame_size: string;
  wheel_size: string;
  frame_material: string;
  brake_type: string;
  fork_type: string;
  gears: number;
  condition: "new" | "used";
  availability: "in_stock" | "out_of_stock";
  description_uk: string;
  description_en: string;
  main_image?: string | null;
  images?: { id: number; image: string; is_main: boolean; alt_text: string }[];
};

export type ApiList<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  id: number;
  product: number;
  product_name_uk: string;
  product_slug: string;
  product_main_image?: string | null;
  price: string;
  quantity: number;
};

export type Order = {
  id: number;
  name: string;
  phone: string;
  email: string;
  delivery_method: "nova_poshta" | "pickup";
  city: string;
  branch: string;
  payment_method: "cash" | "bank_transfer";
  comment: string;
  status: string;
  total_price: string;
  created_at: string;
  items: OrderItem[];
};
