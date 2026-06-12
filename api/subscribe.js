// /api/subscribe.js
// Newsletter signup: emails the subscriber their WELCOME10 code via Resend,
// and notifies salesandsupport@reelgearco.com so you have a record of every signup.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body || {};
    const cleaned = String(email || '').trim().toLowerCase();

    // Basic validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleaned) || cleaned.length > 200) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error('subscribe: RESEND_API_KEY not set');
      return res.status(500).json({ error: 'Signup is temporarily unavailable.' });
    }

    const send = (payload) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

    // 1) Welcome email with the discount code
    const welcome = await send({
      from: 'ReelGearCo <salesandsupport@reelgearco.com>',
      to: [cleaned],
      subject: '🎣 Your 10% off code from ReelGearCo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #061827;">
          <h2 style="color: #061827;">Welcome to ReelGearCo! 🎣</h2>
          <p>Thanks for joining the list. Here's your 10% off code for your first order:</p>
          <div style="background: #061827; color: #C9933A; font-size: 24px; font-weight: bold; text-align: center; padding: 18px; border-radius: 8px; letter-spacing: 2px; margin: 16px 0;">
            WELCOME10
          </div>
          <p>Enter it at checkout on <a href="https://www.reelgearco.com" style="color: #C9933A;">reelgearco.com</a>. It works on everything — Garmin sun shades, hook covers, and rod holders.</p>
          <p style="margin-top: 20px;">Tight lines,<br>ReelGearCo</p>
          <p style="font-size: 11px; color: #999; margin-top: 24px;">You received this because you signed up at reelgearco.com. Reply to this email if you'd like to be removed.</p>
        </div>
      `
    });

    if (!welcome.ok) {
      const detail = await welcome.text();
      console.error('subscribe: welcome email failed', detail);
      return res.status(500).json({ error: 'Could not send your code. Please try again.' });
    }

    // 2) Notify yourself (best effort — don't fail the signup if this errors)
    send({
      from: 'ReelGearCo <salesandsupport@reelgearco.com>',
      to: ['salesandsupport@reelgearco.com'],
      subject: `📬 New newsletter signup: ${cleaned}`,
      html: `<p>New subscriber: <strong>${cleaned}</strong></p><p>Signed up ${new Date().toUTCString()}</p>`
    }).catch((e) => console.error('subscribe: notify email failed', e));

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('subscribe error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
