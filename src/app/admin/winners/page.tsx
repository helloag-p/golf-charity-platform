'use client'

import { useState, useEffect } from 'react'

interface Winner {
  id: string
  match_type: string
  prize_amount: number
  verification_status: string
  payout_status: string
  proof_url: string | null
  profiles: { full_name: string; email: string }
  draws: { month: string }
}

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchWinners() }, [])

  async function fetchWinners() {
    const res = await fetch('/api/admin/winners')
    const data = await res.json()
    setWinners(data.winners || [])
    setLoading(false)
  }

  async function updatePayout(id: string, status: string) {
    await fetch(`/api/admin/winners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payout_status: status }),
    })
    fetchWinners()
  }

  async function updateVerification(id: string, status: string) {
    await fetch(`/api/admin/winners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verification_status: status }),
    })
    fetchWinners()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Winners</h1>

      {loading ? (
        <p className="text-gray-400">Loading winners...</p>
      ) : winners.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
          <p className="text-gray-400">No winners yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {winners.map(w => (
            <div key={w.id}
              className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {w.profiles?.full_name}
                  </p>
                  <p className="text-sm text-gray-500">{w.profiles?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {w.draws?.month} · {w.match_type} · £{w.prize_amount}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full
                    ${w.verification_status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : w.verification_status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                    }`}>
                    {w.verification_status}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full
                    ${w.payout_status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                    }`}>
                    {w.payout_status}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {w.verification_status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateVerification(w.id, 'approved')}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg
                                 text-xs hover:bg-green-700">
                      Approve
                    </button>
                    <button
                      onClick={() => updateVerification(w.id, 'rejected')}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg
                                 text-xs hover:bg-red-700">
                      Reject
                    </button>
                  </>
                )}
                {w.verification_status === 'approved' &&
                  w.payout_status === 'pending' && (
                  <button
                    onClick={() => updatePayout(w.id, 'paid')}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg
                               text-xs hover:bg-purple-700">
                    Mark as paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}