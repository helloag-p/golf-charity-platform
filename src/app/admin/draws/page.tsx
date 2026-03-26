'use client'

import { useState, useEffect } from 'react'

interface Draw {
  id: string
  month: string
  status: string
  draw_type: string
  winning_numbers: number[] | null
  prize_pool_total: number
  jackpot_amount: number
  jackpot_rolled_over: boolean
  published_at: string | null
}

export default function AdminDrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState('')
  const [drawType, setDrawType] = useState('random')
  const [creating, setCreating] = useState(false)
  const [runningId, setRunningId] = useState<string | null>(null)
  const [simulation, setSimulation] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => { fetchDraws() }, [])

  async function fetchDraws() {
    const res = await fetch('/api/admin/draws')
    const data = await res.json()
    setDraws(data.draws || [])
    setLoading(false)
  }

  async function createDraw() {
  setError('')
  if (!month) return setError('Please select a month')
  setCreating(true)

  try {
    const res = await fetch('/api/admin/draws', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, draw_type: drawType }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to create draw')
      setCreating(false)
      return
    }

    setMonth('')
    fetchDraws()
  } catch (err) {
    setError('Something went wrong')
  } finally {
    setCreating(false)
  }
}

  async function runDraw(id: string, simulate: boolean) {
    setRunningId(id)
    setSimulation(null)
    const res = await fetch(`/api/admin/draws/${id}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ simulate }),
    })
    const data = await res.json()
    if (simulate) setSimulation(data.simulation)
    else fetchDraws()
    setRunningId(null)
  }

  async function publishDraw(id: string) {
    await fetch(`/api/admin/draws/${id}/publish`, { method: 'POST' })
    fetchDraws()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Draw management</h1>

      {/* Create draw */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create new draw</h2>
        <div className="flex gap-4 items-end">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Month</label>
            <input
              type="month"
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Draw type</label>
            <select
              value={drawType}
              onChange={e => setDrawType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="random">Random</option>
              <option value="algorithmic">Algorithmic</option>
            </select>
          </div>
          <button
            onClick={createDraw}
            disabled={creating}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm
                       font-medium hover:bg-purple-700 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create draw'}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {/* Simulation result */}
      {simulation && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-amber-900 mb-3">Simulation result</h3>
          <p className="text-sm text-amber-800 mb-2">
            Winning numbers: {simulation.winning_numbers?.join(', ')}
          </p>
          <p className="text-sm text-amber-800 mb-2">
            5-match winners: {simulation.matched_entries?.filter((e: any) => e.match_type === '5-match').length}
          </p>
          <p className="text-sm text-amber-800 mb-2">
            4-match winners: {simulation.matched_entries?.filter((e: any) => e.match_type === '4-match').length}
          </p>
          <p className="text-sm text-amber-800 mb-2">
            3-match winners: {simulation.matched_entries?.filter((e: any) => e.match_type === '3-match').length}
          </p>
          <p className="text-sm text-amber-800">
            Jackpot rolls over: {simulation.jackpot_rolled_over ? 'Yes' : 'No'}
          </p>
          <button
            onClick={() => setSimulation(null)}
            className="mt-3 text-xs text-amber-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Draws list */}
      {loading ? (
        <p className="text-gray-400">Loading draws...</p>
      ) : draws.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
          <p className="text-gray-400">No draws yet — create your first draw above</p>
        </div>
      ) : (
        <div className="space-y-4">
          {draws.map(draw => (
            <div
              key={draw.id}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{draw.month}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {draw.draw_type} draw · Prize pool: £{draw.prize_pool_total}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium
                  ${draw.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : draw.status === 'pending'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                  {draw.status}
                </span>
              </div>

              {draw.winning_numbers && (
                <div className="flex gap-2 mb-4">
                  {draw.winning_numbers.map((n, i) => (
                    <span
                      key={i}
                      className="w-9 h-9 rounded-full bg-purple-100 text-purple-700
                                 text-sm font-bold flex items-center justify-center"
                    >
                      {n}
                    </span>
                  ))}
                  {draw.jackpot_rolled_over && (
                    <span className="text-xs text-amber-600 self-center ml-2">
                      Jackpot rolls over
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                {draw.status === 'pending' && !draw.winning_numbers && (
                  <>
                    <button
                      onClick={() => runDraw(draw.id, true)}
                      disabled={runningId === draw.id}
                      className="px-4 py-2 border border-amber-300 text-amber-700
                                 rounded-lg text-sm hover:bg-amber-50 disabled:opacity-50"
                    >
                      {runningId === draw.id ? 'Running...' : 'Simulate'}
                    </button>
                    <button
                      onClick={() => runDraw(draw.id, false)}
                      disabled={runningId === draw.id}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg
                                 text-sm hover:bg-purple-700 disabled:opacity-50"
                    >
                      {runningId === draw.id ? 'Running...' : 'Run draw'}
                    </button>
                  </>
                )}
                {draw.winning_numbers && draw.status !== 'published' && (
                  <button
                    onClick={() => publishDraw(draw.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg
                               text-sm hover:bg-green-700"
                  >
                    Publish results
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