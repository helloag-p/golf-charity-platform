import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { runDraw, splitPrize } from '@/lib/utils/drawEngine'

const supabaseAdmin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
   req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { simulate } = await req.json()
    const { id: drawId } = await params
    // Get draw
    const { data: draw } = await supabaseAdmin
      .from('draws')
      .select('*')
      .eq('id', drawId)
      .single()

    if (!draw) return NextResponse.json({ error: 'Draw not found' }, { status: 404 })

    // Get all active subscribers with scores
    const { data: subscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('status', 'active')

    const userIds = subscriptions?.map(s => s.user_id) || []

    // Get scores for each user
    const { data: scores } = await supabaseAdmin
      .from('scores')
      .select('user_id, score')
      .in('user_id', userIds)

    // Group scores by user
    const userScoreMap: Record<string, number[]> = {}
    scores?.forEach(s => {
      if (!userScoreMap[s.user_id]) userScoreMap[s.user_id] = []
      userScoreMap[s.user_id].push(s.score)
    })

    const entries = Object.entries(userScoreMap).map(([user_id, scores]) => ({
      user_id,
      scores,
    }))

    const allScores = scores?.map(s => s.score) || []

    // Calculate prize pool (£2 per subscriber goes to pool)
    const pricePerSub = 2
    const totalPool = userIds.length * pricePerSub

    // Get jackpot carryover
    const { data: lastDraw } = await supabaseAdmin
      .from('draws')
      .select('jackpot_amount, jackpot_rolled_over')
      .eq('jackpot_rolled_over', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const jackpotCarryover = lastDraw?.jackpot_rolled_over
      ? lastDraw.jackpot_amount : 0

    // Run the draw
    const result = runDraw(
      entries,
      draw.draw_type,
      allScores,
      totalPool,
      jackpotCarryover
    )

    if (simulate) {
      // Return simulation results without saving
      return NextResponse.json({ simulation: result })
    }

    // Save winning numbers and update draw
    await supabaseAdmin
      .from('draws')
      .update({
        winning_numbers: result.winning_numbers,
        prize_pool_total: totalPool,
        jackpot_amount: result.prize_pools['5-match'],
        jackpot_rolled_over: result.jackpot_rolled_over,
        status: 'pending',
      })
      .eq('id', drawId)

    // Save draw entries
    const entryInserts = result.matched_entries.map(e => ({
      draw_id: drawId,
      user_id: e.user_id,
      numbers_used: e.numbers_used,
      match_type: e.match_type,
    }))

    if (entryInserts.length > 0) {
      await supabaseAdmin.from('draw_entries').insert(entryInserts)
    }

    // Save winners (3-match and above)
    const winners = result.matched_entries.filter(
      e => e.match_type !== 'no-match'
    )

    for (const matchType of ['5-match', '4-match', '3-match'] as const) {
      const matchWinners = winners.filter(w => w.match_type === matchType)
      if (matchWinners.length === 0) continue

      const prizePerWinner = splitPrize(
        result.prize_pools[matchType],
        matchWinners.length
      )

      const winnerInserts = matchWinners.map(w => ({
        draw_id: drawId,
        user_id: w.user_id,
        match_type: matchType,
        prize_amount: prizePerWinner,
        verification_status: 'pending',
        payout_status: 'pending',
      }))

      await supabaseAdmin.from('winners').insert(winnerInserts)
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Run draw error:', error)
    return NextResponse.json({ error: 'Failed to run draw' }, { status: 500 })
  }
}