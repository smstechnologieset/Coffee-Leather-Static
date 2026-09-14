/**
 * lib/processPayment.ts
 *
 * ⚠️  MOCK PAYMENT — NOT REAL STRIPE
 * This function simulates payment processing during the build phase.
 * It only updates the contract_request status in the database.
 *
 * TODO: Replace this single function with a real Stripe Checkout session
 * when the client's US entity is ready. No other code should need to change.
 *
 * See: /docs/MOCK_DATA.md for the full list of mocked items.
 */

import { createAdminClient } from './supabase-server';

export type PaymentResult =
  | { success: true; contractRequestId: string }
  | { success: false; error: string };

/**
 * processPayment
 *
 * Simulates a successful payment for a contract request.
 * Updates contract_requests.status from 'pending_payment' to 'paid_pending_contract'.
 *
 * @param contractRequestId - The UUID of the contract_request row
 * @returns PaymentResult
 *
 * --- REAL STRIPE REPLACEMENT GUIDE ---
 * 1. Install: npm install stripe @stripe/stripe-js
 * 2. Replace the body of this function with:
 *    - Create a Stripe Checkout session pointing to this contract
 *    - Return the session URL for redirect
 *    - Add a /api/webhooks/stripe route to handle stripe.checkout.session.completed
 *      and THAT webhook should update the DB status (not this function directly)
 * 3. Update the checkout page UI to redirect to Stripe instead of showing the mock button
 */
export async function processPayment(contractRequestId: string): Promise<PaymentResult> {
  // ── MOCK IMPLEMENTATION ────────────────────────────────────────────────────
  // In real Stripe: this would create a Checkout session and return a redirect URL.
  // Here: we just flip the status immediately to simulate a completed payment.

  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('contract_requests')
      .update({
        status: 'paid_pending_contract',
        updated_at: new Date().toISOString(),
      })
      .eq('id', contractRequestId)
      .eq('status', 'pending_payment'); // guard: only update if still pending

    if (error) {
      console.error('[processPayment] Supabase error:', error);
      return { success: false, error: error.message };
    }

    // Mock notification log
    await supabase.from('notifications').insert({
      event_type: 'payment_simulated',
      recipient:  'admin@highlandroots.example.com',
      subject:    `[MOCK] Payment received for contract ${contractRequestId}`,
      body:       `Contract request ${contractRequestId} has been marked as paid (simulated). Awaiting contract document upload.`,
      metadata:   { contractRequestId, mock: true },
    });

    console.log(`[processPayment] MOCK: Payment simulated for contract ${contractRequestId}`);
    return { success: true, contractRequestId };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[processPayment] Unexpected error:', err);
    return { success: false, error: message };
  }
}
