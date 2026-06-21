// src/pages/index.js
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Bandari Capital</title>
      </Head>
      <main style={{ fontFamily: 'system-ui, Arial', padding: 20 }}>
        <header>
          <h1>Bandari Capital</h1>
          <p>Strategic investment, rigorous research, disciplined risk management.</p>
        </header>

        <section>
          <h2>Our approach</h2>
          <ul>
            <li>Risk management</li>
            <li>Deep research process</li>
            <li>Position sizing strategy</li>
            <li>Strategic investment in high-value companies</li>
          </ul>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Phone: 8088169063</p>
          <p>Email: Bandaricapital@gmail.com</p>
          <p>Address: Ambedkar Nagar, 3rd Cross Road, Hope Farm, Whitefield, Bangalore, 560066</p>
        </section>

        <footer style={{ marginTop: 60 }}>
          <hr />
          <small>Bandari Capital — Phone: 8088169063 • Email: Bandaricapital@gmail.com • Address: Ambedkar Nagar, 3rd Cross Road, Hope Farm, Whitefield, Bangalore, 560066</small>
        </footer>
      </main>
    </>
  );
}
