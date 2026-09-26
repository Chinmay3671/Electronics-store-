import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../api/featuresApi';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../context/ToastContext';
import {
  ShoppingCart, ArrowLeft, Truck, Package, MapPin,
  CreditCard, Check, AlertTriangle
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOrderById(id);
      if (res.data?.success) {
        setOrder(res.data.data);
        setNewStatus(res.data.data.status);
        setTrackingNumber(res.data.data.trackingNumber || '');
      }
    } catch (err) {
      console.error('Failed to load admin order detail', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await adminApi.updateOrderStatus(order.id, {
        status: newStatus,
        trackingNumber: trackingNumber || undefined
      });
      addToast('Order status and logistics details saved!', 'success');
      fetchOrder();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Orders
      </Link>

      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Order #{order.orderNumber}
            </h1>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Placed on {formatDate(order.orderDate || order.createdAt)} by {order.user?.fullName || 'Registered Customer'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ordered items (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" /> Allocated Line Items
            </h3>

            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage || item.product?.mainImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60'}
                      alt={item.productName || item.product?.name}
                      className="w-12 h-12 object-contain bg-slate-950 rounded-xl p-1 border border-slate-800"
                    />
                    <div>
                      <p className="text-sm font-bold text-white line-clamp-1">{item.productName || item.product?.name}</p>
                      <p className="text-xs text-slate-400">
                        Qty: <span className="font-mono text-cyan-400 font-bold">{item.quantity}</span> × {formatCurrency(item.unitPrice || item.price)}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-mono font-bold text-white">
                    {formatCurrency((item.unitPrice || item.price || 0) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Transition & Shipping details */}
        <div className="space-y-6">
          
          {/* Status Control Form */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" /> Logistics & Fulfillment
            </h3>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PACKED">PACKED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Courier Tracking ID</label>
                <input
                  type="text"
                  placeholder="e.g. BLUEDART-89234"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-500/10"
              >
                {updating ? 'Saving...' : 'Update Fulfillment'}
              </button>
            </form>
          </div>

          {/* Delivery Address */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" /> Shipping Info
            </h3>
            <p className="text-sm font-bold text-white">{order.shippingAddress?.fullName || order.user?.fullName}</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {order.shippingAddress?.addressLine}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
            <p className="text-xs text-slate-400 mt-2 font-mono">📱 {order.shippingAddress?.phone}</p>
          </div>

          {/* Financial summary */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" /> Payment Audit
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Method</span>
                <span className="text-white font-medium">{order.paymentMethod || 'MOCK_SANDBOX'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status</span>
                <span className="text-emerald-400 font-bold">{order.paymentStatus || 'PAID'}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-700/50">
                <span className="font-bold text-white">Grand Total</span>
                <span className="text-base font-extrabold text-cyan-400 font-mono">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminOrderDetailPage;
