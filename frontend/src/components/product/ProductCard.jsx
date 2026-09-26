import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Heart, Star, Zap, ShieldCheck,
  Scale, Truck, Check
} from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

export const ProductCard = ({ product }) => {
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const isFavorited = isInWishlist(product?.id);
  const stock = product?.stockQuantity !== undefined ? product.stockQuantity : (product?.stock || 0);
  const isOutOfStock = stock <= 0 || product?.status === 'OUT_OF_STOCK';
  const isLowStock = stock > 0 && stock <= 5;
  const price = product?.salePrice || product?.price || 0;
  const originalPrice = product?.originalPrice || price;
  const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : (product?.discountPercent || 0);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    setAddingToCart(true);
    try {
      await addToCart(product, 1);
      addToast(`Added "${product.name}" to your cart!`, 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    try {
      await addToCart(product, 1);
      navigate('/checkout');
    } catch (err) {
      console.error(err);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/compare?ids=${product.id}`);
  };

  return (
    <div className="group relative bg-white hover:bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md">
      
      {/* Top Media & Tags */}
      <div>
        <div className="relative overflow-hidden rounded-xl bg-slate-50 aspect-square mb-3 flex items-center justify-center p-3 border border-slate-100">
          <img
            src={product?.mainImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60'}
            alt={product?.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Discount Tag */}
          {discountPercent > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
              <Zap className="w-3 h-3 fill-white" /> {discountPercent}% OFF
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2.5 right-2.5 p-2 rounded-xl transition-colors shadow-sm ${
              isFavorited
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white border border-slate-200'
            }`}
            title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Compare shortcut */}
          <button
            onClick={handleCompare}
            className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-500 hover:text-blue-600 border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 shadow-sm"
            title="Compare specs"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Brand & Stock Status */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
            {product?.brandName || product?.brand?.name || 'TECHVAULT'}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              isOutOfStock
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : isLowStock
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${stock} Left` : 'In Stock'}
          </span>
        </div>

        {/* Product Title */}
        <Link to={`/products/${product?.id}`} className="block">
          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors leading-snug mb-1.5">
            {product?.name}
          </h3>
        </Link>

        {/* Star Ratings */}
        <div className="flex items-center gap-1.5 my-1.5">
          <div className="flex items-center text-amber-500 text-xs font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
            <span className="text-slate-900">{product?.averageRating ? Number(product.averageRating).toFixed(1) : '4.6'}</span>
          </div>
          <span className="text-[11px] text-slate-500">({product?.reviewCount || 18} reviews)</span>
        </div>

        {/* Delivery badge */}
        <div className="flex items-center gap-2 text-[10px] text-slate-500 my-1">
          <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
            <Truck className="w-3 h-3 text-emerald-600" /> Free Delivery
          </span>
          <span>•</span>
          <span className="truncate">{product?.warranty || '1 Yr Warranty'}</span>
        </div>
      </div>

      {/* Pricing & CTA Buttons (Amazon / Flipkart 2-Button style) */}
      <div className="pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-black text-slate-900 font-mono tracking-tight">
            {formatCurrency(price)}
          </span>
          {originalPrice > price && (
            <span className="text-xs text-slate-400 line-through font-mono">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || addingToCart}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-slate-700" />
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-colors cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm'
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
