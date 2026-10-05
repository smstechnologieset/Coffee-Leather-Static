'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Coffee, Clock } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    inquiryType: 'Sample Request (Green Coffee)',
    targetOrigin: 'Yirgacheffe',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in your name, email address, and message.');
      return;
    }

    setLoading(true);

    try {
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const { error: insertErr } = await supabase.from('contact_submissions').insert({
        source_site: 'coffee',
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        company: formData.company.trim() || null,
        message: `[Purpose: ${formData.inquiryType} | Origin: ${formData.targetOrigin}]\n\n${formData.message.trim()}`,
        status: 'new',
      });

      if (insertErr) {
        console.error('[contact] Supabase error:', insertErr);
        // Fall back gracefully if table not yet migrated
      }
    } catch (err) {
      console.warn('[contact] Submission warning:', err);
    }

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-primary-50/60 border border-primary-200 rounded-2xl p-8 sm:p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary-100 border border-primary-300 text-primary-800 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-neutral-900">
          Inquiry Successfully Received
        </h3>
        <p className="text-neutral-600 text-sm max-w-md mx-auto leading-relaxed">
          Thank you for reaching out to <strong className="text-neutral-900">KIJIJ Coffee</strong>. Your request has been directed to our export desk. Our team will review your specifications and contact you within 24 business hours.
        </p>
        <div className="inline-flex items-center gap-2 text-xs text-primary-700 bg-white px-4 py-2 rounded-full border border-primary-150">
          <Clock className="h-3.5 w-3.5" /> Typical response time: under 1 business day
        </div>
        <div className="pt-4">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '',
                email: '',
                company: '',
                phone: '',
                inquiryType: 'Sample Request (Green Coffee)',
                targetOrigin: 'Yirgacheffe',
                message: '',
              });
            }}
            className="text-xs text-neutral-500 hover:text-primary-800 font-semibold underline underline-offset-2"
          >
            Send another inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Row 1: Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
            Full Name <span className="text-amber-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Marcus Vance"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
            Business Email <span className="text-amber-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="roaster@coffeeco.com"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Row 2: Company & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="company" className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
            Company / Roastery
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="Apex Roasting Works"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 019-2834"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Row 3: Inquiry Type & Target Origin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="inquiryType" className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
            Inquiry Purpose
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
          >
            <option value="Sample Request (Green Coffee)">Sample Request (Green Coffee)</option>
            <option value="Spot Purchase (Container)">Spot Purchase (Container)</option>
            <option value="Annual Supply Agreement">Annual Supply Agreement</option>
            <option value="Quality & Cupping Scores">Quality & Cupping Inquiries</option>
            <option value="General Trade Partnership">General Trade Partnership</option>
          </select>
        </div>

        <div>
          <label htmlFor="targetOrigin" className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
            Primary Origin of Interest
          </label>
          <select
            id="targetOrigin"
            name="targetOrigin"
            value={formData.targetOrigin}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
          >
            <option value="Yirgacheffe">Yirgacheffe (Washed / Natural)</option>
            <option value="Sidamo">Sidamo (Natural / Washed)</option>
            <option value="Guji">Guji (Specialty Natural & Anaerobic)</option>
            <option value="Harar">Harar (Longberry Natural)</option>
            <option value="Limu">Limu (Washed)</option>
            <option value="Jimma">Jimma (Commercial & Specialty)</option>
            <option value="Multiple / Mixed Container">Multiple Origins / Consolidated</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
          Message & Volume Specifications <span className="text-amber-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Please describe your anticipated volume (Quintals, bags, or kg), delivery destination port, target arrival timeframe, or specific cupping profile preferences..."
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-800 hover:bg-primary-900 text-white font-bold px-8 py-3.5 rounded-full text-sm shadow-sm transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send className="h-4 w-4 text-amber-300" />
            Send Inquiry to Coffee Export Desk
          </>
        )}
      </button>
    </form>
  );
}
