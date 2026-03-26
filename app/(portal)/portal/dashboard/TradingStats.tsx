import { PortalHeader } from '@/components/layout/PortalHeader'
import { TradingStats } from '@/components/dashboard/TradingStats'

export default function DashboardPage() {
  return (
    <div className="flex flex-col">

      {/* HEADER */}
      <PortalHeader
        title="Dashboard"
        subtitle="Overview of your trading performance and account metrics"
      />

      {/* CONTENT */}
      <div className="p-6 space-y-6">

        {/* STATS */}
        <TradingStats />

        {/* LOWER GRID */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ACCOUNT SUMMARY */}
          <div className="kfx-panel p-6">
            <h2 className="kfx-section-title mb-4">
              Account Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--kfx-text-muted)]">
                  Account ID
                </span>
                <span>102938</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[var(--kfx-text-muted)]">
                  Balance
                </span>
                <span>$120,000</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[var(--kfx-text-muted)]">
                  Leverage
                </span>
                <span>1:100</span>
              </div>
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="kfx-panel p-6">
            <h2 className="kfx-section-title mb-4">
              Recent Activity
            </h2>

            <p className="text-sm text-[var(--kfx-text-muted)]">
              No recent trades.
            </p>
          </div>

          {/* SYSTEM STATUS */}
          <div className="kfx-panel p-6">
            <h2 className="kfx-section-title mb-4">
              System Status
            </h2>

            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              All systems operational
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}