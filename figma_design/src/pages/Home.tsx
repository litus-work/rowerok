import React from 'react';
import { ArrowRight, CheckCircle, Truck, ShieldCheck, Settings } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product, Category } from '../types';
import { mockProducts, categoryImages } from '../data/mockData';

interface HomeProps {
  onNavigate: (page: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
  onCompare: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onAddToCart, onAddToFavorites, onCompare }) => {
  const featuredProducts = mockProducts.filter(p => p.isFeatured).slice(0, 4);
  const categories: Category[] = ['MTB', 'Road', 'Gravel', 'City', 'E-bike', 'Kids'];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1605271864611-58dd08d10547?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiaWN5Y2xlJTIwc3RvcmUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzA4NDQ5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1920" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Find Your <br/>
              <span className="text-orange-500">Perfect Ride</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed">
              Explore our premium collection of bicycles. From rugged mountain trails to city streets, we have the bike designed for your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('catalog')}
                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
              >
                Shop All Bikes <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onNavigate('catalog')} // Could link to a bike finder wizard
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold rounded-lg transition-all flex items-center justify-center"
              >
                Find a Dealer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-gray-50 rounded-2xl p-8 md:p-12">
          {[
            { icon: Truck, title: 'Free Delivery', desc: 'On orders over $1000' },
            { icon: ShieldCheck, title: 'Warranty', desc: 'Lifetime frame warranty' },
            { icon: Settings, title: 'Expert Assembly', desc: 'Ready to ride' },
            { icon: CheckCircle, title: '30-Day Return', desc: 'Satisfaction guaranteed' },
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm text-orange-600">
                <benefit.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{benefit.title}</h4>
                <p className="text-sm text-gray-500">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <button onClick={() => onNavigate('catalog')} className="text-orange-600 font-medium hover:underline hidden sm:block">View all categories</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div 
              key={cat}
              onClick={() => onNavigate('catalog')}
              className="group cursor-pointer relative aspect-[3/4] rounded-xl overflow-hidden"
            >
              <img 
                src={categoryImages[cat]} 
                alt={cat} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">{cat}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Bikes</h2>
          <button onClick={() => onNavigate('catalog')} className="text-orange-600 font-medium hover:underline">View all bikes</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
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
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4">
        <div className="bg-gray-900 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-40">
             <img 
              src="https://images.unsplash.com/photo-1760310936486-4dd450aab2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwbWVjaGFuaWMlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NzA4MjA4MzN8MA&ixlib=rb-4.1.0&q=80&w=1920" 
              alt="Service" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 p-12 md:p-24 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Expert Service & Maintenance</h2>
            <p className="text-gray-300 text-lg mb-8">
              Keep your bike in peak condition with our professional service packages. From basic tune-ups to complete overhauls.
            </p>
            <button className="px-8 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Book a Service
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
