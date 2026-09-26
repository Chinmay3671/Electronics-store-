import React, { useState, useEffect } from 'react';
import { addressApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';
import {
  MapPin, Plus, Trash2, Edit3, CheckCircle2, Home,
  Briefcase, Star, X
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'HOME',
    isDefault: false
  });
  const { addToast } = useToast();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await addressApi.getAll();
      if (res.data?.success) {
        setAddresses(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (addr = null) => {
    if (addr) {
      setEditingAddress(addr);
      setFormData({
        fullName: addr.fullName || '',
        phone: addr.phone || '',
        addressLine: addr.addressLine || '',
        city: addr.city || '',
        state: addr.state || '',
        pincode: addr.pincode || '',
        landmark: addr.landmark || '',
        addressType: addr.addressType || 'HOME',
        isDefault: addr.isDefault || false
      });
    } else {
      setEditingAddress(null);
      setFormData({
        fullName: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        addressType: 'HOME',
        isDefault: addresses.length === 0
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await addressApi.update(editingAddress.id, formData);
        addToast('Address updated successfully!', 'success');
      } else {
        await addressApi.create(formData);
        addToast('Address added successfully!', 'success');
      }
      setModalOpen(false);
      fetchAddresses();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save address', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this saved address?')) return;
    try {
      await addressApi.delete(id);
      addToast('Address deleted', 'info');
      fetchAddresses();
    } catch (err) {
      addToast('Failed to delete address', 'error');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressApi.setDefault(id);
      addToast('Default delivery address updated!', 'success');
      fetchAddresses();
    } catch (err) {
      addToast('Failed to set default address', 'error');
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 py-6">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-blue-600" />
              Manage Delivery Addresses
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Add home, office, or workshop locations for faster 1-click checkout.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add New Address
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : addresses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto my-8 shadow-sm">
            <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-900 mb-2">No Saved Addresses</h3>
            <p className="text-slate-500 text-xs mb-6">Save delivery destinations to expedite checkout.</p>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-sm"
            >
              + Add First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`bg-white border rounded-2xl p-6 flex flex-col justify-between transition-all shadow-sm ${
                  addr.isDefault
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                      {addr.addressType === 'HOME' && <Home className="w-3.5 h-3.5 text-blue-600" />}
                      {addr.addressType === 'WORK' && <Briefcase className="w-3.5 h-3.5 text-blue-600" />}
                      {addr.addressType || 'HOME'}
                    </span>
                    {addr.isDefault && (
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Default Address
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-slate-900 mb-1">{addr.fullName}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {addr.addressLine}
                    {addr.landmark && `, ${addr.landmark}`}<br />
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-xs text-slate-700 mt-2 font-mono font-medium">📱 {addr.phone}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-bold">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Set as Default
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenModal(addr)}
                      className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add/Edit Address */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Address Line *</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat / House No., Building Name, Street"
                    value={formData.addressLine}
                    onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      placeholder="Near Metro / Landmark"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Address Type</label>
                    <select
                      value={formData.addressType}
                      onChange={(e) => setFormData({ ...formData, addressType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="HOME">HOME</option>
                      <option value="WORK">WORK / OFFICE</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isDefaultCheckbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-0"
                  />
                  <label htmlFor="isDefaultCheckbox" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Set as my default shipping address
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-sm"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AddressesPage;
