'use client';

import { useActionState } from 'react';
import { submitContactForm, type ContactFormState } from './actions';
import { CheckCircle, AlertCircle, Send } from 'lucide-react';

const initial: ContactFormState = { status: 'idle' };

export default function ContactForm() {
  const [state, action, isPending] = useActionState(submitContactForm, initial);

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center">
          <CheckCircle size={32} className="text-accent-600" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-neutral-900">Message Sent!</h3>
        <p className="text-neutral-600 max-w-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6" id="contact-form" noValidate>
      {/* Global error */}
      {state.status === 'error' && state.message && !state.fieldErrors && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          {state.message}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="contact-name" className="block text-sm font-semibold text-neutral-700">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Jane Smith"
          className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900
                      placeholder:text-neutral-400 focus:outline-none focus:ring-2
                      focus:ring-primary-500 focus:border-transparent transition-all
                      ${state.fieldErrors?.name ? 'border-red-400' : 'border-neutral-200'}`}
        />
        {state.fieldErrors?.name && (
          <p className="text-red-600 text-xs">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="contact-email" className="block text-sm font-semibold text-neutral-700">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="jane@company.com"
          className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900
                      placeholder:text-neutral-400 focus:outline-none focus:ring-2
                      focus:ring-primary-500 focus:border-transparent transition-all
                      ${state.fieldErrors?.email ? 'border-red-400' : 'border-neutral-200'}`}
        />
        {state.fieldErrors?.email && (
          <p className="text-red-600 text-xs">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="block text-sm font-semibold text-neutral-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your company, what you're looking for, and any questions you have..."
          className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900
                      placeholder:text-neutral-400 focus:outline-none focus:ring-2
                      focus:ring-primary-500 focus:border-transparent transition-all resize-none
                      ${state.fieldErrors?.message ? 'border-red-400' : 'border-neutral-200'}`}
        />
        {state.fieldErrors?.message && (
          <p className="text-red-600 text-xs">{state.fieldErrors.message[0]}</p>
        )}
      </div>

      <button
        id="contact-submit"
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-8 py-4
                   bg-primary-500 hover:bg-primary-400 disabled:bg-primary-300
                   text-white font-semibold rounded-xl transition-colors duration-200
                   disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send Message <Send size={16} />
          </>
        )}
      </button>
    </form>
  );
}
