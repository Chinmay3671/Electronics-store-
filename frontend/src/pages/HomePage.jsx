import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { ProductCard } from '../components/product/ProductCard';
import {
  Laptop, Smartphone, Tv, Headphones, Watch, Camera, Gamepad2, Cpu,
  Flame, Sparkles, ShieldCheck, Truck, RotateCcw, Award, ChevronRight,
  Clock, ArrowRight, Layers, Tag, ChevronLeft, CheckCircle2
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HERO_SLIDES = [
  {
    title: 'GeForce RTX™ 5090 & Intel Core Ultra 9',
    subtitle: 'Next-Generation Silicon Available for Immediate Dispatch',
    description: 'Experience 4K Ray Tracing at 144+ FPS with real-time hardware compatibility validation and manufacturer warranty.',
    ctaText: 'Build Custom Rig',
    ctaLink: '/pc-builder',
    badge: 'NEW LAUNCH 2026',
    gradient: 'from-slate-900 via-blue-950 to-slate-900',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1000&auto=format&fit=crop&q=80',
    accentColor: 'text-amber-400',
    btnBg: 'bg-amber-400 hover:bg-amber-500 text-slate-950'
  },
  {
    title: 'Apple MacBook Pro M3 Max (16-inch)',
    subtitle: '128GB Unified Memory • Liquid Retina XDR',
    description: 'Empower high-load video rendering, deep learning compilation, and multitasking with all-day 22-hour battery life.',
    ctaText: 'Explore Laptops',
    ctaLink: '/products?category=Laptops',
    badge: 'CREATOR CHOICE',
    gradient: 'from-blue-950 via-slate-900 to-indigo-950',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&auto=format&fit=crop&q=80',
    accentColor: 'text-cyan-400',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white'
  },
  {
    title: 'Samsung 65" Neo QLED 8K & Spatial Audio',
    subtitle: 'Quantum Matrix Technology Pro with AI Neural Upscaling',
    description: 'Immerse your living room in theater-grade HDR color depth with zero latency gaming mode and Dolby Atmos sound.',
    ctaText: 'Shop Smart TVs',
    ctaLink: '/products?category=TVs',
    badge: 'MEGA HOME ENTERTAINMENT',
    gradient: 'from-slate-900 via-purple-950 to-slate-900',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1000&auto=format&fit=crop&q=80',
    accentColor: 'text-rose-400',
    btnBg: 'bg-amber-400 hover:bg-amber-500 text-slate-950'
  }
];

const CATEGORIES = [
  { name: 'Laptops & MacBooks', slug: 'Laptops', icon: Laptop, count: '48 Models' },
  { name: 'Smartphones & 5G', slug: 'Smartphones', icon: Smartphone, count: '64 Models' },
  { name: '4K OLED & Smart TVs', slug: 'TVs', icon: Tv, count: '32 Models' },
  { name: 'PC Components & GPUs', slug: 'PC Components', icon: Cpu, count: '120+ Parts' },
  { name: 'Gaming Consoles & Gear', slug: 'Gaming', icon: Gamepad2, count: '40 Models' },
  { name: 'ANC Headphones & Audio', slug: 'Headphones', icon: Headphones, count: '55 Models' },
  { name: 'Smartwatches & Fitness', slug: 'Smartwatches', icon: Watch, count: '30 Models' },
  { name: 'Mirrorless Cameras', slug: 'Cameras', icon: Camera, count: '22 Models' },
];

export const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [smartphones, setSmartphones] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Flash deal countdown state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const res = await productApi.getAll({ size: 24 });
      const products = res?.data?.content || res?.data || [];
      if (Array.isArray(products)) {
        setAllProducts(products);
        setFeaturedProducts(products.filter(p => p.featured).slice(0, 10));
        setFlashDeals(products.filter(p => p.flashDeal || (p.originalPrice && p.originalPrice > p.price)).slice(0, 10));
        setLaptops(products.filter(p => p.categoryName === 'Laptops' || p.category?.name === 'Laptops').slice(0, 10));
        setSmartphones(products.filter(p => p.categoryName === 'Smartphones' || p.category?.name === 'Smartphones').slice(0, 10));
      }
    } catch (err) {
      console.warn('Failed to load home products', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Category Quick Links Carousel */}
      <div className="bg-white border-b border-slate-200 py-4 shadow-sm">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 text-center">
            {CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/products?category=${encodeURIComponent(cat.slug)}`}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-50 flex items-center justify-center transition-all shadow-sm group-hover:scale-105">
                    <IconComponent className="w-7 h-7 text-slate-700 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 mt-2 block leading-tight">
                    {cat.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {cat.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Hero Carousel Banner */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200 min-h-[400px] sm:min-h-[460px] flex items-center bg-slate-900">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={HERO_SLIDES[currentSlide].image}
              alt="Hardware Showcase"
              className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${HERO_SLIDES[currentSlide].gradient} opacity-90`} />
          </div>

          {/* Slide Content */}
          <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black tracking-wider uppercase mb-4 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              {HERO_SLIDES[currentSlide].badge}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white mb-3">
              {HERO_SLIDES[currentSlide].title}
            </h1>

            <p className="text-base sm:text-lg font-bold text-slate-200 mb-2">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8 max-w-xl">
              {HERO_SLIDES[currentSlide].description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={HERO_SLIDES[currentSlide].ctaLink}
                className={`px-8 py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 ${HERO_SLIDES[currentSlide].btnBg}`}
              >
                {HERO_SLIDES[currentSlide].ctaText} <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-xs text-slate-200 font-semibold flex items-center gap-1.5 bg-white/10 px-3.5 py-2.5 rounded-xl border border-white/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {HERO_SLIDES[currentSlide].badge}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
            <button
              onClick={() => setCurrentSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5 px-2">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === i ? 'w-8 bg-amber-400' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentSlide((currentSlide + 1) % HERO_SLIDES.length)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 transition-colors cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Retail Trust Pillars */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-sm">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Free Express Delivery</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">On all orders above ₹1,000</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-sm">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">100% Brand Genuine</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Direct OEM brand warranty</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-sm">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">7 Days Easy Return</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Hassle-free replacement</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-sm">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Hardware Compatibility</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">100% validated PC parts</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Lightning Flash Deals Section (Amazon Deal of the Day style) */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-600 text-white rounded-lg shadow-sm">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Today's Lightning Deals</h2>
                  <span className="text-[10px] font-black uppercase bg-rose-600 text-white px-2 py-0.5 rounded">
                    Save up to 45%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Top-rated laptops, mobiles, and audio at limited-period discount.</p>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 font-mono">
              <Clock className="w-4 h-4 text-rose-600" />
              <span className="text-xs text-slate-600 font-sans font-bold">Ends in:</span>
              <span className="text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <span className="text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <span className="text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
            {(flashDeals.length > 0 ? flashDeals : allProducts.slice(0, 5)).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </div>

      {/* 5. Interactive Feature Promo Cards */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white flex flex-col justify-between shadow-md">
            <div className="space-y-2.5">
              <span className="px-2.5 py-1 bg-white/20 rounded text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Rule-Based Hardware Selector
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Smart Product Finder</h3>
              <p className="text-xs text-blue-100 leading-relaxed max-w-md">
                Enter your exact budget, usage workload (e.g. 4K Video Editing, College, Gaming), and preferred specs to get 100% matched laptops and phones.
              </p>
            </div>

            <div className="pt-6">
              <Link
                to="/product-finder"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                Launch Help Me Choose <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex flex-col justify-between shadow-md">
            <div className="space-y-2.5">
              <span className="px-2.5 py-1 bg-white/20 rounded text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 text-white">
                <Cpu className="w-3.5 h-3.5 text-cyan-300" /> Hardware Compatibility Check
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Custom PC Battlestation</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                Select CPUs, Motherboards, GPUs, RAM, and Power Supplies with automated socket alignment, DDR generation verification, and wattage calculation.
              </p>
            </div>

            <div className="pt-6">
              <Link
                to="/pc-builder"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                Assemble Custom Rig <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Curated Category Showcase: Laptops */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <Laptop className="w-6 h-6 text-blue-600" /> Top Laptops & MacBooks
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">OLED creator workstations, thin & light ultrabooks, and high-FPS gaming rigs.</p>
            </div>
            <Link
              to="/products?category=Laptops"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All Laptops <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
            {(laptops.length > 0 ? laptops : allProducts.slice(0, 5)).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </div>

      {/* 7. Curated Category Showcase: Smartphones */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <Smartphone className="w-6 h-6 text-blue-600" /> Flagship Smartphones & 5G
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Apple iPhone, Samsung Galaxy S-Series, OnePlus, and Google Pixel.</p>
            </div>
            <Link
              to="/products?category=Smartphones"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All Mobiles <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
            {(smartphones.length > 0 ? smartphones : allProducts.slice(2, 7)).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </div>

      {/* 8. Authorized Brand Store Partnerships */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-xl font-bold text-slate-900">Authorized Brand Stores</h2>
            <p className="text-xs text-slate-500 mt-1">
              Direct factory warranty and serialized authenticity checks.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
            {['Apple', 'ASUS ROG', 'NVIDIA', 'Sony', 'Samsung', 'Intel', 'AMD', 'Corsair', 'Dell', 'HP', 'LG', 'Logitech'].map((brand) => (
              <Link
                key={brand}
                to={`/products?brand=${encodeURIComponent(brand)}`}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors group"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                  {brand}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
