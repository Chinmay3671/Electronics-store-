import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu, Truck, ShieldCheck, RotateCcw, Headphones,
  Send, Heart, Phone, Mail, MapPin, ChevronRight
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { addToast } = useToast();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      addToast('Thank you for subscribing to TechVault updates!', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm">
      {/* 1. Value Proposition Features Banner */}
      <div className="border-b border-slate-800 bg-slate-950/40 py-8">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Orders above ₹1,000 delivered within 2-4 business days.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Silicon</h4>
              <p className="text-xs text-slate-400 mt-0.5">Official manufacturer warranty and serialized authenticity.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7 Days Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">Immediate doorstep replacement for defective units.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Expert Hardware Care</h4>
              <p className="text-xs text-slate-400 mt-0.5">Assistance from certified PC builders and tech specialists.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Newsletter */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Tech<span className="text-amber-400">Vault</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              TechVault is India's leading marketplace for enthusiast-grade electronics, high-end PC components, flagship smartphones, OLED displays, and audio systems.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-200 mb-2">Subscribe for flash deal alerts & product drops</p>
              <form onSubmit={handleNewsletter} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 flex-1 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-sm flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" /> Join
                </button>
              </form>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Popular Categories</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=Smartphones" className="hover:text-amber-400 transition-colors">Smartphones & 5G</Link></li>
              <li><Link to="/products?category=Laptops" className="hover:text-amber-400 transition-colors">Gaming & OLED Laptops</Link></li>
              <li><Link to="/products?category=PC%20Components" className="hover:text-amber-400 transition-colors">PC Components & GPUs</Link></li>
              <li><Link to="/products?category=Headphones" className="hover:text-amber-400 transition-colors">ANC Audio & Earbuds</Link></li>
              <li><Link to="/products?category=TVs" className="hover:text-amber-400 transition-colors">4K OLED & Smart TVs</Link></li>
              <li><Link to="/products?category=Gaming" className="hover:text-amber-400 transition-colors">Gaming Consoles</Link></li>
            </ul>
          </div>

          {/* Intelligent Tools */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Interactive Tools</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/product-finder" className="hover:text-amber-400 transition-colors">Smart Product Finder</Link></li>
              <li><Link to="/pc-builder" className="hover:text-amber-400 transition-colors">Custom PC Builder</Link></li>
              <li><Link to="/compare" className="hover:text-amber-400 transition-colors">Product Comparison</Link></li>
              <li><Link to="/products?isFlashDeal=true" className="hover:text-amber-400 transition-colors">Flash Deals Zone</Link></li>
              <li><Link to="/products" className="hover:text-amber-400 transition-colors">All Electronics</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Customer Service</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/orders" className="hover:text-amber-400 transition-colors">Track Your Order</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Help & Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">About TechVault</Link></li>
              <li><Link to="/addresses" className="hover:text-amber-400 transition-colors">Manage Addresses</Link></li>
              <li><Link to="/admin" className="text-slate-400 hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-4 text-xs text-slate-500 text-center">
        <div className="w-full max-w-[1720px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} TechVault Superstore Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 justify-center">
            Engineered with Precision <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Electronics Enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
