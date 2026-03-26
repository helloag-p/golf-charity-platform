'use client'

import { useState, useEffect } from 'react'

interface Score {
  id: string
  score: number
  played_on: string
  created_at: string
}

export default function ScoreEntry() {
  const [scores, setScores] = useState<Score[]>([])
  const [newScore, setNewScore] = useState('')
  const [playedOn, setPlayedOn] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchScores()
  }, [])

  async function fetchScores() {
    try {
      const res = await fetch('/api/scores')
      const data = await res.json()
      setScores(data.scores || [])
    } catch {
      setError('Failed to load scores')
    } finally {
      setFetching(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const scoreNum = parseInt(newScore)
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      setError('Score must be between 1 and 45')
      return
    }

    if (!playedOn) {
      setError('Please select a date')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: scoreNum, played_on: playedOn }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to add score')
        return
      }

      setSuccess('Score added successfully!')
      setNewScore('')
      setPlayedOn('')
      fetchScores()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/scores/${id}`, { method: 'DELETE' })
      setScores(scores.filter(s => s.id !== id))
    } catch {
      setError('Failed to delete score')
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Your scores</h2>
      <p className="text-sm text-gray-500 mb-6">
        Stableford format · last 5 scores kept · range 1–45
      </p>

      {/* Score entry form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Score</label>
          <input
            type="number"
            min={1}
            max={45}
            value={newScore}
            onChange={e => setNewScore(e.target.value)}
            placeholder="e.g. 32"
            className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Date played</label>
          <input
            type="date"
            value={playedOn}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => setPlayedOn(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex flex-col justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm
                       font-medium hover:bg-purple-700 disabled:opacity-50
                       transition-colors"
          >
            {loading ? 'Adding...' : 'Add score'}
          </button>
        </div>
      </form>

      {/* Feedback */}
      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-600 mb-4">{success}</p>
      )}

      {/* Scores list */}
      {fetching ? (
        <p className="text-sm text-gray-400">Loading scores...</p>
      ) : scores.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
          <p className="text-gray-400 text-sm">No scores yet — add your first score above</p>
        </div>
      ) : (
        <div className="space-y-2">
          {scores.map((s, index) => (
            <div
              key={s.id}
              className="flex items-center justify-between px-4 py-3
                         bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 w-4">{index + 1}</span>
                <span className="text-2xl font-semibold text-purple-700">
                  {s.score}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(s.played_on).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </span>
                {index === 0 && (
                  <span className="text-xs bg-purple-100 text-purple-700
                                   px-2 py-0.5 rounded-full">
                    latest
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                remove
              </button>
            </div>
          ))}
          <p className="text-xs text-gray-400 pt-1 text-right">
            {scores.length}/5 scores · {5 - scores.length === 0
              ? 'next entry replaces oldest'
              : `${5 - scores.length} more slot${5 - scores.length > 1 ? 's' : ''} available`}
          </p>
        </div>
      )}
    </div>
  )
}