import React from 'react';
import { Product } from '../types';
import { X, ArrowRight } from 'lucide-react';

interface CompareProps {
  items: Product[];
  onRemove: (id: string) => void;
  onNavigate: (page: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
}

export const Compare: React.FC<CompareProps> = ({ items, onRemove, onNavigate, onAddToCart }) => {
  if (items.length < 2) {
     return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Compare Bikes</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Add at least 2 bikes to compare their specifications side-by-side.</p>
        <button 
          onClick={() => onNavigate('catalog')}
          className="px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
        >
          Find Bikes
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Compare Models</h1>
      
      <div className="min-w-[800px]">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 p-4 font-bold text-gray-500 uppercase text-xs tracking-wider pt-40">
             <div className="h-10 border-b flex items-center">Price</div>
             <div className="h-10 border-b flex items-center">Category</div>
             <div className="h-10 border-b flex items-center">Frame Size</div>
             <div className="h-10 border-b flex items-center">Wheel Size</div>
             <div className="h-10 border-b flex items-center">Frame Material</div>
             <div className="h-10 border-b flex items-center">Brake Type</div>
             <div className="h-10 border-b flex items-center">Fork</div>
             <div className="h-10 border-b flex items-center">Gears</div>
             <div className="h-10 border-b flex items-center">Weight</div>
          </div>

          {items.map(product => (
            <div key={product.id} className="col-span-1 relative">
              <button 
                onClick={() => onRemove(product.id)}
                className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <div 
                  className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-pointer"
                  onClick={() => onNavigate('product', product.id)}
                >
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                <button 
                  onClick={() => onAddToCart(product)}
                  className="mt-2 w-full py-2 bg-gray-900 text-white text-sm font-bold rounded hover:bg-orange-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>

              <div className="text-sm text-gray-900">
                <div className="h-10 border-b flex items-center font-bold">${product.price.toLocaleString()}</div>
                <div className="h-10 border-b flex items-center">{product.category}</div>
                <div className="h-10 border-b flex items-center">{product.specs.frameSize}</div>
                <div className="h-10 border-b flex items-center">{product.specs.wheelSize}</div>
                <div className="h-10 border-b flex items-center">{product.specs.frameMaterial}</div>
                <div className="h-10 border-b flex items-center truncate" title={product.specs.brakeType}>{product.specs.brakeType}</div>
                <div className="h-10 border-b flex items-center truncate" title={product.specs.forkType}>{product.specs.forkType}</div>
                <div className="h-10 border-b flex items-center">{product.specs.gears}</div>
                <div className="h-10 border-b flex items-center">{product.specs.weight}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
