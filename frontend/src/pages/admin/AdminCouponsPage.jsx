import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/featuresApi';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../context/ToastContext';
import { Tag, Plus, Trash2, Check, X, Calendar, Percent } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minimumOrder: '1000',
    maximumDiscount: '5000',
    usageLimit: '100',
    perUserLimit: '1',
    active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCoupons();
      if (res.data?.success) {
        setCoupons(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load coupons', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        discountValue: parseFloat(formData.discountValue),
        minimumOrder: parseFloat(formData.minimumOrder || 0),
        maximumDiscount: formData.maximumDiscount ? parseFloat(formData.maximumDiscount) : null,
        usageLimit: parseInt(formData.usageLimit) || 100,
        perUserLimit: parseInt(formData.perUserLimit) || 1,
      };

      const res = await adminApi.createCoupon(payload);
      if (res.data?.success) {
        addToast(`Coupon "${payload.code}" created successfully!`, 'success');
        setModalOpen(false);
        fetchCoupons();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create coupon', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await adminApi.deleteCoupon(id);
      addToast(`Coupon "${code}" deleted.`, 'info');
      fetchCoupons();
    } catch (err) {
      addToast('Failed to delete coupon.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Tag className="w-8 h-8 text-cyan-400" /> Promotion & Discount Coupons
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure checkout discount codes, minimum order requirements, and user limits.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              code: '',
              discountType: 'PERCENTAGE',
              discountValue: '',
              minimumOrder: '1000',
              maximumDiscount: '5000',
              usageLimit: '100',
              perUserLimit: '1',
              active: true,
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" /> Create Promo Code
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : coupons.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-12 text-center max-w-md mx-auto my-8">
          <Tag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Active Coupons</h3>
          <p className="text-xs text-slate-400 mt-1">Create marketing discount vouchers for checkout campaigns.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all backdrop-blur-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-black text-base text-cyan-400 tracking-wider bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                    {c.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    c.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {c.active ? 'ACTIVE' : 'EXPIRED'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Discount Benefit:</span>
                    <strong className="text-white font-mono">
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `${formatCurrency(c.discountValue)} OFF`}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Min. Order Value:</span>
                    <span className="text-white font-mono">{formatCurrency(c.minimumOrder || 0)}</span>
                  </p>
                  {c.maximumDiscount && (
                    <p className="flex justify-between">
                      <span className="text-slate-400">Max Discount Cap:</span>
                      <span className="text-white font-mono">{formatCurrency(c.maximumDiscount)}</span>
                    </p>
                  )}
                  <p className="flex justify-between">
                    <span className="text-slate-400">Usage Limit:</span>
                    <span className="text-white font-mono">{c.timesUsed || 0} / {c.usageLimit || '∞'}</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50 mt-4 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">Per User: {c.perUserLimit || 1}x</span>
                <button
                  onClick={() => handleDelete(c.id, c.code)}
                  className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-cyan-400" /> Create Promotion Code
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVE20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="PERCENTAGE">PERCENTAGE (%)</option>
                    <option value="FIXED">FIXED AMOUNT (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    {formData.discountType === 'PERCENTAGE' ? 'Discount Percentage (%) *' : 'Discount Amount (₹) *'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder={formData.discountType === 'PERCENTAGE' ? '15' : '500'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Minimum Order (₹)</label>
                  <input
                    type="number"
                    value={formData.minimumOrder}
                    onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={formData.maximumDiscount}
                    onChange={(e) => setFormData({ ...formData, maximumDiscount: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Total Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20"
                >
                  {submitting ? 'Generating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCouponsPage;
