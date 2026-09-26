import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { Plus, X, Check, ArrowRight, Star, ShoppingCart, Trash2, Cpu, Scale } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ComparePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const { addToCart } = useCart();

  const productIds = searchParams.get('ids')
    ? searchParams.get('ids').split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
    : [];

  useEffect(() => {
    fetchCompareData();
  }, [searchParams]);

  useEffect(() => {
    // Fetch product catalog for search dropdown
    productApi.getProducts({ size: 100 })
      .then(res => {
        if (res.data?.success) {
          setAllProducts(res.data.data?.content || []);
        }
      })
      .catch(console.error);
  }, []);

  const fetchCompareData = async () => {
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await productApi.getCompare(productIds.join(','));
      if (res.data?.success) {
        setProducts(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load compare products', err);
    } finally {
      setLoading(false);
    }
  };

  const addProductId = (id) => {
    if (productIds.includes(id)) return;
    if (productIds.length >= 4) {
      alert('You can compare a maximum of 4 products at a time.');
      return;
    }
    const newIds = [...productIds, id];
    setSearchParams({ ids: newIds.join(',') });
    setShowAddModal(false);
    setSearchTerm('');
  };

  const removeProductId = (id) => {
    const newIds = productIds.filter(pid => pid !== id);
    if (newIds.length > 0) {
      setSearchParams({ ids: newIds.join(',') });
    } else {
      setSearchParams({});
    }
  };

  // Collect all unique specification names across all products
  const allSpecNames = Array.from(
    new Set(
      products.flatMap(p => p.specifications?.map(s => s.specName) || [])
    )
  );

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 py-6">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 shadow-sm">
                <Scale className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Compare Electronics</h1>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Side-by-side technical specification, pricing, and hardware analysis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {productIds.length < 4 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Product ({productIds.length}/4)
              </button>
            )}
            {productIds.length > 0 && (
              <button
                onClick={() => setSearchParams({})}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold rounded-xl text-xs transition-all border border-slate-300 shadow-sm cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-2xl mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Products Selected to Compare</h2>
            <p className="text-slate-500 mb-6 text-xs max-w-md mx-auto">
              Pick up to 4 laptops, smartphones, PC components, or monitors to inspect full spec-sheet side by side.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
            >
              + Select Products to Compare
            </button>
          </div>
        ) : (
          /* Comparison Matrix Table */
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-4 sm:p-6 w-64 bg-slate-50 sticky left-0 z-20 text-xs font-black uppercase tracking-wider text-slate-600">
                    Product Overview
                  </th>
                  {products.map(p => (
                    <th key={p.id} className="p-4 sm:p-6 min-w-[260px] max-w-[300px] align-top bg-white">
                      <div className="relative flex flex-col h-full">
                        <button
                          onClick={() => removeProductId(p.id)}
                          className="absolute -top-2 -right-2 p-1.5 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full transition-colors border border-slate-200 shadow-sm cursor-pointer"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="h-44 bg-slate-50 rounded-xl p-3 flex items-center justify-center mb-3 border border-slate-100">
                          <img
                            src={p.mainImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60'}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <span className="text-[11px] font-black text-blue-600 uppercase tracking-wider mb-1">
                          {p.brandName || p.brand?.name || 'TECHVAULT'}
                        </span>

                        <Link
                          to={`/products/${p.id}`}
                          className="text-sm font-bold text-slate-900 hover:text-blue-600 line-clamp-2 transition-colors mb-2"
                        >
                          {p.name}
                        </Link>

                        <div className="flex items-center gap-1.5 mb-3 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-fit text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span className="text-slate-900">{p.averageRating ? Number(p.averageRating).toFixed(1) : '4.5'}</span>
                        </div>

                        <div className="mt-auto">
                          <div className="flex items-baseline gap-2 mb-3 font-mono">
                            <span className="text-lg font-black text-slate-900">
                              {formatCurrency(p.salePrice || p.price)}
                            </span>
                            {p.originalPrice && p.originalPrice > (p.salePrice || p.price) && (
                              <span className="text-xs text-slate-400 line-through">
                                {formatCurrency(p.originalPrice)}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => addToCart(p, 1)}
                            className="w-full py-2 px-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                  {/* Add Product Column if less than 4 */}
                  {products.length < 4 && (
                    <th className="p-6 min-w-[220px] bg-slate-50/50 align-middle text-center border-l border-slate-200">
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full h-72 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-500 hover:text-blue-600 transition-all group bg-white cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center mb-3 transition-colors text-slate-600 group-hover:text-blue-600">
                          <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-sm">Add Item</span>
                        <span className="text-xs text-slate-400 mt-1">Compare up to 4</span>
                      </button>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {/* General Meta Rows */}
                <tr className="bg-slate-50/50">
                  <td className="p-4 font-bold text-xs text-slate-700 uppercase tracking-wider bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                    Stock Availability
                  </td>
                  {products.map(p => (
                    <td key={p.id} className="p-4 text-xs font-bold">
                      {p.stockQuantity > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> In Stock ({p.stockQuantity} units)
                        </span>
                      ) : (
                        <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Out of Stock</span>
                      )}
                    </td>
                  ))}
                  {products.length < 4 && <td></td>}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-xs text-slate-700 uppercase tracking-wider bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                    SKU / Model
                  </td>
                  {products.map(p => (
                    <td key={p.id} className="p-4 text-xs font-mono text-slate-800 font-semibold">
                      {p.sku || 'N/A'}
                    </td>
                  ))}
                  {products.length < 4 && <td></td>}
                </tr>

                <tr className="bg-slate-50/50">
                  <td className="p-4 font-bold text-xs text-slate-700 uppercase tracking-wider bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                    Warranty
                  </td>
                  {products.map(p => (
                    <td key={p.id} className="p-4 text-xs text-slate-700 font-semibold">
                      {p.warranty || '1 Year Manufacturer Warranty'}
                    </td>
                  ))}
                  {products.length < 4 && <td></td>}
                </tr>

                {/* Section Divider: Dynamic Specs */}
                <tr>
                  <td colSpan={products.length + (products.length < 4 ? 2 : 1)} className="p-3 bg-blue-50 font-black text-blue-800 text-xs tracking-wide border-t border-b border-blue-200 flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> Technical Specifications
                  </td>
                </tr>

                {allSpecNames.length > 0 ? (
                  allSpecNames.map((specName, index) => {
                    const values = products.map(p => {
                      const spec = p.specifications?.find(s => s.specName.toLowerCase() === specName.toLowerCase());
                      return spec ? spec.specValue : '—';
                    });
                    const allEqual = values.every(v => v === values[0]);

                    return (
                      <tr
                        key={specName}
                        className={`transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        } ${!allEqual ? 'bg-amber-50/30' : ''}`}
                      >
                        <td className="p-4 font-bold text-xs text-slate-700 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                          {specName}
                        </td>
                        {values.map((val, i) => (
                          <td
                            key={i}
                            className={`p-4 text-xs font-semibold ${
                              val === '—' ? 'text-slate-400' : 'text-slate-900'
                            } ${!allEqual && val !== '—' ? 'text-blue-700 font-bold' : ''}`}
                          >
                            {val}
                          </td>
                        ))}
                        {products.length < 4 && <td></td>}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={products.length + (products.length < 4 ? 2 : 1)} className="p-6 text-center text-slate-400 text-xs">
                      No specific technical specs recorded for these products.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: Add Product to Compare */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-600" /> Add Product to Comparison
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Search laptop, phone, GPU, monitor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 mb-4 shadow-sm"
                autoFocus
              />

              <div className="max-h-96 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {allProducts
                  .filter(p => !productIds.includes(p.id) && (
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (p.brandName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (p.categoryName || '').toLowerCase().includes(searchTerm.toLowerCase())
                  ))
                  .slice(0, 15)
                  .map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer"
                      onClick={() => addProductId(product.id)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.mainImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60'}
                          alt={product.name}
                          className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-slate-200"
                        />
                        <div>
                          <p className="text-[11px] font-black text-blue-600 uppercase tracking-wider">
                            {product.brandName || 'TECHVAULT'} • {product.categoryName}
                          </p>
                          <p className="text-xs font-bold text-slate-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs font-black text-slate-900 font-mono">{formatCurrency(product.salePrice || product.price)}</p>
                        </div>
                      </div>

                      <button className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-lg text-xs transition-all shadow-sm">
                        + Add
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ComparePage;
