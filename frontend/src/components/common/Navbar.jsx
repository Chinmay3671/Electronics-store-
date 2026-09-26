import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, ShoppingCart, Heart, User, Menu, X, Bell,
  Cpu, LogOut, Package, Layers, Sparkles, ChevronDown,
  MapPin, Scale, ShieldCheck, Flame, Smartphone, Laptop,
  Tv, Headphones, Watch, Camera, Gamepad2, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { productApi, categoryApi } from '../../api/productApi';
import { formatCurrency } from '../../utils/currency';

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [pincode, setPincode] = useState('560100');
  const [showPincodeModal, setShowPincodeModal] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { cart, getCartTotal } = useCart();
  const { wishlist } = useWishlist();

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistCount = wishlist?.items?.length || 0;
  const cartTotal = getCartTotal();

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setShowSuggestions(false);
  }, [location.pathname]);

  useEffect(() => {
    categoryApi.getAll()
      .then(res => {
        const data = res?.data || res;
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(console.warn);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await productApi.getSuggestions(searchQuery);
        const data = res?.data || res;
        if (Array.isArray(data)) {
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.warn(err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    const params = new URLSearchParams();
    params.set('search', searchQuery.trim());
    if (selectedCategory !== 'ALL') {
      params.set('category', selectedCategory);
    }
    navigate(`/products?${params.toString()}`);
  };

  const CATEGORY_STRIP = [
    { name: 'All Products', path: '/products', icon: Layers },
    { name: 'Laptops', path: '/products?category=Laptops', icon: Laptop },
    { name: 'Smartphones', path: '/products?category=Smartphones', icon: Smartphone },
    { name: 'Smart TVs', path: '/products?category=TVs', icon: Tv },
    { name: 'PC Components', path: '/products?category=PC%20Components', icon: Cpu },
    { name: 'Gaming', path: '/products?category=Gaming', icon: Gamepad2 },
    { name: 'Headphones', path: '/products?category=Headphones', icon: Headphones },
    { name: 'Smartwatches', path: '/products?category=Smartwatches', icon: Watch },
    { name: 'Cameras', path: '/products?category=Cameras', icon: Camera },
    { name: 'PC Builder', path: '/pc-builder', icon: Cpu, highlight: true },
    { name: 'Help Me Choose', path: '/product-finder', icon: Sparkles, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      
      {/* 1. Main Navigation Header (Amazon / Flipkart Royal Navy Retail Palette) */}
      <div className="bg-slate-900 text-white py-3 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md group-hover:bg-blue-500 transition-colors">
              <Cpu className="w-6 h-6 text-white font-black" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-none">
                Tech<span className="text-amber-400">Vault</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mt-0.5">
                Electronics Superstore
              </span>
            </div>
          </Link>

          {/* Delivery Pincode */}
          <button
            onClick={() => setShowPincodeModal(true)}
            className="hidden xl:flex items-center gap-1.5 text-left text-xs hover:bg-slate-800 p-2 rounded-lg transition-colors border border-slate-700/60 shrink-0 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block leading-tight">Deliver to</span>
              <span className="font-bold text-white text-xs">{pincode}</span>
            </div>
          </button>

          {/* Search Bar (Crisp Retail Search Box) */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-xl overflow-hidden shadow-sm border-2 border-transparent focus-within:border-amber-400 transition-colors">
              {/* Category Dropdown */}
              <div className="shrink-0 bg-slate-100 border-r border-slate-200">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent px-3 py-2.5 text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Input */}
              <input
                type="text"
                placeholder="Search laptops, smartphones, 4K TVs, PC components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                className="w-full bg-white px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />

              {/* Search Button */}
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-5 py-2.5 font-bold text-xs transition-colors flex items-center justify-center shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 max-h-96 overflow-y-auto text-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1.5 border-b border-slate-100">
                  Matching Products
                </div>
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.mainImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60'}
                        alt={p.name}
                        className="w-10 h-10 object-contain bg-slate-50 rounded-lg p-1 border border-slate-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {p.name}
                        </p>
                        <span className="text-[10px] text-blue-600 uppercase tracking-wider font-semibold">
                          {p.brandName || p.brand?.name} • {p.categoryName || p.category?.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-900 shrink-0 ml-2">
                      {formatCurrency(p.salePrice || p.price)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Compare */}
            <Link
              to="/compare"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-slate-800"
              title="Compare Specifications"
            >
              <Scale className="w-4 h-4 text-slate-300" />
              <span>Compare</span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg text-slate-200 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button (Commercial Flipkart/Amazon Style) */}
            <Link
              to="/cart"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-[10px] text-blue-100 block leading-tight">My Cart</span>
                <span className="text-xs font-black text-white font-mono">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
            </Link>

            {/* Account */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden md:block">
                      <span className="text-[10px] text-slate-400 block leading-tight">Hello,</span>
                      <span className="text-xs font-bold text-white truncate max-w-[90px] block">
                        {user?.fullName?.split(' ')[0] || 'Customer'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs text-slate-800 space-y-1">
                      <div className="p-2 border-b border-slate-100">
                        <p className="font-bold text-slate-900">{user?.fullName}</p>
                        <p className="text-[11px] text-slate-500 font-mono truncate">{user?.email}</p>
                      </div>

                      {user?.roles?.includes('ROLE_ADMIN') && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 text-purple-700 font-bold transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" /> Admin Backoffice
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                      >
                        <Package className="w-4 h-4 text-blue-600" /> My Orders & Shipments
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-rose-500" /> My Saved Wishlist
                      </Link>
                      <Link
                        to="/addresses"
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-emerald-600" /> Delivery Addresses
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                      >
                        <User className="w-4 h-4 text-blue-600" /> Account Settings
                      </Link>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => { logout(); setUserDropdownOpen(false); }}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-50 text-rose-600 font-semibold transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex bg-white rounded-xl overflow-hidden">
            <input
              type="text"
              placeholder="Search electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-amber-400 text-slate-950 px-4 py-2 font-bold text-xs"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. Secondary White Category Strip (Flipkart / Amazon style) */}
      <div className="bg-white border-b border-slate-200 text-xs px-4 sm:px-6 lg:px-8 hidden sm:block shadow-sm">
        <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between overflow-x-auto py-2.5 custom-scrollbar gap-4">
          <div className="flex items-center gap-6">
            {CATEGORY_STRIP.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className={`flex items-center gap-1.5 whitespace-nowrap font-semibold transition-colors ${
                    cat.highlight
                      ? 'text-blue-700 hover:text-blue-800 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200'
                      : 'text-slate-700 hover:text-blue-600'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-slate-200 shrink-0">
            <Link to="/products?category=Laptops" className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-rose-600" /> Flash Deals
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3 text-slate-800 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/pc-builder"
              className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" /> PC Builder
            </Link>
            <Link
              to="/product-finder"
              className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Help Me Choose
            </Link>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Browse Categories</p>
            {CATEGORY_STRIP.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className="block p-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-xs"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pincode Modal */}
      {showPincodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-slate-900 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Delivery Location
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your 6-digit Indian pincode to view instant delivery availability and local warehouse stock.
            </p>
            <input
              type="text"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              placeholder="560100"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-center text-lg font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600 mb-4"
            />
            <button
              onClick={() => setShowPincodeModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Set Pincode
            </button>
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
