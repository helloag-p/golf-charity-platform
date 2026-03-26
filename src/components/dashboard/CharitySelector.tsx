'use client'

import { useState, useEffect } from 'react'

interface Charity {
  id: string
  name: string
  description: string
  image_url: string | null
  is_featured: boolean
}

interface Selection {
  charity_id: string
  percentage: number
  charities: Charity
}

export default function CharitySelector() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [selection, setSelection] = useState<Selection | null>(null)
  const [selectedId, setSelectedId] = useState('')
  const [percentage, setPercentage] = useState(10)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchCharities()
    fetchSelection()
  }, [])

  async function fetchCharities() {
    const res = await fetch('/api/charities')
    const data = await res.json()
    setCharities(data.charities || [])
  }

  async function fetchSelection() {
    const res = await fetch('/api/charity-selection')
    const data = await res.json()
    if (data.selection) {
      setSelection(data.selection)
      setSelectedId(data.selection.charity_id)
      setPercentage(data.selection.percentage)
    }
  }

  async function saveSelection() {
    if (!selectedId) return
    setSaving(true)
    setSaved(false)
    await fetch('/api/charity-selection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ charity_id: selectedId, percentage }),
    })
    setSaving(false)
    setSaved(true)
    fetchSelection()
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Your charity</h2>
      <p className="text-sm text-gray-500 mb-6">
        Choose where your contribution goes each month
      </p>

      {charities.length === 0 ? (
        <p className="text-sm text-gray-400">
          No charities listed yet — check back soon.
        </p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {charities.map(charity => (
              <label
                key={charity.id}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer
                  transition-colors ${selectedId === charity.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-100 hover:border-gray-200'
                  }`}
              >
                <input
                  type="radio"
                  name="charity"
                  value={charity.id}
                  checked={selectedId === charity.id}
                  onChange={() => setSelectedId(charity.id)}
                  className="mt-1 accent-purple-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{charity.name}</p>
                    {charity.is_featured && (
                      <span className="text-xs bg-purple-100 text-purple-700
                                       px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  {charity.description && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {charity.description}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>

          <div className="mb-6">
            <label className="text-sm text-gray-600 block mb-2">
              Contribution percentage (min 10%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={10}
                max={50}
                value={percentage}
                onChange={e => setPercentage(parseInt(e.target.value))}
                className="flex-1 accent-purple-600"
              />
              <span className="text-lg font-bold text-purple-600 w-12">
                {percentage}%
              </span>
            </div>
          </div>

          <button
            onClick={saveSelection}
            disabled={saving || !selectedId}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg text-sm
                       font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save selection'}
          </button>
        </>
      )}
    </div>
  )
}