export default function FixApiExecutionPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-slate-900">
      <h1 className="text-4xl font-semibold tracking-tight">
        FIX API Execution Models
      </h1>

      <p className="mt-6 text-lg text-slate-700">
        This page explains how FIX API–based execution systems operate in
        institutional FX environments. It is written for professional market
        participants and assumes familiarity with electronic trading
        infrastructure.
      </p>

      {/* Anchor: FIX control layer */}
      <section
        id="fix-control-layer"
        className="mt-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          FIX is an execution control layer
        </h2>

        <p>
          FIX is not a speed feature. It is a control protocol that defines how
          orders are created, routed, acknowledged, filled, and reconciled
          across venues.
        </p>

        <p>
          In institutional environments, FIX enforces deterministic behavior
          across the execution lifecycle. Performance depends on how FIX
          sessions are implemented, monitored, and synchronized — not on the
          protocol itself.
        </p>
      </section>

      {/* Anchor: session design */}
      <section
        id="fix-session-design"
        className="mt-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Session design and order lifecycle
        </h2>

        <p>
          A FIX session represents a stateful communication channel between
          execution systems. Order integrity depends on sequence control,
          heartbeat stability, and recovery logic.
        </p>

        <p>
          Poor session management — not venue speed — is a common source of
          execution failure, including dropped orders, duplicate fills, and
          reconciliation errors.
        </p>
      </section>

      {/* Anchor: routing models */}
      <section
        id="fix-routing-models"
        className="mt-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Deterministic vs adaptive routing
        </h2>

        <p>
          FIX-based execution can support both deterministic and adaptive
          routing models.
        </p>

        <p>
          Deterministic models route orders based on predefined logic. Adaptive
          models adjust routing dynamically based on venue behavior, latency
          feedback, and fill quality.
        </p>

        <p>
          Keystone FX infrastructure supports execution logic where FIX acts as
          the enforcement layer, not the decision-maker.
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
          Keystone FX provides execution infrastructure only. We do not operate
          as a broker, do not accept or hold client funds, and do not provide
          regulated investment or advisory services.
        </p>
      </section>
    </main>
  );
}
