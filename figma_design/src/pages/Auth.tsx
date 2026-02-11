import React, { useState } from 'react';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

interface AuthProps {
  onNavigate: (page: string) => void;
  favorites: Product[]; // Passed to show in profile
  onAddToCart: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
  onCompare: (product: Product) => void;
}

export const Auth: React.FC<AuthProps> = ({ onNavigate, favorites, onAddToCart, onAddToFavorites, onCompare }) => {
  const [view, setView] = useState<'login' | 'register' | 'profile'>('login');
  
  // Mock login state for demo
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ name: 'Alex Cyclist', email: 'alex@example.com' });
    setView('profile');
  };

  if (view === 'profile' && user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0 space-y-2">
            <div className="p-6 bg-gray-50 rounded-xl mb-6">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                {user.name.charAt(0)}
              </div>
              <h2 className="font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            
            <button className="w-full text-left px-4 py-3 rounded-lg bg-orange-50 text-orange-700 font-medium flex items-center gap-3">
              <User className="w-5 h-5" /> Profile
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-600 font-medium flex items-center gap-3">
              <Package className="w-5 h-5" /> Orders
            </button>
            <button 
              onClick={() => onNavigate('favorites')}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-600 font-medium flex items-center gap-3"
            >
              <Heart className="w-5 h-5" /> Favorites
            </button>
            <button 
              onClick={() => { setUser(null); setView('login'); }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-red-600 font-medium flex items-center gap-3"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </aside>

          {/* Content */}
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h1>
            
            {/* Mock Orders */}
            <div className="space-y-4 mb-12">
              <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-bold text-gray-900">Order #12345</div>
                    <div className="text-sm text-gray-500">Placed on Feb 10, 2024</div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">Processing</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                   <div className="text-sm text-gray-600">Summit Pro Carbon MTB (x1)</div>
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Favorites</h1>
             {favorites.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {favorites.slice(0, 2).map(product => (
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
             ) : (
               <p className="text-gray-500">No favorites yet.</p>
             )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-100 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{view === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-gray-500">
            {view === 'login' ? 'Enter your credentials to access your account' : 'Sign up to start shopping'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {view === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
          </div>

          <button className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors">
            {view === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {view === 'login' ? (
            <>Don't have an account? <button onClick={() => setView('register')} className="text-orange-600 font-bold hover:underline">Sign Up</button></>
          ) : (
            <>Already have an account? <button onClick={() => setView('login')} className="text-orange-600 font-bold hover:underline">Sign In</button></>
          )}
        </div>
      </div>
    </div>
  );
};
