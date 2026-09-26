import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminApi } from '../../api/featuresApi';
import { productApi, categoryApi, brandApi } from '../../api/productApi';
import { useToast } from '../../context/ToastContext';
import {
  Package, Plus, Trash2, ArrowLeft, Image, Cpu,
  DollarSign, Check, Layers
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    originalPrice: '',
    stockQuantity: '',
    lowStockThreshold: '5',
    categoryId: '',
    brandId: '',
    warranty: '',
    status: 'ACTIVE',
    mainImage: '',
    images: [],
    specifications: []
  });

  useEffect(() => {
    Promise.all([
      productApi.getProductById(id),
      categoryApi.getAll(),
      brandApi.getAll(),
    ])
      .then(([prodRes, catRes, brandRes]) => {
        if (catRes.data?.success) setCategories(catRes.data.data || []);
        if (brandRes.data?.success) setBrands(brandRes.data.data || []);
        if (prodRes.data?.success) {
          const p = prodRes.data.data;
          setFormData({
            name: p.name || '',
            sku: p.sku || '',
            description: p.description || '',
            price: p.salePrice || p.price || '',
            originalPrice: p.originalPrice || '',
            stockQuantity: p.stockQuantity || 0,
            lowStockThreshold: p.lowStockThreshold || 5,
            categoryId: p.categoryId || p.category?.id || '',
            brandId: p.brandId || p.brand?.id || '',
            warranty: p.warranty || '1 Year Manufacturer Warranty',
            status: p.status || 'ACTIVE',
            mainImage: p.mainImage || '',
            images: p.images?.map(i => i.imageUrl || i) || [],
            specifications: p.specifications?.map(s => ({ specName: s.specName, specValue: s.specValue })) || [],
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load product for editing', err);
        addToast('Product not found', 'error');
        navigate('/admin/products');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddSpecRow = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { specName: '', specValue: '' }]
    }));
  };

  const handleRemoveSpecRow = (idx) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== idx)
    }));
  };

  const handleSpecChange = (idx, field, val) => {
    const nextSpecs = [...formData.specifications];
    nextSpecs[idx][field] = val;
    setFormData(prev => ({ ...prev, specifications: nextSpecs }));
  };

  const handleAddImageRow = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const handleRemoveImageRow = (idx) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const handleImageChange = (idx, val) => {
    const nextImgs = [...formData.images];
    nextImgs[idx] = val;
    setFormData(prev => ({ ...prev, images: nextImgs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        price: parseFloat(formData.price),
        salePrice: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
        categoryId: parseInt(formData.categoryId),
        brandId: parseInt(formData.brandId),
        warranty: formData.warranty,
        status: formData.status,
        mainImage: formData.mainImage,
        images: formData.images.filter(Boolean),
        specifications: formData.specifications.filter(s => s.specName.trim() && s.specValue.trim()),
      };

      const res = await adminApi.updateProduct(id, payload);
      if (res.data?.success) {
        addToast('Product successfully updated!', 'success');
        navigate('/admin/products');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Back link */}
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products List
      </Link>

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Edit Product: {formData.name}</h1>
        <p className="text-xs text-slate-400 mt-1">Update specifications, adjust stock levels, or modify gallery assets.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Info */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-cyan-400" /> Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">SKU / Model Number</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Category *</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">Select Category...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Brand Manufacturer *</label>
              <select
                required
                value={formData.brandId}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">Select Brand...</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Product Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-cyan-500 h-28"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-cyan-400" /> Pricing & Stock
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Original / MRP (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Stock Count *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Low Stock Threshold</label>
              <input
                type="number"
                min="1"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Specs */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Dynamic Technical Specifications
            </h3>
            <button
              type="button"
              onClick={handleAddSpecRow}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Spec Attribute
            </button>
          </div>

          <div className="space-y-3">
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Spec Attribute"
                  value={spec.specName}
                  onChange={(e) => handleSpecChange(idx, 'specName', e.target.value)}
                  className="w-1/3 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                />
                <input
                  type="text"
                  placeholder="Spec Value"
                  value={spec.specValue}
                  onChange={(e) => handleSpecChange(idx, 'specValue', e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpecRow(idx)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Image className="w-4 h-4 text-cyan-400" /> Gallery Images
            </h3>
            <button
              type="button"
              onClick={handleAddImageRow}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Gallery Image
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Primary Cover Image URL *</label>
              <input
                type="url"
                required
                value={formData.mainImage}
                onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {formData.images.map((imgUrl, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="url"
                  placeholder={`Gallery angle image #${idx + 1} URL`}
                  value={imgUrl}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImageRow(idx)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            {submitting ? 'Saving Changes...' : 'Save Product Updates'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminProductEditPage;
