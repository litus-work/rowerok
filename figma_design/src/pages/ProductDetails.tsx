import React, { useState } from 'react';
import { ShoppingCart, Heart, Share2, Info, ChevronRight, Star, Truck, CreditCard } from 'lucide-react';
import { Product } from '../types';
import { mockProducts } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailsProps {
  productId: string;
  onNavigate: (page: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
  onCompare: (product: Product) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  productId, 
  onNavigate, 
  onAddToCart,
  onAddToFavorites,
  onCompare
}) => {
  const product = mockProducts.find(p => p.id === productId) || mockProducts[0];
  const [activeImage, setActiveImage] = useState(0);

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <span className="hover:text-orange-600 cursor-pointer" onClick={() => onNavigate('home')}>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="hover:text-orange-600 cursor-pointer" onClick={() => onNavigate('catalog')}>Catalog</span>
        <ChevronRight className="w-4 h-4" />
        <span className="hover:text-orange-600 cursor-pointer">{product.category}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-24 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeImage === idx ? 'border-orange-600' : 'border-transparent hover:border-gray-300'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="mb-2">
            <span className="text-orange-600 font-bold tracking-wider text-sm uppercase">{product.brand}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500 underline decoration-gray-300 cursor-pointer">{product.reviewCount} Reviews</span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.isAvailable ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="text-3xl font-bold text-gray-900 mb-8">
            ${product.price.toLocaleString()}
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => onAddToCart(product)}
              disabled={!product.isAvailable}
              className="flex-1 bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button 
              onClick={() => onAddToFavorites(product)}
              className="w-14 h-14 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <Heart className="w-6 h-6" />
            </button>
            <button 
              className="w-14 h-14 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 space-y-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Truck className="w-5 h-5 text-gray-400" />
              <span>Free delivery on orders over $1000</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <span>Secure payment via Bank Transfer or Cash on Delivery</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Info className="w-5 h-5 text-gray-400" />
              <span>2-Year Warranty included</span>
            </div>
          </div>

          <div>
             <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Technical Specifications</h3>
             <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-gray-500">Frame Size</div>
                <div className="font-medium text-gray-900">{product.specs.frameSize}</div>
                <div className="text-gray-500">Wheel Size</div>
                <div className="font-medium text-gray-900">{product.specs.wheelSize}</div>
                <div className="text-gray-500">Frame Material</div>
                <div className="font-medium text-gray-900">{product.specs.frameMaterial}</div>
                <div className="text-gray-500">Brake Type</div>
                <div className="font-medium text-gray-900">{product.specs.brakeType}</div>
                <div className="text-gray-500">Fork</div>
                <div className="font-medium text-gray-900">{product.specs.forkType}</div>
                <div className="text-gray-500">Gears</div>
                <div className="font-medium text-gray-900">{product.specs.gears} Speed</div>
                <div className="text-gray-500">Weight</div>
                <div className="font-medium text-gray-900">{product.specs.weight}</div>
             </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 pt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onNavigate={onNavigate} 
                onAddToCart={onAddToCart}
                onAddToFavorites={onAddToFavorites}
                onCompare={onCompare}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
