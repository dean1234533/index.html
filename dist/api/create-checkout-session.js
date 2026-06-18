const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PLANS = {
  personal: {
    priceId: process.env.STRIPE_PERSONAL_PRICE_ID,
    name: "DB's AI — Personal Plan",
  },
  pt_pro: {
    priceId: process.env.STRIPE_PT_PRO_PRICE_ID,
    name: "DB's AI — PT Pro",
  },
}

const GENERATOR_URL = 'https://pt-ai-helper.pages.dev/#/register'

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { plan } = req.body

  if (!PLANS[plan]) {
    return res.status(400).json({ error: 'Invalid plan' })
  }

  const origin = req.headers.origin || 'https://dbworkouts.co.uk'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PLANS[plan].priceId,
          quantity: 1,
        },
      ],
      success_url: `${GENERATOR_URL}?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/ai-plans`,
      metadata: { plan },
      allow_promotion_codes: true,
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: err.message })
  }
}
