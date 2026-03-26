import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const supabaseAdmin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET — list all draws
export async function GET() {
  try {
    const { data: draws, error } = await supabaseAdmin
      .from('draws')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ draws })
  } catch (error) {
    console.error('Fetch draws error:', error)
    return NextResponse.json({ error: 'Failed to fetch draws' }, { status: 500 })
  }
}

// POST — create a new draw
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { month, draw_type } = body

    if (!month) {
      return NextResponse.json({ error: 'Month is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('draws')
      .insert({
        month,
        draw_type: draw_type || 'random',
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ draw: data }, { status: 201 })
  } catch (error) {
    console.error('Create draw error:', error)
    return NextResponse.json({ error: 'Failed to create draw' }, { status: 500 })
  }
}