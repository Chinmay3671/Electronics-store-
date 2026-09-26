import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { couponApi } from '../api/featuresApi';
import { formatCurrency } from '../utils/currency';
import {
  ShoppingBag, Trash2, Heart, ArrowRight, ShieldCheck,
  Truck, ArrowLeft, Tag, Check, Sparkles
} from 'lucide-react';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { addToWishlist } = useWishlist();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = getCartTotal();
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.18; // 18% GST standard on electronics
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 99;
  const grandTotal = taxableAmount + tax + shipping;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await couponApi.validate(couponCode.trim(), subtotal);
      if (res.data?.success) {
        setAppliedCoupon(res.data.data);
        addToast(`Coupon "${couponCode.toUpperCase()}" applied successfully!`, 'success');
      } else {
        addToast(res.data?.message || 'Invalid coupon code', 'error');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to apply coupon. Check minimum order value.', 'error');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleMoveToWishlist = (item) => {
    addToWishlist(item.product);
    removeFromCart(item.id);
    addToast('Item moved to your Wishlist!', 'info');
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="bg-slate-100 min-h-screen text-slate-800 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 border border-blue-100 shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-slate-500 text-sm mb-8">
            Explore cutting-edge laptops, smartphones, PC rigs, and premium audio gear.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-sm shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 py-6">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 text-blue-600" />
              Shopping Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
            </h1>
            <p className="text-slate-500 text-xs mt-1">Review items, apply promo codes, and proceed to secure checkout.</p>
          </div>

          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Items List (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const product = item.product || {};
              const itemName = item.productName || product.name || item.name || 'Electronics Product';
              const itemImage = item.productImage || product.mainImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60';
              const price = item.unitPrice ?? item.price ?? product.salePrice ?? product.price ?? 0;
              const originalPrice = product.originalPrice || item.originalPrice;
              const prodId = item.productId || product.id || item.id;
              const brandName = item.brandName || product.brandName || product.brand?.name || 'TECHVAULT';
              const stockQty = item.availableStock ?? product.stockQuantity;

              return (
                <div
                  key={item.id || item.productId}
                  className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <Link to={`/products/${prodId}`} className="shrink-0">
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-20 h-20 object-contain bg-slate-50 rounded-xl p-2 border border-slate-100"
                      />
                    </Link>

                    <div>
                      <span className="text-[11px] font-black text-blue-600 uppercase tracking-wider">
                        {brandName}
                      </span>
                      <Link
                        to={`/products/${prodId}`}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 block mt-0.5"
                      >
                        {itemName}
                      </Link>

                      <div className="flex items-baseline gap-2 mt-1 font-mono">
                        <span className="text-base font-black text-slate-900">{formatCurrency(price)}</span>
                        {originalPrice && originalPrice > price && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatCurrency(originalPrice)}
                          </span>
                        )}
                      </div>

                      {stockQty < 5 && stockQty > 0 && (
                        <p className="text-[11px] text-amber-700 mt-1 font-bold">Only {stockQty} left in stock!</p>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                    <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-sm overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors text-sm font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (product.stockQuantity || 99)}
                        className="px-3 py-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 transition-colors text-sm font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Save for Later"
                      >
                        <Heart className="w-3.5 h-3.5" /> Save
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 shadow-sm gap-2">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Truck className="w-4 h-4 text-blue-600" /> Free express delivery on orders over ₹1,000
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Genuine Authorized Tech
              </span>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="space-y-6">
            
            {/* Promo Code Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" /> Promo / Coupon Code
              </h3>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. TECHVAULT10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 uppercase focus:outline-none focus:border-blue-500 font-mono shadow-sm"
                />
                <button
                  type="submit"
                  disabled={applyingCoupon || !couponCode.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                >
                  {applyingCoupon ? 'Applying...' : 'Apply'}
                </button>
              </form>

              {appliedCoupon && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> {appliedCoupon.code} Applied
                  </span>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Quick coupons hint */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span
                  onClick={() => setCouponCode('TECHVAULT10')}
                  className="cursor-pointer text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-200 transition-colors font-mono"
                >
                  TECHVAULT10 (10% OFF)
                </span>
                <span
                  onClick={() => setCouponCode('WELCOME500')}
                  className="cursor-pointer text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-200 transition-colors font-mono"
                >
                  WELCOME500 (₹500 OFF)
                </span>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900 mb-4">Price Details</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Price ({cart.items.length} items)</span>
                  <span className="text-slate-900 font-bold font-mono">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span className="font-mono font-bold">- {formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>GST (18% Included)</span>
                  <span className="text-slate-900 font-bold font-mono">{formatCurrency(tax)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges</span>
                  <span className={shipping === 0 ? 'text-emerald-700 font-bold' : 'text-slate-900 font-bold font-mono'}>
                    {shipping === 0 ? 'FREE Delivery' : formatCurrency(shipping)}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-sm font-black text-slate-900 block">Total Amount</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Inclusive of all taxes</span>
                </div>
                <span className="text-2xl font-black text-slate-900 font-mono">{formatCurrency(grandTotal)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout', { state: { appliedCoupon, grandTotal } })}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;
