import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { reviewApi } from '../api/featuresApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../utils/currency';
import { formatDate } from '../utils/formatDate';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  Box,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Plus,
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, specs, reviews, warranty
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [prodRes, revRes] = await Promise.all([
          productApi.getProductById(id),
          reviewApi.getByProduct(id),
        ]);

        if (prodRes.success && prodRes.data) {
          setProduct(prodRes.data);
          setActiveImage(prodRes.data.mainImage);
        }
        if (revRes.success && revRes.data) {
          setReviews(revRes.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading Product Specifications..." size="lg" />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-100">Product Not Found</h2>
        <Link to="/products" className="text-brand-400 text-sm mt-2 inline-block">
          Return to Products Catalog
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0 || product.status === 'OUT_OF_STOCK';
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    try {
      await addToCart(product.id, quantity, false);
      navigate('/checkout');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length >= 6) {
      setDeliveryStatus({
        available: true,
        message: 'Delivery available! Estimated delivery within 2–3 business days via BlueDart.',
      });
    } else {
      setDeliveryStatus({
        available: false,
        message: 'Please enter a valid 6-digit postal pincode.',
      });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please log in to submit a review');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await reviewApi.create(product.id, {
        rating: newRating,
        title: newTitle,
        comment: newComment,
      });
      if (res.success) {
        toast.success('Review submitted successfully!');
        setReviews([res.data, ...reviews]);
        setShowReviewModal(false);
        setNewTitle('');
        setNewComment('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen py-6 text-slate-800">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-8">
        
        {/* 1. Main Product Showcase Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Gallery & Zoom Preview */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-200 p-6 flex items-center justify-center overflow-hidden group shadow-inner">
                <img
                  src={activeImage || product.mainImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                
                {product.discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-white" /> {product.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnail Strip */}
              {product.images && product.images.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  <button
                    onClick={() => setActiveImage(product.mainImage)}
                    className={`w-16 h-16 rounded-xl bg-white border p-1 shrink-0 overflow-hidden transition-all ${
                      activeImage === product.mainImage ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={product.mainImage} alt="Main" className="w-full h-full object-contain" />
                  </button>
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img.imageUrl)}
                      className={`w-16 h-16 rounded-xl bg-white border p-1 shrink-0 overflow-hidden transition-all ${
                        activeImage === img.imageUrl ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.imageUrl} alt={`Thumbnail ${i}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Pricing, Purchase Actions & Highlights */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Brand & Stock Status Header */}
              <div className="flex items-center justify-between gap-4">
                <Link
                  to={`/products?brand=${product.brand?.slug}`}
                  className="text-xs font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {product.brand?.name || 'TECHVAULT AUTHENTIC'}
                </Link>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-md ${
                    isOutOfStock
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : isLowStock
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${product.stock} Units Remaining!` : 'In Stock & Ready to Ship'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="font-bold text-slate-900 text-sm">
                    {product.rating ? Number(product.rating).toFixed(1) : '4.8'}
                  </span>
                  <span className="text-slate-600">({product.reviewCount || reviews.length} ratings)</span>
                </div>
                <span>•</span>
                <span>SKU: <strong className="text-slate-800 font-mono">{product.sku}</strong></span>
              </div>

              {/* Pricing Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {formatINR(product.salePrice)}
                  </span>
                  {product.originalPrice > product.salePrice && (
                    <>
                      <span className="text-sm text-slate-400 line-through font-mono">
                        {formatINR(product.originalPrice)}
                      </span>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Save {formatINR(product.originalPrice - product.salePrice)} ({product.discountPercent}% OFF)
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Inclusive of all taxes. Free Express Doorstep Delivery on this item.
                </p>
              </div>

              {/* Quantity Stepper & Buttons */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1 shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="w-8 h-8 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock || isOutOfStock}
                      className="w-8 h-8 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold shadow-sm cursor-pointer ${
                      isFavorited
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-white border-slate-300 text-slate-700 hover:text-rose-600 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{isFavorited ? 'In Wishlist' : 'Add to Wishlist'}</span>
                  </button>

                  <button
                    onClick={() => navigate(`/compare?ids=${product.id}`)}
                    className="p-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    title="Compare with other models"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Compare
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || addingToCart}
                    className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 shadow-sm'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 text-slate-700" />
                    {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`py-3.5 px-6 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md'
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    Buy Now with 1-Click
                  </button>
                </div>
              </div>

              {/* Delivery Pincode Checker */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Truck className="w-4 h-4 text-blue-600" /> Check Delivery & COD Availability
                </div>

                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit Pincode (e.g. 560001)"
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
                    />
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm cursor-pointer"
                  >
                    Verify
                  </button>
                </form>

                {deliveryStatus && (
                  <p
                    className={`text-xs flex items-center gap-1.5 font-semibold ${
                      deliveryStatus.available ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {deliveryStatus.available ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                    {deliveryStatus.message}
                  </p>
                )}
              </div>

              {/* Trust Value Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <span className="font-semibold text-slate-800">{product.warranty || '1 Year Official Warranty'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <RotateCcw className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="font-semibold text-slate-800">7 Days Return Policy</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <Box className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  <span className="font-semibold text-slate-800">Original Box Sealed</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 2. Detailed Tabs Section (Overview, Specifications, Reviews, Warranty) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
            {[
              { key: 'overview', label: 'Overview & Highlights' },
              { key: 'specs', label: 'Technical Specifications' },
              { key: 'reviews', label: `Customer Reviews (${reviews.length})` },
              { key: 'warranty', label: "Warranty & What's in the Box" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="py-6 space-y-6 max-w-4xl">
              <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {product.description || product.shortDescription}
              </div>

              {product.specifications && product.specifications.length > 0 && (
                <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Key Technical Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.specifications.filter(s => s.isHighlighted).map((spec, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-slate-200 text-xs">
                        <span className="text-slate-500 font-medium">{spec.specName}</span>
                        <span className="text-slate-900 font-bold">{spec.specValue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Dynamic Specifications Table */}
          {activeTab === 'specs' && (
            <div className="py-6 max-w-4xl space-y-6">
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                    <tr>
                      <th className="p-3 sm:p-4">Group</th>
                      <th className="p-3 sm:p-4">Specification</th>
                      <th className="p-3 sm:p-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {product.specifications && product.specifications.length > 0 ? (
                      product.specifications.map((spec, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 sm:p-4 text-blue-700 font-bold">{spec.specGroup || 'General'}</td>
                          <td className="p-3 sm:p-4 font-semibold text-slate-600">{spec.specName}</td>
                          <td className="p-3 sm:p-4 text-slate-900 font-bold">{spec.specValue}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="p-6 text-center text-slate-400">
                          No dynamic specifications listed for this product.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Customer Reviews */}
          {activeTab === 'reviews' && (
            <div className="py-6 max-w-4xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Verified Customer Ratings</h3>
                  <p className="text-xs text-slate-500">Only verified purchasers can write verified reviews</p>
                </div>

                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Write Review
                </button>
              </div>

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
                  No reviews yet for this product. Be the first to share your experience!
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-slate-900">{rev.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{formatDate(rev.createdAt)}</span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] font-bold text-slate-600">{rev.userName}</span>
                        {rev.isVerifiedPurchase && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Warranty & Package Details */}
          {activeTab === 'warranty' && (
            <div className="py-6 max-w-4xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-blue-600" /> Manufacturer Warranty Terms
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {product.warranty || '1 Year Comprehensive Manufacturer Warranty. Valid across all authorized service centers in India with original invoice.'}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <Box className="w-5 h-5 text-emerald-600" /> What's in the Box
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {product.whatsInBox || 'Main Device, High-speed charging cable / power adapter, warranty booklet, and serialized quick start guide.'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">Write a Product Review</h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 focus:outline-none cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{newRating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Headline / Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Exceptional gaming speed & cooling"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Review</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  placeholder="Share details on performance, battery, build quality, and real-world usage..."
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
