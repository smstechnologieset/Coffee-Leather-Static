'use client';

import { useActionState } from 'react';
import { submitContactForm, type ContactFormState } from './actions';
import { Check, AlertCircle, ArrowRight } from 'lucide-react';

const initial: ContactFormState = { status: 'idle' };

export default function ContactForm() {
  const [state, action, isPending] = useActionState(submitContactForm, initial);

  if (state.status === 'success') {
    return (
      <div className="py-12 space-y-4 border border-neutral-200 bg-neutral-50 rounded-xs p-8 text-center">
        <div className="w-12 h-12 rounded-xs border border-primary-500/30 bg-primary-100 flex items-center justify-center text-primary-700 mx-auto">
          <Check size={24} />
        </div>
        <h3 className="text-2xl font-serif font-normal text-neutral-950">Inquiry Received</h3>
        <p className="text-neutral-600 text-sm max-w-md mx-auto leading-relaxed font-light">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6" id="contact-form" noValidate>
      {/* Global error */}
      {state.status === 'error' && state.message && !state.fieldErrors && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xs text-red-800 text-xs">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{state.message}</span>
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider font-semibold text-neutral-600">
          Full Name <span className="text-primary-700">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Jane Smith"
          className={`w-full px-4 py-3.5 rounded-xs border text-sm text-neutral-950
                      placeholder:text-neutral-400 focus:outline-none focus:border-primary-700
                      focus:ring-1 focus:ring-primary-700 bg-white transition-colors
                      ${state.fieldErrors?.name ? 'border-red-400' : 'border-neutral-300'}`}
        />
        {state.fieldErrors?.name && (
          <p className="text-red-700 text-xs">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider font-semibold text-neutral-600">
          Email Address <span className="text-primary-700">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="jane@company.com"
          className={`w-full px-4 py-3.5 rounded-xs border text-sm text-neutral-950
                      placeholder:text-neutral-400 focus:outline-none focus:border-primary-700
                      focus:ring-1 focus:ring-primary-700 bg-white transition-colors
                      ${state.fieldErrors?.email ? 'border-red-400' : 'border-neutral-300'}`}
        />
        {state.fieldErrors?.email && (
          <p className="text-red-700 text-xs">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider font-semibold text-neutral-600">
          Message & Requirements <span className="text-primary-700">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Describe your commodities interest, volume requirements, or questions for our trade team..."
          className={`w-full px-4 py-3.5 rounded-xs border text-sm text-neutral-950
                      placeholder:text-neutral-400 focus:outline-none focus:border-primary-700
                      focus:ring-1 focus:ring-primary-700 bg-white transition-colors resize-none
                      ${state.fieldErrors?.message ? 'border-red-400' : 'border-neutral-300'}`}
        />
        {state.fieldErrors?.message && (
          <p className="text-red-700 text-xs">{state.fieldErrors.message[0]}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          id="contact-submit"
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2.5 px-8 py-4
                     bg-primary-700 hover:bg-primary-600 disabled:bg-neutral-300
                     text-white text-xs uppercase tracking-[0.16em] font-semibold rounded-xs
                     transition-colors duration-150 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Transmitting Inquiry…</span>
            </>
          ) : (
            <>
              <span>Send Trade Inquiry</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
