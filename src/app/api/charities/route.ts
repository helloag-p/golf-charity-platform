import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const supabaseAdmin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('charities')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })

    if (error) throw error
    return NextResponse.json({ charities: data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch charities' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, image_url, website_url, is_featured } = body

    const { data, error } = await supabaseAdmin
      .from('charities')
      .insert({ name, description, image_url, website_url, is_featured: is_featured || false })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ charity: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create charity' }, { status: 500 })
  }
}