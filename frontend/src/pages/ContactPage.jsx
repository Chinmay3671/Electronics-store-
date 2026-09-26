import React, { useState } from 'react';
import { contactApi } from '../api/featuresApi';
import { useToast } from '../context/ToastContext';
import {
  Mail, Phone, MapPin, Send, MessageSquare,
  Clock, ShieldCheck, HelpCircle, CheckCircle2
} from 'lucide-react';

const FAQS = [
  { q: 'How does TechVault guarantee hardware authenticity?', a: 'All products are sourced directly from authorized brand distributors and covered by official manufacturer warranties.' },
  { q: 'What is the PC Compatibility Engine?', a: 'Our automated system checks motherboard sockets, DDR standard, and GPU power requirements to ensure 100% component compatibility before you buy.' },
  { q: 'What are the delivery timelines?', a: 'Standard express dispatch delivers within 2–4 business days across India. Priority VIP dispatch provides next-day arrival.' },
  { q: 'How do returns and warranty replacements work?', a: 'We offer a 7-day hassle-free replacement policy for defective hardware, followed by comprehensive brand warranty support.' }
];

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await contactApi.submit(formData);
      if (res.data?.success) {
        setSubmitted(true);
        addToast('Message sent! Our support team will get back to you shortly.', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 py-6">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
            24/7 Customer Support
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-2">
            Contact TechVault Customer Care
          </h1>
          <p className="text-slate-600 text-sm">
            Have questions about custom PC builds, order shipments, or warranty support? Our hardware specialists are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Support Channels (Left col) */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">Email Support</h3>
              <p className="text-xs text-slate-500 mt-1 mb-2">Direct inquiry line</p>
              <a href="mailto:support@techvault.com" className="text-xs font-bold text-blue-600 hover:underline">
                support@techvault.com
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">Phone Support</h3>
              <p className="text-xs text-slate-500 mt-1 mb-2">Mon - Sat: 9:00 AM - 9:00 PM IST</p>
              <span className="text-xs font-bold text-slate-900 font-mono">
                1800-456-8900 (Toll Free)
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">Headquarters</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                TechVault Cyber Hub, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103
              </p>
            </div>
          </div>

          {/* Form (Right 2 cols) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" /> Send an Inquiry
            </h2>
            <p className="text-xs text-slate-500 mb-6">We typically respond within 2 to 4 business hours.</p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-black text-slate-900">Message Dispatched</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you! Your ticket has been logged in our support CRM. An agent will reply to your email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 shadow-sm"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Order Inquiry / PC Compatibility Help"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
                  <textarea
                    required
                    placeholder="Provide details about your hardware question or order number..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600 h-32"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition-all shadow-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> {submitting ? 'Transmitting...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* FAQ Accordion */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" /> Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-black text-slate-900 mb-1.5 flex items-start gap-2">
                  <span className="text-blue-600 font-bold">Q:</span> {faq.q}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
