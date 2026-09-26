import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi, categoryApi, brandApi } from '../api/productApi';
import { ProductGrid, Pagination } from '../components/product/ProductGrid';
import { Filter, X, SlidersHorizontal, RotateCcw, Search, Star, Layers, Cpu } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../utils/mockCatalog';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, size: 16, totalPages: 1, totalElements: MOCK_PRODUCTS.length });
  const [loading, setLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States from URL or Defaults
  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedBrand = searchParams.get('brand') || 'all';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const status = searchParams.get('status') || 'all';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const page = parseInt(searchParams.get('page') || '0', 10);

  const [priceRange, setPriceRange] = useState(maxPrice || 350000);

  useEffect(() => {
    categoryApi.getAll()
      .then(res => {
        const data = res?.data || res;
        if (Array.isArray(data) && data.length > 0) setCategories(data);
      })
      .catch(console.warn);

    brandApi.getAll()
      .then(res => {
        const data = res?.data || res;
        if (Array.isArray(data) && data.length > 0) setBrands(data);
      })
      .catch(console.warn);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        search: search || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        brand: selectedBrand !== 'all' ? selectedBrand : undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        status: status !== 'all' ? status : undefined,
        sortBy,
        page,
        size: 16,
      };

      const res = await productApi.getProducts(params);
      const data = res?.data || res;
      const prods = data?.content || (Array.isArray(data) ? data : null);

      if (prods && prods.length > 0) {
        setProducts(prods);
        if (data?.totalPages) {
          setPagination({
            page: data.number || 0,
            size: data.size || 16,
            totalPages: data.totalPages,
            totalElements: data.totalElements,
          });
        }
      } else {
        // Fallback filter over mock catalog
        applyClientFilter();
      }
    } catch (err) {
      console.warn('Backend note, applying local filter:', err);
      applyClientFilter();
    } finally {
      setLoading(false);
    }
  };

  const applyClientFilter = () => {
    let filtered = [...MOCK_PRODUCTS];

    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brandName?.toLowerCase().includes(search.toLowerCase()) ||
        p.categoryName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => (p.categoryName || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => (p.brandName || '').toLowerCase() === selectedBrand.toLowerCase());
    }

    if (maxPrice) {
      filtered = filtered.filter(p => (p.salePrice || p.price) <= Number(maxPrice));
    }

    setProducts(filtered);
    setPagination({ page: 0, size: 16, totalPages: 1, totalElements: filtered.length });
  };

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.delete('page');
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange(350000);
  };

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 py-6">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        
        {/* Title and Controls Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
              <Layers className="w-7 h-7 text-blue-600" />
              {selectedCategory !== 'all' ? selectedCategory : 'All Electronics & Hardware'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing <span className="text-blue-600 font-bold">{products.length}</span> electronics products with 100% verified warranty.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => updateParam('sortBy', e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer shadow-sm"
            >
              <option value="newest">Sort by: Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Customer Ratings</option>
            </select>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border border-slate-300 text-slate-700 flex items-center gap-1.5 text-xs font-semibold shadow-sm"
            >
              <Filter className="w-4 h-4 text-blue-600" /> Filters
            </button>
          </div>
        </div>

        {/* Main Grid: Filters Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filter Hardware
              </h3>
              <button
                onClick={clearFilters}
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Categories */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Category</label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => updateParam('category', 'all')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-bold ${
                    selectedCategory === 'all'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateParam('category', c.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between ${
                      selectedCategory.toLowerCase() === c.name.toLowerCase()
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Max Budget Slider */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700">Max Budget</span>
                <span className="font-black text-blue-600 font-mono">{formatCurrency(priceRange)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="350000"
                step="5000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                onMouseUp={() => updateParam('maxPrice', priceRange)}
                onTouchEnd={() => updateParam('maxPrice', priceRange)}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Customer Rating Filter */}
            <div className="border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Minimum Rating</label>
              <div className="space-y-1 text-xs">
                {[4, 3].map((r) => (
                  <button
                    key={r}
                    onClick={() => updateParam('minRating', minRating === r.toString() ? '' : r.toString())}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                      minRating === r.toString()
                        ? 'bg-amber-50 text-amber-800 font-bold border border-amber-300'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {r} Stars & Above
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 space-y-6">
            <ProductGrid products={products} loading={loading} />
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductsPage;
