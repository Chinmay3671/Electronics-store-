import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/featuresApi';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../context/ToastContext';
import { Star, CheckCircle2, XCircle, Trash2, MessageSquare } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getReviews();
      if (res.data?.success) {
        setReviews(res.data.data?.content || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load reviews for moderation', err);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id, status) => {
    try {
      await adminApi.moderateReview(id, status);
      addToast(`Review marked as ${status}!`, 'success');
      fetchReviews();
    } catch (err) {
      addToast('Failed to update review status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
          <Star className="w-8 h-8 text-amber-400 fill-amber-400" /> Customer Review Moderation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Verify purchaser feedback, enforce anti-spam guidelines, and approve customer ratings.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : reviews.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-12 text-center max-w-md mx-auto my-8">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Reviews Pending Moderation</h3>
          <p className="text-xs text-slate-400 mt-1">All verified purchaser ratings have been processed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(r.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-white">{r.title || 'Product Feedback'}</span>
                  {r.verifiedPurchase && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Verified Buyer
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{r.comment}</p>

                <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                  <span>Product: <strong className="text-white">{r.productName || r.product?.name || `Product #${r.productId}`}</strong></span>
                  <span>•</span>
                  <span>By: <strong className="text-cyan-400">{r.userFullName || r.user?.fullName || 'Customer'}</strong></span>
                  <span>•</span>
                  <span>{formatDate(r.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleModerate(r.id, 'APPROVED')}
                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold rounded-xl text-xs transition-all border border-emerald-500/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => handleModerate(r.id, 'REJECTED')}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-bold rounded-xl text-xs transition-all border border-rose-500/20 flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminReviewsPage;
