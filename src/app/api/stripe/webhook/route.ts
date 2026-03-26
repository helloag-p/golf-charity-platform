import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Use service role for webhook — bypasses RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body, sig, process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        const plan = session.metadata?.plan

        if (!userId) break

        const sub = await stripe.subscriptions.retrieve(
         session.subscription as string
      )
        const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan: plan || 'monthly',
      status: 'active',
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: sub.id,
      current_period_end: new Date(
        sub.items.data[0].current_period_end * 1000
      ).toISOString(),
    }, { onConflict: 'user_id' })

  console.log("SUBSCRIPTION INSERT ERROR:", error)
  console.log("USER ID:", userId)
  console.log("PLAN:", plan)
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription as string 
        
        // Cast here to resolve the 'Response' error
        if(!subId) break
        const sub = await stripe.subscriptions.retrieve(subId)
        const userId = sub.metadata?.supabase_user_id

        if (!userId) break

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_end: new Date(sub.items.data[0].current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subId)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription

        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', sub.id)
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const status = sub.status === 'active' ? 'active' : 'lapsed'

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status,
            current_period_end: new Date(sub.items.data[0].current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', sub.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}

// Required: disable body parsing so Stripe signature works
// export const config = {
//   api: { bodyParser: false },
// }