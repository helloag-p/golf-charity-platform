'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubscribePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleSubscribe(plan: string) {
    setLoading(plan)
    setError('')

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setLoading(null)
        return
      }

      // Redirect to Stripe checkout
      window.location.href = data.url
    } catch {
      setError('Failed to start checkout')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Choose your plan
        </h1>
        <p className="text-gray-500 text-center mb-10">
          Subscribe to access the full platform
        </p>

        {error && (
          <p className="text-red-600 text-sm text-center mb-6">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Monthly</h2>
            <p className="text-3xl font-bold text-purple-600 mb-6">
              £9.99
              <span className="text-base font-normal text-gray-400">/mo</span>
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-8">
              <li>✓ Score tracking</li>
              <li>✓ Monthly prize draws</li>
              <li>✓ Charity contributions</li>
            </ul>
            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={loading !== null}
              className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm
                         font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading === 'monthly' ? 'Redirecting...' : 'Get started'}
            </button>
          </div>

          {/* Yearly */}
          <div className="bg-white rounded-2xl border-2 border-purple-500 p-8 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600
                             text-white text-xs px-3 py-1 rounded-full">
              Best value
            </span>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Yearly</h2>
            <p className="text-3xl font-bold text-purple-600 mb-6">
              £99.99
              <span className="text-base font-normal text-gray-400">/yr</span>
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-8">
              <li>✓ Score tracking</li>
              <li>✓ Monthly prize draws</li>
              <li>✓ Charity contributions</li>
              <li>✓ 2 months free</li>
            </ul>
            <button
              onClick={() => handleSubscribe('yearly')}
              disabled={loading !== null}
              className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm
                         font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading === 'yearly' ? 'Redirecting...' : 'Get started'}
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-8">
          Payments secured by Stripe · Cancel anytime
        </p>
      </div>
    </div>
  )
}