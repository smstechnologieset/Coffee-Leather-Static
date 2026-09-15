export async function processPayment({
  amount,
  currency = 'USD',
  method = 'credit_card',
  referenceId,
}: {
  amount: number;
  currency?: string;
  method?: string;
  referenceId?: string;
}): Promise<{ success: boolean; transactionId?: string; amount?: number; currency?: string; error?: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate success
  return {
    success: true,
    transactionId: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    amount,
    currency,
  };
}
