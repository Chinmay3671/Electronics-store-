import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addressApi } from '../api/authApi';
import { orderApi } from '../api/cartApi';
import { formatCurrency } from '../utils/currency';
import {
  ShieldCheck, Truck, CreditCard, MapPin, CheckCircle2,
  Lock, ArrowRight, Plus, Check, Building, Home, Briefcase
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'HOME',
    isDefault: false
  });

  const [paymentMethod, setPaymentMethod] = useState('MOCK_INSTANT');
  const [deliveryType, setDeliveryType] = useState('STANDARD');
  const [processingOrder, setProcessingOrder] = useState(false);

  // Read applied coupon passed from Cart page
  const appliedCoupon = location.state?.appliedCoupon || null;

  const subtotal = getCartTotal();
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.18;
  const deliveryFee = deliveryType === 'EXPRESS' ? 149 : (subtotal > 1000 ? 0 : 99);
  const finalTotal = taxableAmount + tax + deliveryFee;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    fetchAddresses();
  }, [isAuthenticated]);

  const fetchAddresses = async () => {
    try {
      const res = await addressApi.getAll();
      if (res.data?.success) {
        const addrList = res.data.data || [];
        setAddresses(addrList);
        const defaultAddr = addrList.find(a => a.isDefault) || addrList[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else {
          setShowNewAddressForm(true);
        }
      }
    } catch (err) {
      console.error('Failed to load user addresses', err);
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressApi.create(newAddress);
      if (res.data?.success) {
        addToast('Delivery address saved!', 'success');
        await fetchAddresses();
        setSelectedAddressId(res.data.data.id);
        setShowNewAddressForm(false);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save address. Check fields.', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      addToast('Please select or add a delivery address first.', 'error');
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      addToast('Your cart is empty. Please add products to checkout.', 'error');
      return;
    }

    setProcessingOrder(true);
    try {
      const orderPayload = {
        shippingAddressId: selectedAddressId,
        paymentMethod: paymentMethod,
        couponCode: appliedCoupon?.code || null,
        deliveryNotes: deliveryType === 'EXPRESS' ? 'Priority Express Dispatch' : 'Standard Delivery'
      };

      const res = await orderApi.createOrder(orderPayload);
      if (res.data?.success) {
        const orderData = res.data.data;
        addToast('Order placed successfully!', 'success');
        clearCart();
        navigate(`/order-success/${orderData.orderNumber || orderData.id}`, {
          state: { order: orderData }
        });
      }
    } catch (err) {
      console.error('Order creation error', err);
      addToast(err.response?.data?.message || 'Failed to complete transaction. Stock might be reserved.', 'error');
    } finally {
      setProcessingOrder(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="bg-slate-100 min-h-screen text-slate-800 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">No items to checkout</h2>
          <p className="text-slate-500 text-xs mb-6">Your shopping cart is currently empty.</p>
          <Link to="/products" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs inline-block shadow-sm">
            Browse Electronics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 py-6">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-5 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <Lock className="w-6 h-6 text-blue-600" />
              Secure Checkout
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              End-to-end 256-bit encrypted checkout & verified payment processing.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% SSL Encrypted & Verified
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Checkout Sections (Left 2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Shipping Address */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">1</span>
                  Delivery Address
                </h3>
                <button
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> {showNewAddressForm ? 'Cancel' : 'Add New Address'}
                </button>
              </div>

              {/* Saved Address Cards */}
              {!showNewAddressForm && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-600 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                            {addr.addressType === 'HOME' && <Home className="w-3 h-3 text-blue-600" />}
                            {addr.addressType === 'WORK' && <Briefcase className="w-3 h-3 text-blue-600" />}
                            {addr.addressType || 'HOME'}
                          </span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                        </div>

                        <p className="text-sm font-bold text-slate-900">{addr.fullName}</p>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {addr.addressLine}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 font-mono">📱 {addr.phone}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* New Address Form */}
              {showNewAddressForm && (
                <form onSubmit={handleCreateAddress} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / House / Flat *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.addressLine}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                      placeholder="Flat 402, HighTech Towers, Silicon Layout"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                        placeholder="Bengaluru"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                        placeholder="Karnataka"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                        placeholder="560100"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                    >
                      Save & Deliver Here
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 2. Delivery Options */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">2</span>
                Delivery Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setDeliveryType('STANDARD')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryType === 'STANDARD'
                      ? 'bg-blue-50/70 border-blue-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-blue-600" /> Standard Express
                    </span>
                    <span className="text-xs text-emerald-700 font-black">
                      {subtotal > 1000 ? 'FREE' : '₹99'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Delivered within 2–4 business days with live GPS tracking.</p>
                </div>

                <div
                  onClick={() => setDeliveryType('EXPRESS')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryType === 'EXPRESS'
                      ? 'bg-blue-50/70 border-blue-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-amber-600" /> Priority VIP Dispatch
                    </span>
                    <span className="text-xs text-amber-700 font-black">₹149</span>
                  </div>
                  <p className="text-xs text-slate-500">Same-day packaging & expedited courier transit (1–2 days).</p>
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">3</span>
                Payment Options
              </h3>

              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod('MOCK_INSTANT')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'MOCK_INSTANT'
                      ? 'bg-blue-50/70 border-blue-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                      {paymentMethod === 'MOCK_INSTANT' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Instant Online Payment / Debit Card / Net Banking (Instant Order Confirmation)</p>
                      <p className="text-[11px] text-slate-500">Fast, verified payment gateway processing with instant receipt.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Recommended
                  </span>
                </div>

                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'UPI'
                      ? 'bg-blue-50/70 border-blue-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                      {paymentMethod === 'UPI' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">UPI / QR Code</p>
                      <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM UPI</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'COD'
                      ? 'bg-blue-50/70 border-blue-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                      {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-slate-500">Pay cash/UPI at the time of doorstep handover.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Summary Column */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-base font-black text-slate-900 mb-4">Items in Order ({cart.items.length})</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-4 custom-scrollbar">
                {cart.items.map((item) => {
                  const product = item.product || {};
                  return (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-2 max-w-[70%]">
                        <span className="font-bold text-blue-600 font-mono">{item.quantity}x</span>
                        <span className="text-slate-800 font-medium truncate">{product.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 font-mono">
                        {formatCurrency((product.salePrice || product.price || 0) * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 text-xs pt-3 border-t border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold font-mono">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span className="font-mono">- {formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>GST (18% Included)</span>
                  <span className="text-slate-900 font-bold font-mono">{formatCurrency(tax)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge</span>
                  <span className="text-slate-900 font-bold font-mono">
                    {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-sm font-black text-slate-900 block">Total Amount</span>
                  <span className="text-[10px] text-slate-500">Inclusive of all taxes</span>
                </div>
                <span className="text-2xl font-black text-slate-900 font-mono">{formatCurrency(finalTotal)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processingOrder || !selectedAddressId}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {processingOrder ? (
                  <>
                    <LoadingSpinner size="sm" text="" /> Processing Order...
                  </>
                ) : (
                  <>
                    Authorize & Place Order <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center mt-3">
                By placing this order, you agree to TechVault Terms of Service & Warranty Conditions.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
