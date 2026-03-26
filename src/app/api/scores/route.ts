import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — fetch user's scores
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const { data: scores, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', profile.id)
      .order('played_on', { ascending: false })
      .limit(5)

    if (error) throw error

    return NextResponse.json({ scores })
  } catch (error) {
    console.error('Get scores error:', error)
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 })
  }
}

// POST — add a new score
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { score, played_on } = await req.json()

    // Validate
    if (!score || score < 1 || score > 45) {
      return NextResponse.json(
        { error: 'Score must be between 1 and 45' },
        { status: 400 }
      )
    }

    if (!played_on) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const { data, error } = await supabase
      .from('scores')
      .insert({
        user_id: profile.id,
        score,
        played_on,
      })
      .select()
      .single()

    if (error) throw error

    // The DB trigger automatically deletes oldest if > 5

    return NextResponse.json({ score: data }, { status: 201 })
  } catch (error) {
    console.error('Add score error:', error)
    return NextResponse.json({ error: 'Failed to add score' }, { status: 500 })
  }
}