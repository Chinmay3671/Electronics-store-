import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/cartApi';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/formatDate';
import {
  Package, Truck, ArrowRight, CheckCircle2, Clock,
  AlertCircle, ChevronRight, XCircle, Search
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAllUserOrders();
      if (res.data?.success) {
        setOrders(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load user orders', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Delivered</span>;
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-blue-600" /> In Transit</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-rose-600" /> Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-600" /> {status}</span>;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const matchSearch = (o.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        o.items?.some(i => (i.productName || i.product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 py-6">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <Package className="w-7 h-7 text-blue-600" />
              My Orders & Shipments
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              View real-time package tracking, invoices, and purchase records.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search order ID or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
          {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto my-8 shadow-sm">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-1">No Orders Found</h3>
            <p className="text-slate-500 text-xs mb-6">You have no orders matching the selected filter.</p>
            <Link
              to="/products"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all shadow-sm"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block font-semibold">Order Reference</span>
                      <span className="text-sm font-black text-slate-900 font-mono">{order.orderNumber}</span>
                    </div>
                    <div className="hidden sm:block w-px h-6 bg-slate-200" />
                    <div>
                      <span className="text-slate-500 block font-semibold">Order Date</span>
                      <span className="text-slate-700 font-semibold">{formatDate(order.orderDate || order.createdAt)}</span>
                    </div>
                    <div className="hidden sm:block w-px h-6 bg-slate-200" />
                    <div>
                      <span className="text-slate-500 block font-semibold">Total Amount</span>
                      <span className="text-sm font-black text-slate-900 font-mono">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <Link
                      to={`/orders/${order.id}`}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-slate-200"
                    >
                      Track Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage || item.product?.mainImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60'}
                          alt={item.productName || item.product?.name}
                          className="w-14 h-14 object-contain bg-slate-50 rounded-xl p-1.5 border border-slate-200"
                        />
                        <div>
                          <Link
                            to={`/products/${item.productId || item.product?.id}`}
                            className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                          >
                            {item.productName || item.product?.name}
                          </Link>
                          <span className="text-xs text-slate-500 font-medium">
                            Qty: <span className="font-bold text-slate-800">{item.quantity}</span> × {formatCurrency(item.unitPrice || item.price)}
                          </span>
                        </div>
                      </div>

                      <span className="text-sm font-bold text-slate-900 font-mono">
                        {formatCurrency((item.unitPrice || item.price || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default OrdersPage;
