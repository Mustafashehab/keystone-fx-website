export default function LiquidityPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-slate-900">
      <h1 className="text-4xl font-semibold tracking-tight">
        Institutional FX Liquidity Infrastructure
      </h1>

      <p className="mt-6 text-lg text-slate-700">
        This page explains how institutional FX liquidity is accessed,
        aggregated, and interacted with at the infrastructure level. It is
        written for professional market participants and does not address
        retail brokerage models.
      </p>

      <section className="mt-12 space-y-6">
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

      <section className="mt-12 space-y-6">
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

      <section className="mt-12 space-y-6">
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

      <section className="mt-12 space-y-6">
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
