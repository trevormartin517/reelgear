const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const merchantEmails = ['salesandsupport@reelgearco.com'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { status, customerName, customerEmail, address, city, state, zipcode, items, total, cartTotal } = req.body;

    if (!customerName || !customerEmail || !address || !city || !state || !zipcode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const itemsList = items.map(item => 
      `${item.name} - $${item.price.toFixed(2)} ${item.qty ? `(Qty: ${item.qty})` : ''}`
    ).join('\n');

    if (status === 'pending') {
      const merchantEmailBody = `
INCOMING ORDER SUBMISSION

Customer Details:
Name: ${customerName}
Email: ${customerEmail}

Shipping Address:
${address}
${city}, ${state} ${zipcode}

Items Ordered:
${itemsList}

Subtotal: $${cartTotal.toFixed(2)}
Total: $${total.toFixed(2)}

---
Order submission at: ${new Date().toLocaleString()}
(Payment processing in progress - this is NOT a confirmed order yet)
      `;

      await resend.emails.send({
        from: 'Reel Gear Co <salesandsupport@reelgearco.com>',
        to: merchantEmails,
        subject: `🎣 Order Submission from ${customerName}`,
        text: merchantEmailBody,
      });

      return res.status(200).json({ success: true, message: 'Order email sent' });

    } else if (status === 'success') {
      const merchantEmailBody = `
NEW ORDER RECEIVED!

Customer Details:
Name: ${customerName}
Email: ${customerEmail}

Shipping Address:
${address}
${city}, ${state} ${zipcode}

Items Ordered:
${itemsList}

Subtotal: $${cartTotal.toFixed(2)}
Total: $${total.toFixed(2)}

---
Order received at: ${new Date().toLocaleString()}
      `;

      await resend.emails.send({
        from: 'Reel Gear Co <salesandsupport@reelgearco.com>',
        to: merchantEmails,
        subject: `🎣 New Order from ${customerName}`,
        text: merchantEmailBody,
      });

      const customerEmailBody = `
Thank you for your order, ${customerName}!

We've received your order and will ship it soon to:
${address}
${city}, ${state} ${zipcode}

Order Summary:
${itemsList}

Total: $${total.toFixed(2)}

We'll send you a shipping notification soon!

Questions? Reply to this email or reach us at salesandsupport@reelgearco.com

Best,
Reel Gear Co Team
      `;

      await resend.emails.send({
        from: 'Reel Gear Co <salesandsupport@reelgearco.com>',
        to: customerEmail,
        subject: '🎣 Order Confirmation - Reel Gear Co',
        text: customerEmailBody,
      });

      return res.status(200).json({ success: true, message: 'Order emails sent' });

    } else if (status === 'failed') {
      const failedEmailBody = `
PAYMENT FAILED

Customer: ${customerName}
Email: ${customerEmail}
Amount Attempted: $${total.toFixed(2)}

Items:
${itemsList}

Time: ${new Date().toLocaleString()}

Please follow up with customer if needed.
      `;

      await resend.emails.send({
        from: 'Reel Gear Co <salesandsupport@reelgearco.com>',
        to: merchantEmails,
        subject: `⚠️ Payment Failed - ${customerName}`,
        text: failedEmailBody,
      });

      return res.status(200).json({ success: true, message: 'Failed payment notification sent' });
    }

    return res.status(400).json({ error: 'Invalid status' });

  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
};
