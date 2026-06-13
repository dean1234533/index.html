import Stripe from 'stripe'

const PLANS = {
  personal: { name: "DB's AI — Personal Plan" },
  pt_pro:   { name: "DB's AI — PT Pro" },
}

const SUCCESS_URL = 'https://pt-ai-helper.pages.dev/#/register'
const CANCEL_URL  = 'https://dbworkouts.co.uk/ai-plans'

export async function onRequestPost(context) {
  const { request, env } = context

  let body
  try { body = await request.json() }
  catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { plan } = body

  if (!PLANS[plan]) {
    return Response.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const priceId = plan === 'personal'
    ? env.STRIPE_PERSONAL_PRICE_ID
    : env.STRIPE_PT_PRO_PRICE_ID

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
  })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SUCCESS_URL}?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: CANCEL_URL,
      metadata: { plan },
      allow_promotion_codes: true,
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
