import React from 'react';
import { Sparkles, Truck, ShieldCheck, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementBar = () => {
  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
      <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-amber-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-white font-semibold">Mega Electronics Sale: Up to 40% OFF Laptops & 5G Phones!</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-300">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            Use Code: <strong className="text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">WELCOME10</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300 text-xs">
          <span className="hidden md:inline-flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-blue-400" /> Free Shipping Above ₹1,000
          </span>
          <span className="hidden lg:inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Genuine Brand Warranty
          </span>
          <Link to="/contact" className="hover:text-amber-400 transition-colors">
            24/7 Customer Care
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
