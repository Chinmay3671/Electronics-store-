import React, { useState } from 'react';
import { recommendationApi } from '../api/featuresApi';
import { formatINR } from '../utils/currency';
import { useCart } from '../context/CartContext';
import {
  Sparkles,
  CheckCircle2,
  Cpu,
  Laptop,
  Smartphone,
  Headphones,
  Tv,
  Zap,
  ArrowRight,
  RotateCcw,
  Check,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProductFinderPage = () => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('laptops');
  const [budget, setBudget] = useState(100000);
  const [selectedUsages, setSelectedUsages] = useState(['gaming', 'college']);
  const [ram, setRam] = useState(16);
  const [brandPreference, setBrandPreference] = useState('any');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { addToCart } = useCart();

  const categories = [
    { id: 'laptops', name: 'Laptops', icon: Laptop, desc: 'Gaming, Creator, Workstation' },
    { id: 'smartphones', name: 'Smartphones', icon: Smartphone, desc: 'Flagship, Camera, 5G' },
    { id: 'headphones', name: 'Audio / Headphones', icon: Headphones, desc: 'ANC, Spatial Audio' },
    { id: 'pc-components', name: 'PC Components', icon: Cpu, desc: 'CPUs, GPUs, RAM, PSUs' },
    { id: 'tvs', name: 'Smart / OLED TVs', icon: Tv, desc: '4K/8K High Refresh Rate' },
  ];

  const usageOptions = [
    { id: 'gaming', label: 'High FPS Gaming & Ray Tracing' },
    { id: 'college', label: 'College, Coding & Software Development' },
    { id: 'video-editing', label: '4K/8K Video Editing & 3D Rendering' },
    { id: 'office', label: 'Office Productivity & Multitasking' },
    { id: 'battery', label: 'All-Day Battery Life & Portability' },
  ];

  const toggleUsage = (id) => {
    if (selectedUsages.includes(id)) {
      setSelectedUsages(selectedUsages.filter((u) => u !== id));
    } else {
      setSelectedUsages([...selectedUsages, id]);
    }
  };

  const handleCalculateRecommendations = async () => {
    setLoading(true);
    try {
      const res = await recommendationApi.getRecommendations({
        category,
        budget,
        usage: selectedUsages,
        ram,
        brandPreference,
      });

      if (res.success) {
        setResults(res);
        setStep(5); // Show results
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setResults(null);
  };

  return (
    <div className="bg-slate-100 min-h-screen py-6 text-slate-800">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-8">
        
        {/* Header Banner */}
        <div className="text-center space-y-3 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Smart Product Advisor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Find Your Perfect Electronics Match
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Answer 3 simple questions on your budget and requirements. Our rule-based advisor matches the exact right tech.
          </p>
        </div>

        {/* Step Indicator Progress Bar */}
        {step < 5 && (
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
              <span>Step {step} of 4</span>
              <span>{step === 1 ? 'Select Category' : step === 2 ? 'Define Budget' : step === 3 ? 'Primary Usage' : 'Specifications'}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 text-center">
              What device or component are you looking for?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{cat.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
              >
                Next: Set Budget <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Budget */}
        {step === 2 && (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 text-center">
              What is your maximum target budget?
            </h3>

            <div className="max-w-md mx-auto space-y-6 text-center">
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block mb-1 font-semibold">Selected Budget</span>
                <span className="text-3xl sm:text-4xl font-black text-blue-600 font-mono">
                  {formatINR(budget)}
                </span>
              </div>

              <input
                type="range"
                min="20000"
                max="350000"
                step="10000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />

              <div className="flex justify-between text-xs text-slate-500 font-bold font-mono">
                <span>₹20,000 (Entry)</span>
                <span>₹1,50,000 (Mid-High)</span>
                <span>₹3,50,000+ (Ultra Pro)</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
              >
                Next: Select Usage <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Primary Usages */}
        {step === 3 && (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 text-center">
              How do you plan to use this device? (Select all that apply)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
              {usageOptions.map((opt) => {
                const isSelected = selectedUsages.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleUsage(opt.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-semibold">{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
              >
                Next: Hardware Preferences <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Hardware Specs & Brand Preference */}
        {step === 4 && (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 text-center">
              Hardware & Brand Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Target RAM</label>
                <select
                  value={ram}
                  onChange={(e) => setRam(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm font-semibold"
                >
                  <option value={8}>8 GB (General Use)</option>
                  <option value={16}>16 GB (Recommended for Gaming & Coding)</option>
                  <option value={32}>32 GB (Heavy Multitasking & Video Editing)</option>
                  <option value={64}>64 GB+ (Extreme Workstation)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Brand Preference</label>
                <select
                  value={brandPreference}
                  onChange={(e) => setBrandPreference(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm font-semibold"
                >
                  <option value="any">Any Top Certified Brand</option>
                  <option value="apple">Apple</option>
                  <option value="asus">ASUS / ROG</option>
                  <option value="samsung">Samsung</option>
                  <option value="dell">Dell</option>
                  <option value="sony">Sony</option>
                  <option value="lenovo">Lenovo</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleCalculateRecommendations}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {loading ? 'Analyzing Matches...' : 'Find My Matches'}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Recommendation Results Matrix */}
        {step === 5 && results && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  {results.querySummary}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Matches scored based on your ₹{budget.toLocaleString('en-IN')} budget, {ram}GB RAM, and usage criteria.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Start Over
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.recommendations.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-sm hover:shadow-md space-y-4"
                >
                  <div>
                    {/* Match Score Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" /> {item.matchScore}% Match Score
                      </span>
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-slate-900">{item.rating || '4.8'}</span>
                      </span>
                    </div>

                    <div className="aspect-video rounded-xl bg-slate-50 mb-3 overflow-hidden flex items-center justify-center p-2 border border-slate-100">
                      <img src={item.mainImage} alt={item.name} className="max-h-full object-contain" />
                    </div>

                    <Link to={`/products/${item.id}`} className="block">
                      <h4 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
                        {item.name}
                      </h4>
                    </Link>

                    {/* Match Reasons List */}
                    <div className="mt-3 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <p className="text-[11px] font-black text-blue-700 uppercase tracking-wider">
                        Why this fits:
                      </p>
                      {item.matchReasons.map((reason, idx) => (
                        <p key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">Offer Price</span>
                      <span className="text-lg font-black text-slate-900 font-mono">{formatINR(item.price)}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/products/${item.id}`}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => addToCart(item.id, 1)}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black shadow-sm cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductFinderPage;
