const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cart, customer, card, amount } = req.body;

    if (!cart || !customer || !card || !amount) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const token = await stripe.tokens.create({
      card: {
        number: card.cardNumber,
        exp_month: card.cardExpiry.split('/')[0],
        exp_year: card.cardExpiry.split('/')[1],
        cvc: card.cardCvc,
      },
    });

    const charge = await stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: token.id,
      description: `ReelFishigan order from ${customer.name}`,
      receipt_email: customer.email,
      metadata: {
        name: customer.name,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
      },
    });

    const orderId = charge.id.
