import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X, Phone, Globe, ChevronDown } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Bikes', value: 'catalog' },
    { label: 'Service', value: 'service' }, // Placeholder for now
    { label: 'About', value: 'about' },     // Placeholder for now
    { label: 'Contact', value: 'contact' }, // Placeholder for now
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="text-2xl font-bold uppercase tracking-tighter cursor-pointer flex items-center gap-1"
            onClick={() => onNavigate('home')}
          >
            <span className="text-black">VELO</span>
            <span className="text-orange-600">X</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.value)}
                className={`text-sm font-medium tracking-wide hover:text-orange-600 transition-colors ${currentPage === item.value ? 'text-orange-600' : 'text-gray-800'}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600/20 w-48 transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-4 text-gray-700">
               <button onClick={() => onNavigate('favorites')} className="hover:text-orange-600 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button onClick={() => onNavigate('cart')} className="relative hover:text-orange-600 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => onNavigate('login')} className="hover:text-orange-600 transition-colors">
                <User className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1 text-xs font-semibold cursor-pointer text-gray-500 hover:text-black">
                EN <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-4 flex flex-col gap-4 border-t border-gray-100">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-4 pr-4 py-2 rounded-lg bg-gray-100 text-sm focus:outline-none"
          />
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.value);
                setIsMenuOpen(false);
              }}
              className="text-left font-medium text-gray-800 py-2 border-b border-gray-50 last:border-0"
            >
              {item.label}
            </button>
          ))}
          <div className="flex items-center justify-between pt-2">
             <button onClick={() => onNavigate('favorites')} className="flex items-center gap-2 text-gray-700 font-medium">
               <Heart className="w-5 h-5" /> Favorites
             </button>
             <button onClick={() => onNavigate('cart')} className="flex items-center gap-2 text-gray-700 font-medium">
               <ShoppingCart className="w-5 h-5" /> Cart ({cartCount})
             </button>
             <button onClick={() => onNavigate('login')} className="flex items-center gap-2 text-gray-700 font-medium">
               <User className="w-5 h-5" /> Account
             </button>
          </div>
        </div>
      )}
    </header>
  );
};
