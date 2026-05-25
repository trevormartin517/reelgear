const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { amount, email, metadata } = req.body;

        if (!amount || amount < 50) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: metadata,
            receipt_email: email,
            description: `ReelFishigan Order - ${metadata.name}`
        });

        return res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Stripe error:', error);
        return res.status(400).json({ error: error.message });
    }
};
