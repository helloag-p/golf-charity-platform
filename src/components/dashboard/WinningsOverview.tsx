'use client'

import { useState, useEffect } from 'react'

interface Winner {
  id: string
  match_type: string
  prize_amount: number
  verification_status: string
  payout_status: string
  draws: { month: string }
}

export default function WinningsOverview() {
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchWinnings() }, [])

  async function fetchWinnings() {
    const res = await fetch('/api/winnings')
    const data = await res.json()
    setWinners(data.winners || [])
    setLoading(false)
  }

  const total = winners
    .filter(w => w.payout_status === 'paid')
    .reduce((sum, w) => sum + w.prize_amount, 0)

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Winnings</h2>
      <p className="text-sm text-gray-500 mb-6">Your prize history</p>

      <div className="bg-purple-50 rounded-xl p-4 mb-6">
        <p className="text-sm text-purple-700 mb-1">Total paid out</p>
        <p className="text-3xl font-bold text-purple-700">£{total.toFixed(2)}</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : winners.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
          <p className="text-gray-400 text-sm">No winnings yet — keep playing!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {winners.map(w => (
            <div key={w.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {w.match_type}
                </p>
                <p className="text-sm text-gray-500">{w.draws?.month}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">£{w.prize_amount}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full
                  ${w.payout_status === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                  }`}>
                  {w.payout_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}