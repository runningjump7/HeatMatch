import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">TRADEEV2</h1>
          <div className="flex gap-4">
            <Link href="/installers" className="text-gray-600 hover:text-gray-900">
              Browse
            </Link>
            <Link href="/clerk/user-profile" className="text-blue-600 hover:text-blue-700">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Hero */}
        <section className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Find Verified Heat Pump Installers in North Shore
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get quotes from licensed, verified heat pump installers. Free comparison, fast response times.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/installers"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Installers
            </Link>
            <Link
              href="/get-quotes"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Get Free Quotes
            </Link>
          </div>
        </section>

        {/* Suburbs */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Serving North Shore Suburbs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Takapuna', 'Devonport', 'Birkenhead', 'Milford', 'Northcote', 'Long Bay', 'Unsworth Heights', 'Glenfield'].map((suburb) => (
              <Link
                key={suburb}
                href={`/installers?suburb=${suburb.toLowerCase()}`}
                className="p-4 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-center"
              >
                {suburb}
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="bg-white border rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Choose TRADEEV2?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-2">✓</div>
              <h4 className="font-bold text-gray-900 mb-2">Verified Installers</h4>
              <p className="text-gray-600">
                All installers are verified through EWRB and EPA Refrigerant License registries.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">⚡</div>
              <h4 className="font-bold text-gray-900 mb-2">Fast Response</h4>
              <p className="text-gray-600">
                Get contacted by installers within 24 hours of submitting your inquiry.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">💰</div>
              <h4 className="font-bold text-gray-900 mb-2">Free Comparison</h4>
              <p className="text-gray-600">
                Compare quotes from multiple installers at no cost to you.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">How much does a heat pump cost?</h4>
              <p className="text-gray-600">
                A standard residential heat pump installation typically costs between $3,000–$6,000.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">What's the Warmer Kiwi Homes subsidy?</h4>
              <p className="text-gray-600">
                The government provides 80–90% co-funding for eligible households. Check your eligibility on the EECA website.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">How long does installation take?</h4>
              <p className="text-gray-600">
                Most heat pump installations are completed in 1–2 days.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t bg-gray-50 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2026 TRADEEV2. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
