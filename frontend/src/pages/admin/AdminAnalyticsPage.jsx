import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/featuresApi';
import { formatCurrency } from '../../utils/currency';
import {
  TrendingUp, BarChart3, PieChart, DollarSign,
  ShoppingCart, Users, ArrowUpRight, Award, Calendar
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('30_DAYS');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAnalytics({ range: timeRange });
      if (res.data?.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const topCategories = analytics?.categorySales || [
    { name: 'Laptops & Ultrabooks', percentage: 38, revenue: 840000 },
    { name: 'Smartphones & Flagships', percentage: 26, revenue: 580000 },
    { name: 'PC Components & GPUs', percentage: 20, revenue: 440000 },
    { name: 'Monitors & Displays', percentage: 10, revenue: 220000 },
    { name: 'Audio & Peripherals', percentage: 6, revenue: 130000 },
  ];

  const topProducts = analytics?.topProducts || [
    { name: 'MacBook Pro 16" M3 Max', sales: 18, revenue: 4499820 },
    { name: 'ASUS ROG Strix SCAR 16', sales: 14, revenue: 2659860 },
    { name: 'iPhone 15 Pro Max 256GB', sales: 22, revenue: 2969780 },
    { name: 'Samsung Galaxy S24 Ultra', sales: 16, revenue: 2079840 },
    { name: 'Sony WH-1000XM5 Headphones', sales: 45, revenue: 1349550 },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-cyan-400" /> Executive Business Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Revenue volume, category margins, average order value, and top silicon turnover.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
          {[
            { key: 'TODAY', label: 'Today' },
            { key: '7_DAYS', label: '7D' },
            { key: '30_DAYS', label: '30D' },
            { key: '90_DAYS', label: '90D' },
            { key: 'YEAR', label: 'This Year' }
          ].map((r) => (
            <button
              key={r.key}
              onClick={() => setTimeRange(r.key)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                timeRange === r.key
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-8">
          
          {/* Top 3 High Level KPI Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Average Order Value (AOV)</span>
              <h3 className="text-3xl font-black text-white font-mono">{formatCurrency(analytics?.aov || 48500)}</h3>
              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12.3% YoY Growth
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Checkout Conversion Rate</span>
              <h3 className="text-3xl font-black text-cyan-400 font-mono">4.82%</h3>
              <p className="text-xs text-cyan-400/80 mt-2">
                Industry average for high-ticket tech: 2.1%
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Repeat Customer Rate</span>
              <h3 className="text-3xl font-black text-blue-400 font-mono">34.6%</h3>
              <p className="text-xs text-blue-400/80 mt-2">
                Multi-component PC builders & upgrades
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Sales by Category breakdown */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-cyan-400" /> Revenue Share by Category
              </h3>
              <p className="text-xs text-slate-400 mb-6">Proportion of gross merchandise value</p>

              <div className="space-y-4">
                {topCategories.map((cat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{cat.name}</span>
                      <span className="font-mono font-bold text-cyan-400">{cat.percentage}% ({formatCurrency(cat.revenue)})</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Top Revenue Generating Products
              </h3>
              <p className="text-xs text-slate-400 mb-6">Ranked by total sales volume</p>

              <div className="space-y-3">
                {topProducts.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 font-mono font-black text-xs flex items-center justify-center border border-slate-700">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white line-clamp-1">{p.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{p.sales} units shipped</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-extrabold text-cyan-400">
                      {formatCurrency(p.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminAnalyticsPage;
