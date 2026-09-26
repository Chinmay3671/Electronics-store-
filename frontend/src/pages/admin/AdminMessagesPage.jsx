import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/featuresApi';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../context/ToastContext';
import { Mail, CheckCircle2, Clock, Trash2, MessageSquare, Reply } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const { addToast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getMessages({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      if (res.data?.success) {
        setMessages(res.data.data?.content || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminApi.updateMessageStatus(id, { status });
      addToast(`Message marked as ${status}!`, 'success');
      fetchMessages();
    } catch (err) {
      addToast('Failed to update message status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      await adminApi.deleteMessage(id);
      addToast('Message deleted.', 'info');
      fetchMessages();
    } catch (err) {
      addToast('Failed to delete message', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Mail className="w-8 h-8 text-cyan-400" /> Customer Inquiries & CRM Tickets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Incoming customer messages, technical PC build inquiries, and support requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : messages.length === 0 ? (
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-12 text-center max-w-md mx-auto my-8">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Inquiries Found</h3>
          <p className="text-xs text-slate-400 mt-1">Customer support inbox is currently clear.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bg-slate-800/60 border rounded-2xl p-5 flex flex-col justify-between gap-4 backdrop-blur-md transition-all ${
                m.status === 'PENDING' ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/5' : 'border-slate-700/60 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{m.name}</span>
                    <a href={`mailto:${m.email}`} className="text-xs text-cyan-400 font-mono hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {m.email}
                    </a>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    m.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {m.status || 'PENDING'}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-200 mb-1 font-mono">Subject: {m.subject}</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {m.message}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatDate(m.createdAt)}
                </span>

                <div className="flex items-center gap-2">
                  {m.status !== 'RESOLVED' ? (
                    <button
                      onClick={() => handleUpdateStatus(m.id, 'RESOLVED')}
                      className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 rounded-lg text-xs font-bold transition-all border border-emerald-500/20 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(m.id, 'PENDING')}
                      className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                    >
                      Reopen
                    </button>
                  )}

                  <a
                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                    className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Reply className="w-3.5 h-3.5" /> Reply Email
                  </a>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminMessagesPage;
