import React, { useState } from 'react';
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { mockProducts } from '../data/mockData';

interface CatalogProps {
  onNavigate: (page: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
  onCompare: (product: Product) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ onNavigate, onAddToCart, onAddToFavorites, onCompare }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Placeholder filters (in a real app, these would filter the product list)
  const filters = {
    category: ['MTB', 'Road', 'Gravel', 'City', 'E-bike', 'Kids'],
    brands: ['Summit', 'Veloce', 'Terra', 'CityLife', 'Volt', 'KidsWheels'],
    price: [0, 5000],
    condition: ['New', 'Used']
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Bicycles</h1>
          <p className="text-gray-500 mt-1">Showing {mockProducts.length} results</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <select 
              className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button 
            className="md:hidden flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg"
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block w-64 shrink-0 space-y-8">
          {/* Categories */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {filters.category.map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                  <span className="text-gray-600 group-hover:text-orange-600 transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
            <input type="range" min="0" max="5000" className="w-full accent-orange-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>$0</span>
              <span>$5000+</span>
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Brands</h3>
            <div className="space-y-2">
              {filters.brands.map(brand => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                  <span className="text-gray-600 group-hover:text-orange-600 transition-colors">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Condition</h3>
             <div className="space-y-2">
              {filters.condition.map(cond => (
                <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                  <span className="text-gray-600 group-hover:text-orange-600 transition-colors">{cond}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map(product => (
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
          
          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-orange-600 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-400">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-transparent bg-gray-900 text-white">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-orange-600 hover:text-orange-600 transition-colors">3</button>
            <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-orange-600 hover:text-orange-600 transition-colors">12</button>
          </div>
        </div>
      </div>

      {/* Mobile Filters Sidebar Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
          <div className="relative bg-white w-80 h-full p-6 overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            {/* Replicate filters for mobile here or extract to component */}
            <div className="space-y-8 flex-grow">
              {/* Categories Mobile */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {filters.category.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                      <span className="text-gray-600">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
               {/* Brands Mobile */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Brands</h3>
                <div className="space-y-2">
                  {filters.brands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                      <span className="text-gray-600">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100 mt-6">
               <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
