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
  EBAY15: 0.15,
  EBAY20: 0.15,
  WELCOME10: 0.10
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
    const {
      items, promoCode, country, state, email, metadata,
      // shipping address — passed through so the webhook can print it on the
      // "SHIP THIS ORDER" email. Safe to omit; they just won't appear in metadata.
      address, city, zipcode
    } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }
    if (items.length > 50) {
      return res.status(400).json({ error: 'Too many items in cart.' });
    }

    // --- Recompute totals server-side (mirrors index.html cartTotals) ---
    let base = 0;
    let multiDiscountRaw = 0;
    for (const item of items) {
      const price = unitPrice(item);
      if (!price) {
        return res.status(400).json({ error: 'Unknown product in cart.' });
      }
      const qty = Math.max(1, Math.min(10, parseInt(item.qty, 10) || 1));
      base += r2(price * qty);
      // Multi-unit discount: first unit full price, each ADDITIONAL unit 10% off
      multiDiscountRaw += r2(price * 0.10 * (qty - 1));
    }
    base = r2(base);
    multiDiscountRaw = r2(multiDiscountRaw);

    // --- ONE discount at a time ---
    // A valid promo code wins and the multi-unit discount does NOT stack on top.
    // (This matches what the browser/checkout already shows, so the charge,
    //  the on-screen total, and the email all agree.)
    const code = String(promoCode || '').trim().toUpperCase();
    const promoRate = (code && PROMO_CODES[code]) ? PROMO_CODES[code] : 0;

    let multiDiscount = 0;
    let promoDiscount = 0;
    if (promoRate > 0) {
      promoDiscount = r2(base * promoRate);
    } else {
      multiDiscount = multiDiscountRaw;
    }

    const discountedSubtotal = r2(base - multiDiscount - promoDiscount);

    const isUSA = !country || country === 'US';
    // Treble Hook Cover-only orders always ship free in the US
    const onlyHookCovers = items.every((i) => Number(i.id) === 8);
    const promoUsed = promoRate > 0;
    // Free shipping over $65 applies ONLY when no promo code is used.
    // A promo code and free shipping do not stack.
    const shipping = isUSA
      ? (onlyHookCovers ? 0 : ((!promoUsed && discountedSubtotal >= 65) ? 0 : 9.95))
      : 60.0;

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
        email: email || '',
        promoCode: code || '',
        country: country || 'US',
        state: st,
        address: String(address || '').slice(0, 200),
        city: String(city || '').slice(0, 100),
        zipcode: String(zipcode || '').slice(0, 20),
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
