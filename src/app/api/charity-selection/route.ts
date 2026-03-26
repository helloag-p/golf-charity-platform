import { NextRequest, NextResponse } from 'next/server'
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

    const { data } = await supabaseAdmin
      .from('charity_selections')
      .select('*, charities(*)')
      .eq('user_id', profile!.id)
      .single()

    return NextResponse.json({ selection: data })
  } catch {
    return NextResponse.json({ selection: null })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { charity_id, percentage } = await req.json()

    const { data: profile } = await supabase
      .from('profiles').select('id').eq('auth_user_id', user.id).single()

    const { data, error } = await supabaseAdmin
      .from('charity_selections')
      .upsert({
        user_id: profile!.id,
        charity_id,
        percentage: percentage || 10,
      }, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ selection: data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save selection' }, { status: 500 })
  }
}