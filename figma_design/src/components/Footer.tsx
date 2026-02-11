import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold uppercase tracking-tighter text-white mb-4 flex items-center gap-1">
              <span>VELO</span>
              <span className="text-orange-600">X</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Premium bicycles for the modern rider. Whether you're conquering mountains or navigating the city, we have the perfect ride for you.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Mountain Bikes</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Road Bikes</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Electric Bikes</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Accessories</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Sale</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Warranty Info</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Bike Sizing Guide</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Service Centers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
                <span>123 Cycling Blvd,<br />Kyiv, Ukraine 02000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-600 shrink-0" />
                <span>+380 44 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-600 shrink-0" />
                <span>hello@velox.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2024 VELOX. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
