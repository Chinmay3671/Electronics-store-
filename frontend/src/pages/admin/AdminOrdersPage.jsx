import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/featuresApi';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../context/ToastContext';
import {
  ShoppingCart, Search, Filter, ChevronRight, CheckCircle2,
  Clock, Truck, XCircle, Eye
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [page, selectedStatus, searchTerm]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders({
        page,
        size: 15,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        search: searchTerm || undefined,
      });
      if (res.data?.success) {
        setOrders(res.data.data?.content || []);
        setTotalPages(res.data.data?.totalPages || 0);
        setTotalElements(res.data.data?.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, { status: newStatus });
      addToast(`Order status updated to ${newStatus}!`, 'success');
      fetchOrders();
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid status transition.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-blue-600" /> Order Fulfillment & Logistics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking <span className="text-blue-600 font-bold">{totalElements}</span> customer transactions and dispatch statuses.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order # or customer..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto custom-scrollbar pb-1 sm:pb-0">
          {['ALL', 'PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => { setSelectedStatus(st); setPage(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="text-slate-600 font-bold uppercase tracking-wider bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4">Order Reference</th>
                  <th className="p-4">Customer & City</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">Grand Total</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.length > 0 ? (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-blue-600">
                        {o.orderNumber}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">
                          {o.shippingAddress?.fullName || o.user?.fullName || 'Customer'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {o.shippingAddress?.city || 'India'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-700">
                        {o.items?.length || 1} items
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {formatCurrency(o.totalAmount)}
                      </td>
                      <td className="p-4 text-slate-500 font-mono text-[11px]">
                        {formatDate(o.orderDate || o.createdAt)}
                      </td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PACKED">PACKED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/admin/orders/${o.id}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No orders found matching the filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Page <span className="font-bold text-slate-900">{page + 1}</span> of {Math.max(1, totalPages)}
            </span>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrdersPage;
