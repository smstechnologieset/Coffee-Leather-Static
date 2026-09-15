'use server';

import { createAdminClient } from '@/lib/supabase-server';
import { z } from 'zod';

const ContactSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters').max(100),
  email:   z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Validate
  const raw = {
    name:    formData.get('name'),
    email:   formData.get('email'),
    message: formData.get('message'),
  };

  const result = ContactSchema.safeParse(raw);
  if (!result.success) {
    return {
      status: 'error',
      message: 'Please fix the errors below.',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = result.data;

  try {
    const supabase = createAdminClient();

    // Insert into contact_submissions
    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert({ name, email, message });

    if (insertError) {
      console.error('[contact] Insert error:', insertError);
      return {
        status: 'error',
        message: 'Something went wrong. Please try again or email us directly.',
      };
    }

    // Log mock notification (no real email sent)
    await supabase.from('notifications').insert({
      event_type: 'contact_form_submission',
      recipient:  'info@highlandroots.example.com', // [MOCK]
      subject:    `New contact form message from ${name}`,
      body:       `From: ${name} <${email}>\n\n${message}`,
      metadata:   { name, email, mock: true },
    });

    console.log(`[contact] MOCK: notification logged for message from ${email}`);

    return {
      status: 'success',
      message: `Thank you, ${name}! We've received your message and will be in touch shortly.`,
    };
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return {
      status: 'error',
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
