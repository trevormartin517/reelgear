// /api/create-payment-intent.js
// SECURITY: The server computes the charge amount itself from the cart contents.
// It never trusts a dollar amount sent by the browser.

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Single source of truth for pricing. Keep in sync with the products array in index.html.
const PRICES = {
  1: 19.99,  // Garmin Striker 4
  2: 21.99,  // Garmin Striker 4 Plus
  3: 19.99,  // Garmin Echomap 93SV
  4: 24.99,  // Garmin Echomap 106SV
  5: 29.99,  // Garmin Echomap 126SV
  6: 24.99,  // Garmin GPSMAP 1022
  7: 14.99,  // Garmin 73SV/CV
  8: 5.99,   // Treble Hook Covers (16 pack)
  9: 14.99,  // Stake Rod Holder (Dual Pack = 24.99, handled below)
  10: 11.99, // Mountable Rod Holder (2 pack)
  11: 39.99  // Garmin Echomap 162SV
};

const PROMO_CODES = {
  FRIEND20: 0.20,
  EBAY15: 0.15
};

function r2(n) {
  return Math.round(n * 100) / 100;
}

function unitPrice(item) {
  const id = Number(item.id);
  // Stake Rod Holder dual pack is priced differently than single
  if (id === 9 && /dual/i.test(String(item.name || ''))) return 24.99;
  return PRICES[id] || null;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, promoCode, country, state, email, metadata } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }
    if (items.length > 50) {
      return res.status(400).json({ error: 'Too many items in cart.' });
    }

    // --- Recompute totals server-side (mirrors index.html cartTotals) ---
    let base = 0;
    let multiDiscount = 0;
    for (const item of items) {
      const price = unitPrice(item);
      if (!price) {
        return res.status(400).json({ error: 'Unknown product in cart.' });
      }
      const qty = Math.max(1, Math.min(10, parseInt(item.qty, 10) || 1));
      base += r2(price * qty);
      // Multi-unit discount: first unit full price, each ADDITIONAL unit 10% off
      multiDiscount += r2(price * 0.10 * (qty - 1));
    }
    base = r2(base);
    multiDiscount = r2(multiDiscount);

    const merchSubtotal = r2(base - multiDiscount);

    let promoDiscount = 0;
    const code = String(promoCode || '').trim().toUpperCase();
    if (code && PROMO_CODES[code]) {
      promoDiscount = r2(merchSubtotal * PROMO_CODES[code]);
    }

    const discountedSubtotal = r2(merchSubtotal - promoDiscount);

    const isUSA = !country || country === 'US';
    const shipping = isUSA ? (discountedSubtotal >= 60 ? 0 : 9.95) : 60.0;

    // 6% Michigan sales tax — collected only on US orders shipping to Michigan
    const st = String(state || '').trim().toUpperCase();
    const isMI = isUSA && (st === 'MI' || st === 'MICHIGAN');
    const tax = isMI ? r2((discountedSubtotal + shipping) * 0.06) : 0;

    const total = r2(discountedSubtotal + shipping + tax);
    const amount = Math.round(total * 100); // cents

    if (amount < 50) {
      // Stripe minimum charge is $0.50
      return res.status(400).json({ error: 'Order total is too low to process.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      receipt_email: email || undefined,
      metadata: {
        name: (metadata && metadata.name) || '',
        promoCode: code || '',
        country: country || 'US',
        state: st,
        itemsSummary: items
          .map((i) => `${i.qty || 1}x ${String(i.name || i.id).slice(0, 40)}`)
          .join('; ')
          .slice(0, 480),
        subtotal: String(base),
        multiDiscount: String(multiDiscount),
        promoDiscount: String(promoDiscount),
        shipping: String(shipping),
        tax: String(tax)
      }
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      total: total
    });
  } catch (err) {
    console.error('create-payment-intent error:', err);
    return res.status(500).json({ error: 'Payment setup failed. Please try again.' });
  }
};
