import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/featuresApi';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/formatDate';
import { Users, Search, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [page, searchTerm]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCustomers({
        page,
        size: 15,
        search: searchTerm || undefined,
      });
      if (res.data?.success) {
        setCustomers(res.data.data?.content || []);
        setTotalPages(res.data.data?.totalPages || 0);
        setTotalElements(res.data.data?.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-cyan-400" /> Customer Account Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered customer accounts, orders velocity, and lifetime shopping volume.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl overflow-hidden backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="text-slate-400 uppercase tracking-wider bg-slate-900/60 border-b border-slate-700/60">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Account Role</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4 text-right">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customers.length > 0 ? (
                  customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-black">
                          {c.fullName?.charAt(0) || 'U'}
                        </div>
                        {c.fullName}
                      </td>
                      <td className="p-4 text-slate-300">
                        <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                          <Mail className="w-3 h-3" /> {c.email}
                        </div>
                        {c.phone && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono mt-0.5">
                            <Phone className="w-3 h-3" /> {c.phone}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          c.roles?.includes('ROLE_ADMIN')
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {c.roles?.join(', ') || 'ROLE_USER'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-[11px]">
                        {formatDate(c.createdAt)}
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        {c.orderCount || 0} orders
                      </td>
                      <td className="p-4 font-mono font-extrabold text-cyan-400 text-right">
                        {formatCurrency(c.totalSpent || 0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No customer accounts matched.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Page <span className="font-bold text-white">{page + 1}</span> of {Math.max(1, totalPages)}
            </span>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCustomersPage;
