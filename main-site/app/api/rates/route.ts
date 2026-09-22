import { NextResponse } from 'next/server';

// Currencies KIJIJ International cares about
const CURRENCIES = ['ETB', 'EUR', 'GBP', 'JPY', 'AED', 'SAR', 'CNY', 'CAD', 'CHF'];

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // open.er-api.com — free, no API key, supports ETB, CORS-safe server-side
    const res = await fetch(
      `https://open.er-api.com/v6/latest/USD`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error(`External API responded with ${res.status}`);

    const data = await res.json();

    if (data.result !== 'success') {
      throw new Error('API returned an error result');
    }

    // Filter to only the currencies we need
    const filtered: Record<string, number> = { USD: 1 };
    for (const code of CURRENCIES) {
      if (data.rates[code]) {
        filtered[code] = data.rates[code];
      }
    }

    return NextResponse.json({
      rates: filtered,
      base: 'USD',
      time_last_update_utc: data.time_last_update_utc,
    });
  } catch (err) {
    console.error('[/api/rates] Failed to fetch exchange rates:', err);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 502 }
    );
  }
}
