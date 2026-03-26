import { createClient } from '@/lib/supabase/server'

export async function getUserSubscription() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return null

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', profile.id)
    .single()

  return subscription
}

export function isSubscriptionActive(sub: { status: string } | null) {
  return sub?.status === 'active'
}