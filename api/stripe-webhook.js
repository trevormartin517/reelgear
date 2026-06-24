// /api/stripe-webhook.js
// Stripe calls this server-side when a payment finishes, so the confirmed
// "SHIP THIS ORDER" email no longer depends on the customer's browser.
//
// How it stays secure WITHOUT wrestling with raw-body signature parsing:
// we don't trust the POST body's amount/status. We take the PaymentIntent id
// from the event and re-fetch it straight from Stripe with your secret key.
// A forged event referencing an id that isn't yours simply won't resolve.
// (If you later want signature verification too, say the word and I'll add it.)

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const primaryEmail = 'salesandsupport@reelgearco.com';
const fulfillmentEmail = 'Bearlovesdolly@yahoo.com';

function money(v) {
  const n = Number(v);
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

function addressBlock(m) {
  const street = m.address || '';
  const cityLine = [m.city, m.state, m.zipcode].filter(Boolean).join(', ');
  const block = [street, cityLine].filter(Boolean).join('\n');
  return block || '(address not in this order — check the "Order Submission" email)';
}

function itemsBlock(m) {
  if (!m.itemsSummary) return '(see Stripe dashboard)';
  return m.itemsSummary.split('; ').join('\n');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const event = req.body || {};
  const type = event.type;

  // Only the two events we care about; acknowledge everything else so Stripe
  // doesn't keep retrying.
  if (type !== 'payment_intent.succeeded' && type !== 'payment_intent.payment_failed') {
    return res.status(200).json({ ignored: type || 'unknown' });
  }

  // Works with both Stripe payload styles:
  //  - Snapshot (classic):  event.data.object.id
  //  - Thin (new v2):       event.related_object.id
  const eventObject = (event.data && event.data.object) || event.related_object || {};
  const piId = eventObject.id;
  if (!piId) {
    return res.status(400).json({ error: 'Missing payment intent id' });
  }

  // Authoritative re-fetch from Stripe.
  let pi;
  try {
    pi = await stripe.paymentIntents.retrieve(piId);
  } catch (e) {
    console.error('PaymentIntent retrieve failed:', e.message);
    return res.status(400).json({ error: 'Unknown payment intent' });
  }

  const m = pi.metadata || {};
  const name = m.name || 'Customer';
  const customerEmail = pi.receipt_email || m.email || '';
  const total = money(pi.amount / 100);

  try {
    if (type === 'payment_intent.succeeded') {
      if (pi.status !== 'succeeded') {
        return res.status(200).json({ skipped: 'not succeeded yet' });
      }

      const merchantBody = `NEW ORDER RECEIVED — SHIP THIS ORDER

Customer Details:
Name: ${name}
Email: ${customerEmail}

Shipping Address:
${addressBlock(m)}

Items Ordered:
${itemsBlock(m)}

Promo Code: ${m.promoCode ? m.promoCode : 'None'}
Subtotal: $${money(m.subtotal)}
Multi-unit discount: -$${money(m.multiDiscount)}
Promo discount: -$${money(m.promoDiscount)}
Shipping: $${money(m.shipping)}
Tax: $${money(m.tax)}
TOTAL CHARGED: $${total}

Stripe Payment: ${pi.id}
Received: ${new Date().toLocaleString()}`;

      // Critical email — if this throws we let it 500 so Stripe retries.
      await resend.emails.send({
        from: 'Reel Gear Co <salesandsupport@reelgearco.com>',
        to: [primaryEmail, fulfillmentEmail],
        subject: `🎣 New Order from ${name} - SHIP THIS ORDER`,
        text: merchantBody,
      });

      // Customer confirmation — best effort; never block the order on it.
      if (customerEmail) {
        const customerBody = `Thank you for your order, ${name}!

We've received your payment and will ship soon to:
${addressBlock(m)}

Order Summary:
${itemsBlock(m)}

${m.promoCode ? `Promo Code Applied: ${m.promoCode}\n` : ''}Total: $${total}

Questions? Reply to this email or reach us at salesandsupport@reelgearco.com

Best,
Reel Gear Co Team`;
        try {
          await resend.emails.send({
            from: 'Reel Gear Co <salesandsupport@reelgearco.com>',
            to: customerEmail,
            subject: '🎣 Order Confirmation - Reel Gear Co',
            text: customerBody,
          });
        } catch (e2) {
          console.error('Customer confirmation email failed (continuing):', e2.message);
        }
      }

      return res.status(200).json({ received: true });
    }

    // payment_intent.payment_failed
    const failedBody = `PAYMENT FAILED

Customer: ${name}
Email: ${customerEmail}
Amount Attempted: $${total}

Items:
${itemsBlock(m)}

Stripe Payment: ${pi.id}
Time: ${new Date().toLocaleString()}

Follow up with the customer if needed.`;

    await resend.emails.send({
      from: 'Reel Gear Co <salesandsupport@reelgearco.com>',
      to: [primaryEmail],
      subject: `⚠️ Payment Failed - ${name}`,
      text: failedBody,
    });

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    // 500 tells Stripe to retry delivery later.
    return res.status(500).json({ error: 'Handler failed' });
  }
};
