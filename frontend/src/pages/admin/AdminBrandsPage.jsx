import React, { useState, useEffect } from 'react';
import { brandApi } from '../../api/productApi';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';
import {
  Award, Plus, Edit3, Trash2, X, ExternalLink
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminBrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logoUrl: '',
    websiteUrl: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await brandApi.getAll();
      if (res.data?.success) {
        setBrands(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load brands', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (b = null) => {
    if (b) {
      setEditingBrand(b);
      setFormData({
        name: b.name || '',
        slug: b.slug || '',
        logoUrl: b.logoUrl || '',
        websiteUrl: b.websiteUrl || '',
        description: b.description || '',
      });
    } else {
      setEditingBrand(null);
      setFormData({
        name: '',
        slug: '',
        logoUrl: '',
        websiteUrl: '',
        description: '',
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };

      if (editingBrand) {
        await client.put(`/brands/${editingBrand.id}`, payload);
        addToast('Brand updated successfully!', 'success');
      } else {
        await client.post('/brands', payload);
        addToast('Brand created successfully!', 'success');
      }
      setModalOpen(false);
      fetchBrands();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save brand', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete brand partner "${name}"?`)) return;
    try {
      await client.delete(`/brands/${id}`);
      addToast(`Brand "${name}" removed.`, 'info');
      fetchBrands();
    } catch (err) {
      addToast('Cannot delete brand with associated products.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Award className="w-8 h-8 text-cyan-400" /> Brand Partnerships
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage authorized hardware OEMs, official logos, and distributor relationships.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" /> Add Partner Brand
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((b) => (
            <div
              key={b.id}
              className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-500/5 group"
            >
              <div>
                <div className="h-24 bg-slate-900 rounded-xl p-4 mb-4 flex items-center justify-center border border-slate-800">
                  <span className="text-lg font-black text-slate-300 font-mono tracking-wider group-hover:text-cyan-400 transition-colors">
                    {b.name}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{b.name}</h3>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">/{b.slug}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{b.description || 'Authorized Tech Partner.'}</p>
              </div>

              <div className="pt-4 border-t border-slate-700/50 mt-4 flex items-center justify-between text-xs">
                {b.websiteUrl ? (
                  <a
                    href={b.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 text-[11px]"
                  >
                    Website <ExternalLink className="w-3 h-3" />
                  </a>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(b)}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id, b.name)}
                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                {editingBrand ? 'Edit Brand Partner' : 'Add Brand Partner'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NVIDIA, Intel, ASUS, Corsair"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Slug</label>
                <input
                  type="text"
                  placeholder="nvidia (auto-generated if empty)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Official Website URL</label>
                <input
                  type="url"
                  placeholder="https://brand.com"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  placeholder="Overview of hardware lines..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 h-20"
                />
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
                  {submitting ? 'Saving...' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBrandsPage;
