import React from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Heart } from 'lucide-react';

interface FavoritesProps {
  items: Product[];
  onNavigate: (page: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
  onCompare: (product: Product) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ items, onNavigate, onAddToCart, onAddToFavorites, onCompare }) => {
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Favorites Yet</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Save items you like here to revisit them later.</p>
        <button 
          onClick={() => onNavigate('catalog')}
          className="px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
        >
          Browse Bikes
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites ({items.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onNavigate={onNavigate} 
            onAddToCart={onAddToCart}
            onAddToFavorites={onAddToFavorites}
            onCompare={onCompare}
          />
        ))}
      </div>
    </div>
  );
};
