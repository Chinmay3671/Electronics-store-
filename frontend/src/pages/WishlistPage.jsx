import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/currency';
import { Heart, Trash2, ShoppingCart, ArrowLeft, Star, ArrowRight } from 'lucide-react';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleMoveToCart = async (item) => {
    const product = item.product || item;
    await addToCart(product, 1);
    await removeFromWishlist(product.id);
    addToast('Item moved to your cart!', 'success');
  };

  const handleMoveAllToCart = async () => {
    if (!wishlist?.items || wishlist.items.length === 0) return;
    for (const item of wishlist.items) {
      const product = item.product || item;
      await addToCart(product, 1);
      await removeFromWishlist(product.id);
    }
    addToast('All wishlist items moved to your cart!', 'success');
  };

  const items = wishlist?.items || [];

  if (items.length === 0) {
    return (
      <div className="bg-slate-100 min-h-screen text-slate-800 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-600 border border-rose-100 shadow-inner">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Your Wishlist is Empty</h2>
          <p className="text-slate-500 text-sm mb-8">
            Save favorite devices, hardware components, and accessories for future purchases.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Explore Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 py-6">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <Heart className="w-7 h-7 text-rose-600 fill-rose-600" />
              My Saved Wishlist ({items.length})
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Items saved in your account with real-time price & stock updates.
            </p>
          </div>

          <button
            onClick={handleMoveAllToCart}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" /> Move All to Cart
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
          {items.map((item) => {
            const product = item.product || item;
            const price = product.salePrice || product.price || 0;
            const originalPrice = product.originalPrice;

            return (
              <div
                key={item.id || product.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between group hover:border-blue-400 transition-all shadow-sm hover:shadow-md relative"
              >
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full transition-colors border border-slate-200 shadow-sm z-10 cursor-pointer"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div>
                  <Link to={`/products/${product.id}`} className="block h-48 bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100 flex items-center justify-center">
                    <img
                      src={product.mainImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60'}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <span className="text-[11px] font-black text-blue-600 uppercase tracking-wider block">
                    {product.brandName || product.brand?.name || 'TECHVAULT'}
                  </span>

                  <Link
                    to={`/products/${product.id}`}
                    className="text-sm font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 transition-colors mt-1 mb-2"
                  >
                    {product.name}
                  </Link>

                  <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-fit text-xs font-bold mb-3">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span className="text-slate-900">{product.averageRating ? Number(product.averageRating).toFixed(1) : '4.6'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-auto">
                  <div className="flex items-baseline gap-2 mb-3 font-mono">
                    <span className="text-lg font-black text-slate-900">{formatCurrency(price)}</span>
                    {originalPrice && originalPrice > price && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatCurrency(originalPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default WishlistPage;
