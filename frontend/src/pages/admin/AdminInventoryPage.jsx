import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/featuresApi';
import { formatCurrency } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import {
  Boxes, Search, AlertTriangle, CheckCircle2, XCircle,
  RefreshCw, Plus, Minus
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminInventoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [adjustingId, setAdjustingId] = useState(null);
  const [qtyDelta, setQtyDelta] = useState(10);
  const { addToast } = useToast();

  useEffect(() => {
    fetchInventory();
  }, [searchTerm, statusFilter]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getInventory({
        search: searchTerm || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      if (res.data?.success) {
        setItems(res.data.data?.content || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdjust = async (productId, currentQty, delta) => {
    const nextQty = Math.max(0, currentQty + delta);
    try {
      await adminApi.updateStock(productId, { quantity: nextQty });
      addToast(`Inventory updated to ${nextQty} units!`, 'success');
      fetchInventory();
    } catch (err) {
      addToast('Failed to adjust inventory.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Boxes className="w-8 h-8 text-cyan-400" /> Warehouse Inventory Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stock reservation, safety thresholds, and replenishment adjustments.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU or product title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl overflow-hidden backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="text-slate-400 uppercase tracking-wider bg-slate-900/60 border-b border-slate-700/60">
                <tr>
                  <th className="p-4">Product SKU & Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4">Threshold</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-white line-clamp-1">{item.name}</span>
                        <span className="text-[11px] font-mono text-cyan-400">SKU: {item.sku || 'N/A'}</span>
                      </td>
                      <td className="p-4 text-slate-300 font-medium">{item.categoryName || item.category?.name}</td>
                      <td className="p-4 font-mono font-black text-sm text-white">
                        {item.stockQuantity}
                      </td>
                      <td className="p-4 font-mono text-slate-400 text-xs">
                        {item.lowStockThreshold || 5}
                      </td>
                      <td className="p-4">
                        {item.stockQuantity <= 0 ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1 w-fit">
                            <XCircle className="w-3 h-3" /> OUT OF STOCK
                          </span>
                        ) : item.stockQuantity <= (item.lowStockThreshold || 5) ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> LOW STOCK
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> OPTIMAL
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleQuickAdjust(item.id, item.stockQuantity, 5)}
                            className="px-2 py-1 bg-slate-700 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 rounded-lg text-xs font-bold transition-all"
                            title="Add +5 Units"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(item.id, item.stockQuantity, 25)}
                            className="px-2 py-1 bg-slate-700 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 rounded-lg text-xs font-bold transition-all"
                            title="Add +25 Units"
                          >
                            +25
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(item.id, item.stockQuantity, -1)}
                            disabled={item.stockQuantity <= 0}
                            className="px-2 py-1 bg-slate-800 hover:bg-rose-500 hover:text-white disabled:opacity-30 text-slate-400 rounded-lg text-xs font-bold transition-all"
                            title="Subtract 1 Unit"
                          >
                            -1
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No inventory records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminInventoryPage;
