export interface UserScoreEntry {
  user_id: string
  scores: number[]
}

export interface DrawResult {
  winning_numbers: number[]
  entries: MatchedEntry[]
}

export interface MatchedEntry {
  user_id: string
  numbers_used: number[]
  match_type: '5-match' | '4-match' | '3-match' | 'no-match'
  match_count: number
}

// ── Random draw: picks 5 numbers between 1–45 ──────────────
export function generateRandomNumbers(): number[] {
  const numbers: number[] = []
  while (numbers.length < 5) {
    const n = Math.floor(Math.random() * 45) + 1
    if (!numbers.includes(n)) numbers.push(n)
  }
  return numbers.sort((a, b) => a - b)
}

// ── Algorithmic draw: weighted by most frequent scores ──────
export function generateAlgorithmicNumbers(
  allScores: number[],
  mode: 'frequent' | 'rare' = 'frequent'
): number[] {
  const frequency: Record<number, number> = {}

  allScores.forEach(s => {
    frequency[s] = (frequency[s] || 0) + 1
  })

  const sorted = Object.entries(frequency)
    .map(([score, count]) => ({ score: parseInt(score), count }))
    .sort((a, b) => mode === 'frequent'
      ? b.count - a.count
      : a.count - b.count
    )

  const pool = sorted.slice(0, 15).map(x => x.score)

  // Pick 5 unique from top pool, fallback to random if not enough
  const picked: number[] = []
  const shuffled = pool.sort(() => Math.random() - 0.5)

  for (const n of shuffled) {
    if (picked.length === 5) break
    if (!picked.includes(n)) picked.push(n)
  }

  // Fill remaining with random if needed
  while (picked.length < 5) {
    const n = Math.floor(Math.random() * 45) + 1
    if (!picked.includes(n)) picked.push(n)
  }

  return picked.sort((a, b) => a - b)
}

// ── Match checker ───────────────────────────────────────────
export function checkMatch(
  userScores: number[],
  winningNumbers: number[]
): { match_type: '5-match' | '4-match' | '3-match' | 'no-match'; match_count: number } {
  const matches = userScores.filter(s => winningNumbers.includes(s))
  const count = matches.length

  if (count >= 5) return { match_type: '5-match', match_count: 5 }
  if (count === 4) return { match_type: '4-match', match_count: 4 }
  if (count === 3) return { match_type: '3-match', match_count: 3 }
  return { match_type: 'no-match', match_count: count }
}

// ── Prize pool calculator ───────────────────────────────────
export function calculatePrizePools(
  totalPool: number,
  jackpotCarryover: number = 0
) {
  const jackpot = (totalPool * 0.40) + jackpotCarryover
  const fourMatch = totalPool * 0.35
  const threeMatch = totalPool * 0.25

  return {
    '5-match': Math.round(jackpot * 100) / 100,
    '4-match': Math.round(fourMatch * 100) / 100,
    '3-match': Math.round(threeMatch * 100) / 100,
  }
}

// ── Split prize among multiple winners ─────────────────────
export function splitPrize(totalPrize: number, winnerCount: number): number {
  if (winnerCount === 0) return 0
  return Math.round((totalPrize / winnerCount) * 100) / 100
}

// ── Full draw runner ────────────────────────────────────────
export function runDraw(
  entries: UserScoreEntry[],
  drawType: 'random' | 'algorithmic',
  allScores: number[],
  totalPool: number,
  jackpotCarryover: number = 0
): {
  winning_numbers: number[]
  matched_entries: MatchedEntry[]
  prize_pools: Record<string, number>
  jackpot_rolled_over: boolean
} {
  const winning_numbers = drawType === 'random'
    ? generateRandomNumbers()
    : generateAlgorithmicNumbers(allScores)

  const matched_entries: MatchedEntry[] = entries.map(entry => {
    const { match_type, match_count } = checkMatch(entry.scores, winning_numbers)
    return {
      user_id: entry.user_id,
      numbers_used: entry.scores,
      match_type,
      match_count,
    }
  })

  const prize_pools = calculatePrizePools(totalPool, jackpotCarryover)

  const has5Match = matched_entries.some(e => e.match_type === '5-match')
  const jackpot_rolled_over = !has5Match

  return {
    winning_numbers,
    matched_entries,
    prize_pools,
    jackpot_rolled_over,
  }
}