import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { orderApi } from '../api/cartApi';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/formatDate';
import { CheckCircle2, Package, ArrowRight, Home, Truck, ShieldCheck, Download } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && orderId) {
      orderApi.getOrderById(orderId)
        .then(res => {
          if (res.data?.success) setOrder(res.data.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orderId, order]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Success Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 text-center shadow-sm relative overflow-hidden">
          
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
            Payment & Order Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-4 mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Your electronics order has been placed. We have sent a confirmation email with invoice details.
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-left mb-8 w-full justify-around">
            <div>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Order Reference</span>
              <span className="text-sm font-bold text-blue-600 font-mono">
                {order?.orderNumber || `TV-${order?.id || '98762'}`}
              </span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-200" />
            <div>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Order Date</span>
              <span className="text-sm font-bold text-slate-800 font-mono">
                {formatDate(order?.orderDate || order?.createdAt || new Date())}
              </span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-200" />
            <div>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Grand Total</span>
              <span className="text-base font-black text-slate-900 font-mono">
                {formatCurrency(order?.totalAmount || order?.grandTotal || 0)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/orders/${order?.id || ''}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-sm shadow-sm transition-all"
            >
              <Truck className="w-4 h-4" /> Track Shipment
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-sm border border-slate-300 transition-all shadow-sm"
            >
              <Home className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
