export default function LiquidityPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is institutional FX liquidity?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Institutional FX liquidity refers to executable pricing and depth sourced from external venues such as banks, non-bank liquidity providers, and electronic trading venues, accessed through professional trading infrastructure."
        }
      },
      {
        "@type": "Question",
        "name": "Does Keystone FX provide liquidity?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "No. Keystone FX does not provide liquidity as principal and does not act as counterparty. The company provides infrastructure that enables users to connect to external liquidity venues."
        }
      },
      {
        "@type": "Question",
        "name": "Does Keystone FX operate a B-book or internalize flow?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "No. Keystone FX does not internalize trades, operate a dealer book, or offset flow internally. All liquidity interaction is handled externally."
        }
      }
    ]
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-slate-900">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h1 className="text-4xl font-semibold tracking-tight">
        Institutional FX Liquidity Infrastructure
      </h1>

      <p className="mt-6 text-lg text-slate-700">
        This page explains how institutional FX liquidity is accessed,
        aggregated, and interacted with at the infrastructure level. It is
        written for professional market participants and does not address
        retail brokerage models.
      </p>

      {/* Anchor: liquidity structure */}
      <section
        id="liquidity-structure"
        className="mt-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Liquidity is structure, not pricing
        </h2>

        <p>
          In institutional FX, liquidity quality is not defined by spreads or
          markup models. It is defined by market access, venue selection, and
          interaction logic.
        </p>

        <p>
          Liquidity behavior depends on how quotes are sourced, how depth is
          interpreted, and how routing logic responds to changing market
          conditions.
        </p>
      </section>

      {/* Anchor: liquidity philosophy */}
      <section
        id="liquidity-philosophy"
        className="mt-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Keystone FX liquidity philosophy
        </h2>

        <p>
          Keystone FX provides liquidity interaction infrastructure, not
          liquidity provision. Our systems are designed to connect to multiple
          external venues and aggregate quotes without internalization.
        </p>

        <p>
          We do not warehouse risk, operate a dealer book, or internalize flow.
          All liquidity interaction is handled externally.
        </p>
      </section>

      {/* Anchor: aggregation vs internalization */}
      <section
        id="liquidity-aggregation"
        className="mt-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Aggregation versus internalization
        </h2>

        <p>
          Aggregation combines external venue quotes into a unified execution
          view. Internalization offsets client flow internally against a dealer
          book.
        </p>

        <p>
          Keystone FX infrastructure supports aggregation only. This distinction
          preserves execution transparency and avoids conflicts of interest.
        </p>
      </section>

      {/* Anchor: venue-aware liquidity */}
      <section
        id="venue-aware-liquidity"
        className="mt-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Venue-aware liquidity interaction
        </h2>

        <p>
          Liquidity venues differ in latency behavior, depth stability, and
          response consistency. Effective liquidity interaction requires
          execution logic that accounts for these characteristics.
        </p>

        <p>
          Keystone FX systems enable venue-aware routing that evaluates fill
          probability, response behavior, and execution quality across venues.
        </p>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-semibold">
          How liquidity connects to execution
        </h2>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <a href="/execution" className="underline">
              Execution infrastructure overview
            </a>
          </li>
          <li>
            <a href="/execution/latency" className="underline">
              Latency optimization in execution systems
            </a>
          </li>
          <li>
            <a href="/execution/slippage" className="underline">
              Slippage measurement and control
            </a>
          </li>
        </ul>
      </section>

      {/* OPTION C — Editorial internal linking */}
      <section className="mt-12 border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold">
          Related infrastructure topics
        </h3>

        <ul className="list-disc pl-6 space-y-2 text-slate-700">
          <li>
            <a href="/execution" className="underline">
              Execution infrastructure overview
            </a>
          </li>
          <li>
            <a href="/execution/fix-api" className="underline">
              FIX API execution models
            </a>
          </li>
          <li>
            <a href="/explained/is-keystone-fx-a-broker" className="underline">
              Is Keystone FX a broker?
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-12 text-sm text-slate-600">
        <p>
          Keystone FX provides liquidity interaction infrastructure only. We do
          not provide liquidity as principal, do not act as counterparty, and do
          not assume trading risk.
        </p>
      </section>
    </main>
  );
}
