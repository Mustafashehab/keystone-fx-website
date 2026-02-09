export default function ExecutionSlippagePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-slate-900">
      <h1 className="text-4xl font-semibold tracking-tight">
        Slippage Measurement and Control in FX Execution
      </h1>

      <p className="mt-6 text-lg text-slate-700">
        This page explains how slippage is defined, measured, and interpreted in
        institutional FX execution environments. It is written for professional
        market participants who require transparent execution analysis.
      </p>

      {/* Anchor: slippage definition */}
      <section
        id="slippage-definition"
        className="mt-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Slippage is not an execution failure
        </h2>

        <p>
          Slippage is often misunderstood as poor execution. In reality,
          slippage reflects the interaction between order size, market depth,
          venue behavior, and timing.
        </p>

        <p>
          Attempting to eliminate slippage entirely usually introduces hidden
          costs, such as rejected orders or delayed execution.
        </p>
      </section>

      {/* Anchor: pre vs post trade */}
      <section
        id="pre-post-trade-slippage"
        className="mt-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Pre-trade vs post-trade slippage
        </h2>

        <p>
          Institutional execution systems distinguish between pre-trade
          slippage, which results from market movement before execution, and
          post-trade slippage, which reflects venue behavior during execution.
        </p>

        <p>
          Accurate slippage measurement requires timestamp alignment and
          consistent reference pricing across venues.
        </p>
      </section>

      {/* Anchor: transparency */}
      <section
        id="slippage-transparency"
        className="mt-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Transparency over concealment
        </h2>

        <p>
          Execution quality improves when slippage is measured honestly and
          analyzed systematically. Concealing slippage through internalization
          or price smoothing obscures execution risk.
        </p>

        <p>
          Keystone FX infrastructure supports transparent slippage analysis as a
          foundation for execution improvement.
        </p>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-2xl font-semibold">
          How this page fits the execution model
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
            <a href="/execution/latency" className="underline">
              Latency optimization in execution systems
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
