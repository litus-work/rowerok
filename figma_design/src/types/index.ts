
export type Category = 'MTB' | 'Road' | 'Gravel' | 'City' | 'Kids' | 'E-bike';

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: Category;
  images: string[];
  specs: {
    frameSize: string;
    wheelSize: string;
    frameMaterial: string;
    brakeType: string;
    forkType: string;
    gears: number;
    weight: string;
  };
  condition: 'New' | 'Used';
  isAvailable: boolean;
  isFeatured: boolean;
  description: string;
  rating: number;
  reviewCount: number;
};

export type CartItem = Product & {
  quantity: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Order = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
};
