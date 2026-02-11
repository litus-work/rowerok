import React from 'react';
import { Heart, ShoppingCart, BarChart2 } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
  onCompare: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onNavigate, 
  onAddToCart,
  onAddToFavorites,
  onCompare
}) => {
  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isFeatured && (
          <span className="px-2 py-1 bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider rounded">Featured</span>
        )}
        {!product.isAvailable && (
          <span className="px-2 py-1 bg-gray-800 text-white text-[10px] font-bold uppercase tracking-wider rounded">Sold Out</span>
        )}
        {product.condition === 'Used' && (
          <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded">Pre-Owned</span>
        )}
      </div>

      {/* Action Buttons (Hover) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToFavorites(product); }}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Add to Favorites"
        >
          <Heart className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onCompare(product); }}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-colors"
          title="Compare"
        >
          <BarChart2 className="w-4 h-4" />
        </button>
      </div>

      {/* Image */}
      <div 
        className="aspect-[4/3] bg-gray-50 overflow-hidden cursor-pointer"
        onClick={() => onNavigate('product', product.id)}
      >
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-1 text-xs text-gray-500 font-medium">{product.category} • {product.brand}</div>
        <h3 
          className="text-lg font-bold text-gray-900 mb-2 truncate cursor-pointer hover:text-orange-600 transition-colors"
          onClick={() => onNavigate('product', product.id)}
        >
          {product.name}
        </h3>
        
        {/* Specs Mini */}
        <div className="flex gap-3 text-xs text-gray-500 mb-4">
          <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">{product.specs.wheelSize}</span>
          <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">{product.specs.frameMaterial}</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="text-xl font-bold text-gray-900">${product.price.toLocaleString()}</div>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="p-2 bg-gray-900 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!product.isAvailable}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
