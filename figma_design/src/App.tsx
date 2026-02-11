import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Favorites } from './pages/Favorites';
import { Compare } from './pages/Compare';
import { Auth } from './pages/Auth';
import { CartItem, Product } from './types';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentProductId, setCurrentProductId] = useState<string | undefined>(undefined);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Navigation Handler
  const handleNavigate = (page: string, id?: string) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
    if (id) setCurrentProductId(id);
  };

  // Cart Actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        toast.success(`Increased quantity of ${product.name}`);
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      toast.success(`Added ${product.name} to cart`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.info('Item removed from cart');
  };

  const placeOrder = (details: any) => {
    console.log('Order Placed:', details);
    setCart([]);
    // In a real app, this would send data to backend
  };

  // Favorites Actions
  const addToFavorites = (product: Product) => {
    if (favorites.some(p => p.id === product.id)) {
      setFavorites(prev => prev.filter(p => p.id !== product.id));
      toast.info('Removed from favorites');
    } else {
      setFavorites(prev => [...prev, product]);
      toast.success('Added to favorites');
    }
  };

  // Compare Actions
  const addToCompare = (product: Product) => {
    if (compareList.some(p => p.id === product.id)) {
      toast.info('Already in comparison list');
      handleNavigate('compare');
      return;
    }
    if (compareList.length >= 4) {
      toast.warning('You can compare up to 4 items');
      return;
    }
    setCompareList(prev => [...prev, product]);
    toast.success('Added to compare list');
  };

  const removeFromCompare = (id: string) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
  };

  // Router
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} onAddToCart={addToCart} onAddToFavorites={addToFavorites} onCompare={addToCompare} />;
      case 'catalog':
        return <Catalog onNavigate={handleNavigate} onAddToCart={addToCart} onAddToFavorites={addToFavorites} onCompare={addToCompare} />;
      case 'product':
        return <ProductDetails productId={currentProductId!} onNavigate={handleNavigate} onAddToCart={addToCart} onAddToFavorites={addToFavorites} onCompare={addToCompare} />;
      case 'cart':
        return <Cart items={cart} onUpdateQuantity={updateQuantity} onRemoveItem={removeFromCart} onNavigate={handleNavigate} />;
      case 'checkout':
        return <Checkout items={cart} onNavigate={handleNavigate} onPlaceOrder={placeOrder} />;
      case 'favorites':
        return <Favorites items={favorites} onNavigate={handleNavigate} onAddToCart={addToCart} onAddToFavorites={addToFavorites} onCompare={addToCompare} />;
      case 'compare':
        return <Compare items={compareList} onRemove={removeFromCompare} onNavigate={handleNavigate} onAddToCart={addToCart} />;
      case 'login':
      case 'register':
      case 'profile':
        return <Auth onNavigate={handleNavigate} favorites={favorites} onAddToCart={addToCart} onAddToFavorites={addToFavorites} onCompare={addToCompare} />;
      default:
        return <Home onNavigate={handleNavigate} onAddToCart={addToCart} onAddToFavorites={addToFavorites} onCompare={addToCompare} />;
    }
  };

  return (
    <Layout cartCount={cart.reduce((a, b) => a + b.quantity, 0)} onNavigate={handleNavigate} currentPage={currentPage}>
      <Toaster position="top-center" />
      {renderPage()}
    </Layout>
  );
}
