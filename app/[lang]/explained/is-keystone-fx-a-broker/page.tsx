export default function IsKeystoneFxABrokerPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is Keystone FX a broker?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "No. Keystone FX is not a broker. The company does not operate a brokerage business, does not accept or hold client funds, and does not act as counterparty to trades."
        }
      },
      {
        "@type": "Question",
        "name": "What does Keystone FX actually do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Keystone FX provides institutional trading infrastructure and execution technology used by professional market participants to connect to external liquidity venues and manage execution workflows."
        }
      },
      {
        "@type": "Question",
        "name": "Does Keystone FX provide investment advice or regulated services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "No. Keystone FX does not provide investment advice, custody, or regulated investment services. Users remain responsible for their own trading decisions and regulatory obligations."
        }
      }
    ]
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-20 text-slate-900">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h1 className="text-4xl font-semibold tracking-tight">
        Is Keystone FX a Broker?
      </h1>

      <p className="mt-6 text-lg text-slate-700">
        No. Keystone FX is not a broker.
      </p>

      <section className="mt-10 space-y-6">
        <p>
          Keystone FX is an institutional trading infrastructure and execution
          technology provider. The company does not operate as a brokerage, does
          not accept or hold client funds, and does not act as counterparty to
          trades.
        </p>

        <p>
          Keystone FX provides technology systems that professional market
          participants use to connect to external liquidity venues and execute
          trades. All trading decisions, risk exposure, and regulatory
          obligations remain the responsibility of the user.
        </p>
      </section>

      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold">
          What Keystone FX does not do
        </h2>

        <ul className="list-disc pl-6 space-y-2">
          <li>Keystone FX does not operate a brokerage business</li>
          <li>Keystone FX does not accept or safeguard client funds</li>
          <li>Keystone FX does not internalize trades or operate a B-book</li>
          <li>Keystone FX does not provide investment advice</li>
          <li>Keystone FX does not act as principal or counterparty</li>
        </ul>
      </section>

      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold">
          What Keystone FX actually provides
        </h2>

        <p>
          Keystone FX designs and operates execution-focused trading
          infrastructure. This includes execution routing logic, latency
          measurement systems, liquidity interaction frameworks, and connectivity
          technology used by professional market participants.
        </p>

        <p>
          These systems are comparable to institutional trading technology used
          by banks, funds, and proprietary trading firms, rather than retail
          brokerage platforms.
        </p>
      </section>

      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold">
          Regulatory positioning
        </h2>

        <p>
          Because Keystone FX does not provide brokerage services, custody, or
          investment advice, it does not operate under retail brokerage
          regulation. Users of Keystone FX technology remain responsible for
          complying with all applicable regulatory requirements in their
          respective jurisdictions.
        </p>
      </section>

      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold">
          Related explanations
        </h2>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <a href="/execution" className="underline">
              Execution infrastructure overview
            </a>
          </li>
          <li>
            <a href="/liquidity" className="underline">
              Liquidity interaction infrastructure
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-12 text-sm text-slate-600">
        <p>
          This page exists to provide factual clarification only. It is not
          intended as marketing material or financial advice.
        </p>
      </section>
    </main>
  );
}
