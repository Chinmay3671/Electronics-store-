import React, { useState, useEffect } from 'react';
import { productApi } from '../api/productApi';
import { compatibilityApi } from '../api/featuresApi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/currency';
import {
  Cpu, HardDrive, Zap, Box, Disc, ShieldCheck, AlertTriangle,
  CheckCircle2, Plus, Trash2, ShoppingCart, RefreshCw, Layers, Monitor
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PC_SLOTS = [
  { id: 'cpu', name: 'Processor (CPU)', icon: Cpu, category: 'PC Components', specFilter: 'Processor' },
  { id: 'motherboard', name: 'Motherboard', icon: Layers, category: 'PC Components', specFilter: 'Motherboard' },
  { id: 'ram', name: 'RAM (Memory)', icon: Disc, category: 'PC Components', specFilter: 'RAM' },
  { id: 'gpu', name: 'Graphics Card (GPU)', icon: Monitor, category: 'PC Components', specFilter: 'GPU' },
  { id: 'storage', name: 'Primary Storage (SSD)', icon: HardDrive, category: 'PC Components', specFilter: 'Storage' },
  { id: 'psu', name: 'Power Supply Unit (PSU)', icon: Zap, category: 'PC Components', specFilter: 'Power' },
  { id: 'case', name: 'Cabinet / Chassis', icon: Box, category: 'PC Components', specFilter: 'Case' },
  { id: 'cooler', name: 'CPU Cooler', icon: RefreshCw, category: 'PC Components', specFilter: 'Cooler' }
];

const PcBuilderPage = () => {
  const [build, setBuild] = useState({
    cpu: null,
    motherboard: null,
    ram: null,
    gpu: null,
    storage: null,
    psu: null,
    case: null,
    cooler: null,
  });

  const [activeSlot, setActiveSlot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [compatibility, setCompatibility] = useState({ compatible: true, issues: [], warnings: [], estimatedWattage: 0 });
  const [checkingCompat, setCheckingCompat] = useState(false);

  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    // Load catalog products for PC Components & Gaming
    setLoadingCatalog(true);
    productApi.getProducts({ size: 100 })
      .then(res => {
        if (res.data?.success) {
          const prods = res.data.data?.content || [];
          setCatalog(prods);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingCatalog(false));
  }, []);

  // Recalculate compatibility whenever build components change
  useEffect(() => {
    const selectedIds = Object.values(build).filter(Boolean).map(p => p.id);
    if (selectedIds.length === 0) {
      setCompatibility({ compatible: true, issues: [], warnings: [], estimatedWattage: 0 });
      return;
    }

    setCheckingCompat(true);
    compatibilityApi.check({ productIds: selectedIds })
      .then(res => {
        if (res.data?.success) {
          setCompatibility(res.data.data);
        }
      })
      .catch(() => {
        // Fallback client-side rule evaluation if offline
        evaluateClientSideCompatibility();
      })
      .finally(() => setCheckingCompat(false));
  }, [build]);

  const evaluateClientSideCompatibility = () => {
    const issues = [];
    const warnings = [];
    let wattage = 150; // base system wattage

    // Get specs helper
    const getSpec = (prod, key) => prod?.specifications?.find(s => s.specName.toLowerCase().includes(key.toLowerCase()))?.specValue;

    if (build.cpu) wattage += 125;
    if (build.gpu) wattage += 250;
    if (build.ram) wattage += 15;
    if (build.storage) wattage += 10;

    // Check CPU & Motherboard socket
    if (build.cpu && build.motherboard) {
      const cpuSocket = getSpec(build.cpu, 'socket') || (build.cpu.name.includes('Intel') ? 'LGA1700' : 'AM5');
      const mbSocket = getSpec(build.motherboard, 'socket') || (build.motherboard.name.includes('Intel') || build.motherboard.name.includes('Z790') || build.motherboard.name.includes('B760') ? 'LGA1700' : 'AM5');
      
      if (cpuSocket.toUpperCase() !== mbSocket.toUpperCase()) {
        issues.push(`CPU socket (${cpuSocket}) does not match Motherboard socket (${mbSocket}).`);
      }
    }

    // Check RAM type
    if (build.ram && build.motherboard) {
      const ramType = build.ram.name.includes('DDR4') ? 'DDR4' : 'DDR5';
      const mbType = build.motherboard.name.includes('DDR4') ? 'DDR4' : 'DDR5';
      if (ramType !== mbType) {
        issues.push(`Motherboard expects ${mbType} memory, but selected RAM is ${ramType}.`);
      }
    }

    // Check PSU wattage
    if (build.psu) {
      const psuWattage = parseInt(getSpec(build.psu, 'watt') || (build.psu.name.match(/(\d+)W/i)?.[1] || '650'));
      if (psuWattage < wattage + 100) {
        warnings.push(`Recommended PSU is at least ${wattage + 100}W for headroom. Selected PSU is ${psuWattage}W.`);
      }
    }

    setCompatibility({
      compatible: issues.length === 0,
      issues,
      warnings,
      estimatedWattage: wattage,
    });
  };

  const selectComponent = (product) => {
    if (!activeSlot) return;
    setBuild(prev => ({ ...prev, [activeSlot]: product }));
    setModalOpen(false);
    setActiveSlot(null);
    setSearchQuery('');
  };

  const removeComponent = (slotId) => {
    setBuild(prev => ({ ...prev, [slotId]: null }));
  };

  const clearBuild = () => {
    setBuild({
      cpu: null,
      motherboard: null,
      ram: null,
      gpu: null,
      storage: null,
      psu: null,
      case: null,
      cooler: null,
    });
  };

  const totalPrice = Object.values(build).reduce((sum, p) => sum + (p ? (p.salePrice || p.price) : 0), 0);
  const selectedCount = Object.values(build).filter(Boolean).length;

  const handleAddRigToCart = async () => {
    const selected = Object.values(build).filter(Boolean);
    if (selected.length === 0) {
      addToast('Please select at least one component for your PC build.', 'error');
      return;
    }
    for (const item of selected) {
      await addToCart(item, 1);
    }
    addToast(`Added ${selected.length} PC components to your cart!`, 'success');
  };

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 py-6">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 shadow-sm">
                <Cpu className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Custom PC Builder</h1>
                <p className="text-slate-500 text-xs mt-0.5">
                  Pick components with automated real-time socket, DDR, & wattage compatibility checks.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedCount > 0 && (
              <button
                onClick={clearBuild}
                className="px-4 py-2 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl text-xs font-bold transition-all border border-slate-300 shadow-sm cursor-pointer"
              >
                Reset Build
              </button>
            )}
            <button
              onClick={handleAddRigToCart}
              disabled={selectedCount === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-40 text-slate-950 font-black rounded-xl text-xs transition-all shadow-sm cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" /> Add Full Build to Cart ({selectedCount})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Component Slots */}
          <div className="lg:col-span-2 space-y-3">
            {PC_SLOTS.map((slot) => {
              const selectedItem = build[slot.id];
              const IconComponent = slot.icon;

              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedItem
                      ? 'bg-white border-blue-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-xl ${selectedItem ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          {slot.name}
                        </span>
                        {selectedItem ? (
                          <div className="mt-0.5">
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{selectedItem.name}</h4>
                            <p className="text-xs font-bold text-blue-600 font-mono">{formatCurrency(selectedItem.salePrice || selectedItem.price)}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No component selected</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedItem ? (
                        <>
                          <button
                            onClick={() => {
                              setActiveSlot(slot.id);
                              setModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Change
                          </button>
                          <button
                            onClick={() => removeComponent(slot.id)}
                            className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Remove component"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveSlot(slot.id);
                            setModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Choose {slot.name.split(' ')[0]}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Col: Rig Specs, Compatibility & Price Summary */}
          <div className="space-y-6">
            
            {/* Compatibility Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" /> Compatibility Status
                </h3>
                {checkingCompat && <span className="text-xs text-slate-500 animate-pulse font-bold">Checking...</span>}
              </div>

              {selectedCount === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                  Select PC components to verify hardware compatibility.
                </div>
              ) : compatibility.compatible && compatibility.issues?.length === 0 ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">100% Compatible</h4>
                    <p className="text-[11px] text-emerald-700 mt-1">
                      Sockets, DDR standard, and power parameters verify without conflict.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-900">Compatibility Alert</h4>
                    <ul className="text-[11px] text-rose-700 mt-1 space-y-1 list-disc list-inside">
                      {compatibility.issues?.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Warnings if any */}
              {compatibility.warnings?.length > 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1 font-medium">
                  {compatibility.warnings.map((w, i) => (
                    <p key={i}>⚠️ {w}</p>
                  ))}
                </div>
              )}

              {/* Power Estimation */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold">
                  <Zap className="w-4 h-4 text-amber-500" /> Estimated Power:
                </div>
                <span className="text-sm font-black text-slate-900 font-mono">
                  ~{compatibility.estimatedWattage || 0} Watts
                </span>
              </div>
            </div>

            {/* Price Summary Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900 mb-4">Build Summary</h3>

              <div className="space-y-2 mb-4 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Selected Components</span>
                  <span className="text-slate-900 font-bold">{selectedCount} of 8</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Assembly Support</span>
                  <span className="text-emerald-700 font-bold">Free Assistance</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-emerald-700 font-bold">Free Insured Delivery</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between mb-6">
                <span className="text-sm font-bold text-slate-700">Total Price:</span>
                <span className="text-2xl font-black text-slate-900 font-mono">{formatCurrency(totalPrice)}</span>
              </div>

              <button
                onClick={handleAddRigToCart}
                disabled={selectedCount === 0}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-40 text-slate-950 font-black rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" /> Add All Components to Cart
              </button>
            </div>

          </div>

        </div>

        {/* Component Picker Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  Select {PC_SLOTS.find(s => s.id === activeSlot)?.name}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <input
                type="text"
                placeholder="Search by brand, model, speed, capacity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 mb-4 shadow-sm"
                autoFocus
              />

              <div className="max-h-96 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {catalog
                  .filter(p => {
                    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        (p.brandName || '').toLowerCase().includes(searchQuery.toLowerCase());
                    return matchSearch;
                  })
                  .map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer"
                      onClick={() => selectComponent(product)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.mainImage || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60'}
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
                        Select
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

export default PcBuilderPage;
