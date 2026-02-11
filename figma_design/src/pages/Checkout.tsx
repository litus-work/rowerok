import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutProps {
  items: CartItem[];
  onNavigate: (page: string) => void;
  onPlaceOrder: (details: any) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ items, onNavigate, onPlaceOrder }) => {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    deliveryMethod: 'nova_poshta',
    city: '',
    branch: '',
    paymentMethod: 'cod',
    comment: ''
  });

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder({ ...formData, items, total });
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order, {formData.firstName}. Our manager will contact you shortly at {formData.phone} to confirm the details.
        </p>
        <button 
          onClick={() => onNavigate('home')}
          className="px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => onNavigate('cart')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </button>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Form */}
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    required
                    type="email" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Method</h2>
              <div className="space-y-3 mb-4">
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${formData.deliveryMethod === 'nova_poshta' ? 'border-orange-600 bg-orange-50' : 'border-gray-200'}`}>
                  <input 
                    type="radio" 
                    name="delivery" 
                    className="accent-orange-600 w-5 h-5"
                    checked={formData.deliveryMethod === 'nova_poshta'}
                    onChange={() => setFormData({...formData, deliveryMethod: 'nova_poshta'})}
                  />
                  <div>
                    <div className="font-bold text-gray-900">Nova Poshta</div>
                    <div className="text-sm text-gray-500">Delivery to branch</div>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${formData.deliveryMethod === 'pickup' ? 'border-orange-600 bg-orange-50' : 'border-gray-200'}`}>
                  <input 
                    type="radio" 
                    name="delivery" 
                    className="accent-orange-600 w-5 h-5"
                    checked={formData.deliveryMethod === 'pickup'}
                    onChange={() => setFormData({...formData, deliveryMethod: 'pickup'})}
                  />
                  <div>
                    <div className="font-bold text-gray-900">Store Pickup</div>
                    <div className="text-sm text-gray-500">Kyiv, Cycling Blvd 123</div>
                  </div>
                </label>
              </div>

              {formData.deliveryMethod === 'nova_poshta' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Kyiv"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch Number</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Branch #15"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.branch}
                      onChange={e => setFormData({...formData, branch: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-orange-600 bg-orange-50' : 'border-gray-200'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    className="accent-orange-600 w-5 h-5"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => setFormData({...formData, paymentMethod: 'cod'})}
                  />
                  <div>
                    <div className="font-bold text-gray-900">Cash on Delivery</div>
                    <div className="text-sm text-gray-500">Pay when you receive the order</div>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'bank' ? 'border-orange-600 bg-orange-50' : 'border-gray-200'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    className="accent-orange-600 w-5 h-5"
                    checked={formData.paymentMethod === 'bank'}
                    onChange={() => setFormData({...formData, paymentMethod: 'bank'})}
                  />
                  <div>
                    <div className="font-bold text-gray-900">Bank Transfer (IBAN)</div>
                    <div className="text-sm text-gray-500">Manager will provide details</div>
                  </div>
                </label>
              </div>
            </section>

            {/* Comment */}
            <section>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Comment (Optional)</label>
              <textarea 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                placeholder="Any special requests?"
                value={formData.comment}
                onChange={e => setFormData({...formData, comment: e.target.value})}
              />
            </section>

            <button 
              type="submit"
              className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
            >
              Confirm Order (${total.toLocaleString()})
            </button>
          </form>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:w-80 shrink-0 hidden lg:block">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Your Order</h3>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="w-12 h-12 bg-white rounded border border-gray-100 overflow-hidden shrink-0">
                    <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                     <div className="font-medium text-gray-900 line-clamp-1">{item.name}</div>
                     <div className="text-gray-500">{item.quantity} x ${item.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
