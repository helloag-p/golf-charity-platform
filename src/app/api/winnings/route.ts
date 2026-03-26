import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const supabaseAdmin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('id').eq('auth_user_id', user.id).single()

    const { data, error } = await supabaseAdmin
      .from('winners')
      .select('*, draws(month)')
      .eq('user_id', profile!.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ winners: data })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch winnings' }, { status: 500 })
  }
}