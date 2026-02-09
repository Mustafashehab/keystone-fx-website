export default function ExecutionLatencyPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-slate-900">
      <h1 className="text-4xl font-semibold tracking-tight">
        Latency Optimization in Institutional FX Execution
      </h1>

      <p className="mt-6 text-lg text-slate-700">
        This page explains how latency is measured, interpreted, and managed in
        institutional FX execution systems. It is written for professional
        market participants operating latency-sensitive infrastructure.
      </p>

      {/* Anchor: latency synchronization */}
      <section
        id="latency-synchronization"
        className="mt-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Latency is a synchronization problem
        </h2>

        <p>
          In institutional execution, latency is not simply about speed. It is
          about synchronization between execution logic, liquidity venues, and
          market state.
        </p>

        <p>
          Execution failures often occur when routing decisions are made using
          outdated venue information or misaligned timestamps, even when raw
          network latency appears low.
        </p>
      </section>

      {/* Anchor: latency measurement */}
      <section
        id="latency-measurement"
        className="mt-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Measuring latency before optimizing
        </h2>

        <p>
          Effective latency management begins with accurate measurement.
          Institutional systems track latency across the entire order lifecycle,
          including order submission, venue acknowledgment, execution, and
          confirmation.
        </p>

        <p>
          Optimizing without measurement introduces hidden execution risk and
          false performance assumptions.
        </p>
      </section>

      {/* Anchor: venue behavior */}
      <section
        id="venue-response-behavior"
        className="mt-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Venue behavior and response consistency
        </h2>

        <p>
          Different liquidity venues exhibit distinct response characteristics.
          Some prioritize speed, others prioritize stability or depth.
        </p>

        <p>
          Latency optimization must account for venue behavior, not just network
          proximity. Execution logic that ignores venue response patterns
          increases slippage and rejection risk.
        </p>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-semibold">
          How this page connects to execution
        </h2>

        <ul className="list-disc pl-6 space-y-2">
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
