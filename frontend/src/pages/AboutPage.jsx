import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Cpu, Truck, Users, Award,
  CheckCircle2, ArrowRight, Layers, Sparkles
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 py-6">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> India's Premier Electronics Superstore
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Pioneering the Future of <span className="text-blue-600">Electronics Retail</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            TechVault is built for tech enthusiasts, gamers, students, and professionals demanding 100% genuine silicon, rigorous component compatibility validation, and lightning-fast logistics.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">100% Direct Sourced</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every laptop, processor, graphics card, and gadget originates strictly from authorized OEM brand channels with manufacturer warranty coverage.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Smart PC Builder</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our automated PC compatibility engine evaluates socket standards, DDR compatibility, thermal clearance, and wattage thresholds in real-time.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Armored Delivery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anti-static packaging, tamper-proof security seals, and fast transit ensure your high-end hardware arrives in pristine factory condition.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-blue-600 font-mono">50K+</p>
              <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">100%</p>
              <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Genuine Brand Stock</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">20+</p>
              <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Top Brands</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-amber-500 font-mono">4.9★</p>
              <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Customer Rating</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-black mb-2">Ready to Upgrade Your Tech Setup?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            Find the perfect laptop, smartphone, or assemble your dream custom gaming PC today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/products"
              className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-sm flex items-center gap-2"
            >
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pc-builder"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" /> Launch PC Builder
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
