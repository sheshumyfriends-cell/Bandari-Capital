import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Bandari Capital — Research Driven. Risk Managed.</title>
        <meta name="description" content="Bandari Capital — Research Driven. Risk Managed. Long-Term Wealth Creation." />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-bandari-900 to-white text-white">
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-semibold">Research Driven. Risk Managed. Long-Term Wealth Creation.</h1>
              <p className="mt-6 text-lg text-gray-200">Bandari Capital focuses on deep research, disciplined position sizing, and strategic investments to create sustainable long-term wealth.</p>
              <div className="mt-8 flex gap-3">
                <a href="/client/register" className="px-6 py-3 bg-gold text-bandari-900 rounded font-semibold">Become a Client</a>
                <a href="/client/login" className="px-6 py-3 border border-white rounded">Login</a>
                <a href="/contact" className="px-6 py-3 border border-white rounded">Contact Us</a>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white/10 p-6 rounded shadow">{/* placeholder for hero graphic */}
                <p className="text-gray-100">Institutional-grade research, portfolio construction, and ongoing monitoring.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white text-bandari-900 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-semibold">Our Investment Principles</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border rounded bg-gradient-to-b from-white to-white/95">
                <h3 className="font-semibold">Deep Research</h3>
                <p className="mt-2 text-sm text-gray-700">Fundamental analysis, management quality, and competitive moat.</p>
              </div>
              <div className="p-6 border rounded">
                <h3 className="font-semibold">Disciplined Investing</h3>
                <p className="mt-2 text-sm text-gray-700">Clear position sizing and portfolio construction rules.</p>
              </div>
              <div className="p-6 border rounded">
                <h3 className="font-semibold">Risk Management</h3>
                <p className="mt-2 text-sm text-gray-700">Capital preservation at the forefront of all decisions.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-bandari-700 text-white py-8">
          <div className="max-w-6xl mx-auto px-6 text-sm">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <strong>Bandari Capital</strong>
                <div className="mt-2">Phone: +91 8088169063</div>
                <div>Email: Bandaricapital@gmail.com</div>
                <div>Address: Ambedkar Nagar, 3rd Cross Road, Hope Farm, Whitefield, Bangalore – 560066</div>
              </div>
              <div className="mt-4 md:mt-0">© {new Date().getFullYear()} Bandari Capital. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
