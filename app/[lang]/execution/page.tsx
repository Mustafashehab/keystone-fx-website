export default function ExecutionPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-slate-900">
      <h1 className="text-4xl font-semibold tracking-tight">
        Institutional FX Execution Infrastructure
      </h1>

      <p className="mt-6 text-lg text-slate-700">
        This page is written for professional market participants evaluating or
        operating institutional FX execution infrastructure. It is not intended
        for retail trading audiences.
      </p>

      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold">
          Execution is a system, not a feature
        </h2>

        <p>
          In institutional FX, execution quality is determined by how orders are
          routed, how liquidity venues are selected, how latency is managed, and
          how slippage is measured. Retail concepts such as “tight spreads” or
          “fast execution” are incomplete abstractions at this level.
        </p>

        <p>
          Execution failures typically arise from systemic issues: misaligned
          venue timestamps, delayed acknowledgements, or routing logic that
          cannot adapt to changing liquidity conditions.
        </p>
      </section>

      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold">
          Keystone FX execution philosophy
        </h2>

        <p>
          Keystone FX provides execution-focused infrastructure designed to
          operate outside brokerage and custody roles. Our systems are built
          around deterministic routing logic, transparent latency measurement,
          and venue-aware liquidity interaction.
        </p>

        <p>
          We do not internalize flow. We do not warehouse risk. We do not act as
          counterparty.
        </p>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-semibold">
          Execution topics covered in detail
        </h2>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <a href="/execution/fix-api" className="underline">
              FIX API execution models
            </a>
          </li>
          <li>
            <a href="/execution/latency" className="underline">
              Latency optimization in FX execution
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
          Keystone FX provides execution infrastructure only. We do not operate
          as a broker, do not accept or hold client funds, and do not provide
          regulated investment or advisory services.
        </p>
      </section>
    </main>
  );
}
