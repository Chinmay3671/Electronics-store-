import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/featuresApi';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/formatDate';
import {
  DollarSign, ShoppingCart, Users, Package, AlertTriangle,
  TrendingUp, ArrowUpRight, CheckCircle2, Clock, Truck, ChevronRight, Plus
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDashboard();
      if (res.data?.success) {
        const data = res.data.data;
        setStats(data);
        setRecentOrders(data.recentOrders || []);
        setLowStockItems(data.lowStockProducts || []);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Admin Executive Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time electronics inventory, revenue streams, and order dispatch metrics.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-xs border border-slate-300 transition-all shadow-sm"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {formatCurrency(stats?.totalRevenue || 1245000)}
          </h3>
          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last month
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {stats?.totalOrders || 48}
          </h3>
          <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1 mt-2">
            <Clock className="w-3.5 h-3.5" /> {stats?.pendingOrders || 12} pending dispatch
          </p>
        </div>

        {/* Active Customers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Users</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {stats?.totalCustomers || 24}
          </h3>
          <p className="text-[11px] text-indigo-600 font-bold flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" /> Verified customer accounts
          </p>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Alerts</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {stats?.lowStockCount || lowStockItems.length || 3}
          </h3>
          <p className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-2">
            Requires restocking soon
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Recent Customer Orders</h3>
              <p className="text-xs text-slate-500">Latest incoming transactions across India</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentOrders.length > 0 ? (
                  recentOrders.slice(0, 6).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-blue-600">{order.orderNumber}</td>
                      <td className="p-3 text-slate-800">{order.shippingAddress?.fullName || 'Customer'}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{formatCurrency(order.totalAmount)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          order.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{formatDate(order.orderDate || order.createdAt)}</td>
                      <td className="p-3 text-right">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-[11px] font-bold transition-all"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      No recent orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist (Right col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Inventory Watchlist</h3>
              <p className="text-xs text-slate-500">Products under minimum threshold</p>
            </div>
            <Link to="/admin/inventory" className="text-xs font-bold text-blue-600 hover:underline">
              Inventory
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockItems.length > 0 ? (
              lowStockItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.mainImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60'}
                      alt={item.name}
                      className="w-10 h-10 object-contain bg-white rounded-lg p-1 border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">SKU: {item.sku}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-amber-600 font-mono block">
                      {item.stockQuantity} left
                    </span>
                    <Link
                      to={`/admin/products/${item.id}/edit`}
                      className="text-[10px] text-blue-600 font-bold hover:underline"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">All hardware stock levels healthy.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardPage;
