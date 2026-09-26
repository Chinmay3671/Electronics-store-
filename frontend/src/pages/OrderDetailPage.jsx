import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderApi } from '../api/cartApi';
import { reviewApi } from '../api/featuresApi';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/formatDate';
import {
  Package, Truck, ArrowLeft, CheckCircle2, Clock,
  MapPin, CreditCard, ShieldCheck, XCircle, AlertTriangle, Star, Check
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ORDER_STEPS = [
  { key: 'PENDING', label: 'Order Placed', desc: 'Received & verified' },
  { key: 'CONFIRMED', label: 'Confirmed', desc: 'Inventory allocated' },
  { key: 'PACKED', label: 'Packed & Sealed', desc: 'Anti-static packing' },
  { key: 'SHIPPED', label: 'Shipped', desc: 'In transit with courier' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Courier out on route' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Handed over' },
];

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Review modal state
  const [reviewModalProduct, setReviewModalProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getOrderById(id);
      if (res.data?.success) {
        setOrder(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load order details', err);
      addToast('Order not found or access denied', 'error');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await orderApi.cancelOrder(order.id, cancelReason || 'Customer requested cancellation');
      if (res.data?.success) {
        addToast('Order has been cancelled.', 'success');
        setOrder(res.data.data);
        setCancelModalOpen(false);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Unable to cancel order at this stage.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewModalProduct) return;
    setSubmittingReview(true);
    try {
      const res = await reviewApi.create(reviewModalProduct.productId || reviewModalProduct.product?.id, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      if (res.data?.success) {
        addToast('Review submitted successfully!', 'success');
        setReviewModalProduct(null);
        setReviewTitle('');
        setReviewComment('');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return null;

  // Determine current step index in lifecycle
  const currentStepIndex = ORDER_STEPS.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 py-6">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        
        {/* Back Link */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>

        {/* Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                Order #{order.orderNumber}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Placed on {formatDate(order.orderDate || order.createdAt)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Order Details & Tracking
            </h1>
          </div>

          {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-all self-start md:self-auto"
            >
              Cancel Order
            </button>
          )}
        </div>

        {/* Visual Tracking Timeline */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" /> Shipment Lifecycle
          </h2>

          {isCancelled ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800">
              <XCircle className="w-6 h-6 shrink-0 text-rose-600" />
              <div>
                <p className="font-bold text-sm">This order has been cancelled.</p>
                <p className="text-xs text-rose-600">Inventory has been restored and payment status updated to REFUNDED.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
              {ORDER_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                        isPassed
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPassed ? <Check className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className={`text-xs font-bold ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">{step.desc}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Grid: Details + Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Items (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900 mb-4">Ordered Items</h3>

              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.productImage || item.product?.mainImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60'}
                        alt={item.productName || item.product?.name}
                        className="w-16 h-16 object-contain bg-white rounded-xl p-1.5 border border-slate-200"
                      />
                      <div>
                        <Link
                          to={`/products/${item.productId || item.product?.id}`}
                          className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {item.productName || item.product?.name}
                        </Link>
                        <p className="text-xs text-slate-500 mt-1">
                          Unit Price: <span className="text-slate-800 font-mono font-bold">{formatCurrency(item.unitPrice || item.price)}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          Quantity: <span className="text-blue-600 font-bold font-mono">{item.quantity}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <span className="text-base font-black text-slate-900 font-mono">
                        {formatCurrency((item.unitPrice || item.price || 0) * item.quantity)}
                      </span>

                      {order.status === 'DELIVERED' && (
                        <button
                          onClick={() => setReviewModalProduct(item)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Write Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Address & Financials */}
          <div className="space-y-6">
            
            {/* Delivery Address */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Shipping Destination
              </h3>
              <p className="text-sm font-bold text-slate-900">{order.shippingAddress?.fullName || order.user?.fullName}</p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {order.shippingAddress?.addressLine}
                {order.shippingAddress?.landmark && `, ${order.shippingAddress.landmark}`}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p className="text-xs text-slate-600 mt-2 font-mono">📱 {order.shippingAddress?.phone}</p>
            </div>

            {/* Payment & Charges */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" /> Payment Breakdown
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Payment Mode</span>
                  <span className="text-slate-900 font-bold">{order.paymentMethod || 'MOCK_SANDBOX'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Payment Status</span>
                  <span className={`font-bold ${order.paymentStatus === 'PAID' || order.paymentStatus === 'SUCCESS' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.paymentStatus || 'PAID'}
                  </span>
                </div>
                {order.couponCode && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon ({order.couponCode})</span>
                    <span>- {formatCurrency(order.discountAmount || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200 flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-900">Grand Total Paid</span>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal: Cancel Order */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-600 mb-4">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-black text-slate-900">Cancel Order #{order.orderNumber}</h3>
              </div>
              <p className="text-slate-600 text-xs mb-4">
                Are you sure you want to cancel this order? Reserved hardware stock will be released back into inventory.
              </p>

              <textarea
                placeholder="Reason for cancellation (optional)..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 mb-4 h-24"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Write Review */}
        {reviewModalProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <h3 className="text-lg font-black text-slate-900 mb-1">Write a Product Review</h3>
              <p className="text-xs text-slate-600 mb-4">
                Reviewing: <span className="text-blue-600 font-bold">{reviewModalProduct.productName}</span>
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Blazing fast performance & excellent build quality"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Feedback</label>
                  <textarea
                    required
                    placeholder="Describe thermal performance, battery life, display crispness..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600 h-28"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalProduct(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-sm"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderDetailPage;
