import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-bold text-gray-900 text-lg">
            Golf Charity Platform
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login"
              className="text-sm text-gray-600 hover:text-gray-900">
              Sign in
            </Link>
            <Link href="/signup"
              className="text-sm px-4 py-2 bg-purple-600 text-white
                         rounded-lg hover:bg-purple-700 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700
                        text-sm px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          Monthly draws · Real prizes · Real impact
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6
                       leading-tight tracking-tight">
          Play golf.<br />
          <span className="text-purple-600">Win prizes.</span><br />
          Support charity.
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Enter your Stableford scores, join the monthly prize draw,
          and automatically support a charity you care about — all in one place.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/signup"
            className="px-8 py-4 bg-purple-600 text-white rounded-xl text-lg
                       font-medium hover:bg-purple-700 transition-colors">
            Start for £9.99/month
          </Link>
          <Link href="#how-it-works"
            className="px-8 py-4 border border-gray-200 text-gray-700 rounded-xl
                       text-lg font-medium hover:border-gray-300 transition-colors">
            How it works
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          Cancel anytime · Secured by Stripe
        </p>
      </section>

      {/* Stats */}
      <section className="bg-purple-600 py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '£40%', label: 'of pool to jackpot winner' },
            { value: '10%+', label: 'of subscription to charity' },
            { value: '3×', label: 'chances to win each month' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-purple-200 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          How it works
        </h2>
        <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">
          Three simple steps. Every month.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Subscribe & pick a charity',
              desc: 'Choose a monthly or yearly plan. Select a charity to support with part of your subscription.',
            },
            {
              step: '02',
              title: 'Enter your golf scores',
              desc: 'Add your latest Stableford scores (1–45). We keep your best 5. These are your draw numbers.',
            },
            {
              step: '03',
              title: 'Win prizes every month',
              desc: 'Match 3, 4, or 5 numbers in the monthly draw to win your share of the prize pool.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-8">
              <span className="text-5xl font-bold text-purple-100 block mb-4">
                {item.step}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Prize breakdown */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Prize structure
          </h2>
          <p className="text-gray-500 text-center mb-16">
            Every subscriber contributes to the prize pool
          </p>

          <div className="max-w-2xl mx-auto space-y-4">
            {[
              { match: '5 numbers matched', share: '40%', note: 'Jackpot — rolls over if unclaimed', color: 'purple' },
              { match: '4 numbers matched', share: '35%', note: 'Split among all 4-match winners', color: 'teal' },
              { match: '3 numbers matched', share: '25%', note: 'Split among all 3-match winners', color: 'gray' },
            ].map((tier, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-6 flex items-center justify-between
                           border border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900">{tier.match}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{tier.note}</p>
                </div>
                <span className={`text-2xl font-bold
                  ${tier.color === 'purple' ? 'text-purple-600' :
                    tier.color === 'teal' ? 'text-teal-600' : 'text-gray-600'
                  }`}>
                  {tier.share}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charity section */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Play with purpose
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-8">
          At least 10% of every subscription goes directly to a charity of your choice.
          You can increase this percentage anytime from your dashboard.
        </p>
        <div className="inline-flex items-center gap-3 bg-green-50 border border-green-100
                        rounded-2xl px-8 py-5">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <p className="text-green-800 font-medium">
            Minimum 10% of your subscription donated monthly
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Simple pricing
          </h2>
          <p className="text-gray-500 text-center mb-16">No hidden fees</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="font-semibold text-gray-900 mb-1">Monthly</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">
                £9.99
                <span className="text-base font-normal text-gray-400">/mo</span>
              </p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                {['Score tracking', 'Monthly prize draw', 'Charity contribution', 'Cancel anytime'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-purple-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="block text-center py-3 bg-gray-900 text-white rounded-xl
                           text-sm font-medium hover:bg-gray-800 transition-colors">
                Get started
              </Link>
            </div>

            <div className="bg-white rounded-2xl border-2 border-purple-500 p-8 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600
                               text-white text-xs px-4 py-1 rounded-full font-medium">
                Best value
              </span>
              <h3 className="font-semibold text-gray-900 mb-1">Yearly</h3>
              <p className="text-4xl font-bold text-gray-900 mb-1">
                £99.99
                <span className="text-base font-normal text-gray-400">/yr</span>
              </p>
              <p className="text-sm text-green-600 mb-6">Save £20 — 2 months free</p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                {['Score tracking', 'Monthly prize draw', 'Charity contribution', 'Cancel anytime', '2 months free'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-purple-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="block text-center py-3 bg-purple-600 text-white rounded-xl
                           text-sm font-medium hover:bg-purple-700 transition-colors">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Ready to play with purpose?
        </h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          Join golfers who compete, win, and give back — all in one subscription.
        </p>
        <Link href="/signup"
          className="inline-block px-10 py-4 bg-purple-600 text-white rounded-xl
                     text-lg font-medium hover:bg-purple-700 transition-colors">
          Start today
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-sm text-gray-400">
            © 2026 Golf Charity Platform
          </p>
          <div className="flex gap-6">
            <Link href="/login" className="text-sm text-gray-400 hover:text-gray-600">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm text-gray-400 hover:text-gray-600">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}