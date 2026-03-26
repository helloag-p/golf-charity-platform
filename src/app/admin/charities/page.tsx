'use client'

import { useState, useEffect } from 'react'

interface Charity {
  id: string
  name: string
  description: string
  website_url: string | null
  is_featured: boolean
  is_active: boolean
}

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => { fetchCharities() }, [])

  async function fetchCharities() {
    const res = await fetch('/api/admin/charities')
    const data = await res.json()
    setCharities(data.charities || [])
    setLoading(false)
  }

  async function createCharity() {
    if (!name) return
    setCreating(true)
    await fetch('/api/charities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, website_url: websiteUrl, is_featured: isFeatured }),
    })
    setName('')
    setDescription('')
    setWebsiteUrl('')
    setIsFeatured(false)
    fetchCharities()
    setCreating(false)
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/admin/charities/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !current }),
    })
    fetchCharities()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Charities</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add charity</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Charity name" />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Website</label>
            <input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://..." />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-gray-600 block mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Brief description..." />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={isFeatured}
              onChange={e => setIsFeatured(e.target.checked)}
              className="accent-purple-600" />
            Featured charity
          </label>
          <button onClick={createCharity} disabled={creating || !name}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm
                       font-medium hover:bg-purple-700 disabled:opacity-50">
            {creating ? 'Adding...' : 'Add charity'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading charities...</p>
      ) : (
        <div className="space-y-3">
          {charities.map(c => (
            <div key={c.id}
              className="bg-white rounded-2xl border border-gray-200 p-5
                         flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{c.name}</p>
                  {c.is_featured && (
                    <span className="text-xs bg-purple-100 text-purple-700
                                     px-2 py-0.5 rounded-full">Featured</span>
                  )}
                </div>
                {c.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{c.description}</p>
                )}
              </div>
              <button onClick={() => toggleActive(c.id, c.is_active)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium
                  ${c.is_active
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}>
                {c.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}