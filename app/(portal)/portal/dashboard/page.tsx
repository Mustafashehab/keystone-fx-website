import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getClientProfile } from '@/lib/dal/clients'
import { getKYCByClientId } from '@/lib/dal/kyc'
import { getDocumentsByClientId } from '@/lib/dal/documents'
import { getTicketsByClientId } from '@/lib/dal/tickets'

import { PortalHeader } from '@/components/layout/PortalHeader'
import { Card, StatCard } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'

import { formatDate } from '@/lib/utils'
import type { Ticket } from '@/types'

export default async function PortalDashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/portal/login')

  const { data: profile } = await getClientProfile(user.id)

  // ✅ FIX: NO REDIRECT → SHOW UI INSTEAD
  if (!profile) {
    return (
      <div className="p-6">
        <div className="kfx-panel p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">
            Profile Setup Required
          </h2>
          <p className="text-sm text-[var(--kfx-text-muted)] mb-4">
            Please complete your onboarding to continue.
          </p>

          <Link href="/portal/kyc" className="kfx-btn kfx-btn-primary">
            Start Verification
          </Link>
        </div>
      </div>
    )
  }

  const [{ data: kyc }, { data: documents }, { data: tickets }] =
    await Promise.all([
      getKYCByClientId(profile.id),
      getDocumentsByClientId(profile.id),
      getTicketsByClientId(profile.id),
    ])

  const verifiedDocs =
    documents?.filter((d) => d.status === 'verified').length ?? 0

  const pendingDocs =
    documents?.filter((d) => d.status === 'pending').length ?? 0

  const openTickets =
    tickets?.filter(
      (t) => t.status === 'open' || t.status === 'in_progress'
    ).length ?? 0

  const recentTickets = (tickets ?? []).slice(0, 3)

  const onboardingComplete =
  (profile?.onboarding_step ?? 0) >= 4 &&
  kyc?.status === 'approved'

const kycVerified = kyc?.status === 'approved'
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">

      {/* HEADER */}
      <PortalHeader
        title={`Welcome back, ${profile.first_name}`}
        subtitle="Monitor your onboarding status, account profile, and recent support activity."
      />

      {/* ✅ NON-BLOCKING KYC WARNING */}
      {!kycVerified && (
        <div className="kfx-panel p-4 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">
              KYC Required
            </span>
            <p className="text-[var(--kfx-text-muted)]">
              Complete verification to unlock full account functionality.
            </p>
          </div>

          <Link href="/portal/kyc" className="kfx-btn kfx-btn-primary">
            Complete KYC
          </Link>
        </div>
      )}

      {/* ONBOARDING */}
      {!onboardingComplete && (
        <OnboardingBanner step={profile.onboarding_step} />
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="KYC Status"
          value={formatKYCLabel(kyc?.status ?? 'not_started')}
          icon={<ShieldIcon />}
        />
        <StatCard
          label="Documents Verified"
          value={`${verifiedDocs} / ${documents?.length ?? 0}`}
          delta={pendingDocs > 0 ? `${pendingDocs} pending` : undefined}
          deltaType="neutral"
          icon={<DocumentIcon />}
        />
        <StatCard
          label="Application"
          value={profile.onboarding_step >= 3 ? 'Submitted' : 'Not Started'}
          icon={<ApplicationIcon />}
        />
        <StatCard
          label="Open Tickets"
          value={openTickets}
          icon={<TicketIcon />}
        />
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* LEFT */}
        <Card className="xl:col-span-2 kfx-hover-lift" raised>
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--kfx-text-muted)] mb-2">
              Onboarding
            </p>
            <h2 className="text-lg font-semibold">
              Progress
            </h2>
          </div>

          <div className="space-y-3">
            <ChecklistItem
              label="KYC Verification"
              description="Complete your identity verification"
              href="/portal/kyc"
              status={
                kyc?.status === 'approved'
                  ? 'complete'
                  : kyc
                  ? 'in_progress'
                  : 'pending'
              }
            />

            <ChecklistItem
              label="Document Upload"
              description="Upload identity and address documents"
              href="/portal/documents"
              status={
                verifiedDocs > 0 && pendingDocs === 0
                  ? 'complete'
                  : (documents?.length ?? 0) > 0
                  ? 'in_progress'
                  : 'pending'
              }
            />

            <ChecklistItem
              label="Account Application"
              description="Submit your trading configuration"
              href="/portal/account-application"
              status={
                profile.onboarding_step >= 4
                  ? 'complete'
                  : profile.onboarding_step >= 3
                  ? 'in_progress'
                  : 'pending'
              }
            />

            <ChecklistItem
              label="Approval"
              description="Review by Keystone FX team"
              href="/portal/dashboard"
              status={onboardingComplete ? 'complete' : 'pending'}
              locked
            />
          </div>
        </Card>

        {/* RIGHT */}
        <Card className="kfx-hover-lift">
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--kfx-text-muted)] mb-2">
              Profile
            </p>
            <h2 className="text-lg font-semibold">
              Account Overview
            </h2>
          </div>

          <div className="space-y-3">
            <InfoRow
              label="Full Name"
              value={`${profile.first_name} ${profile.last_name}`}
            />
            <InfoRow label="Email" value={user.email ?? '—'} />
            <InfoRow
              label="Account Type"
              value={formatAccountType(profile.account_type)}
            />
            <InfoRow
              label="KYC Status"
              value={
                <StatusBadge
                  type="kyc"
                  status={kyc?.status ?? 'not_started'}
                />
              }
            />
            <InfoRow
              label="Member Since"
              value={formatDate(profile.created_at)}
            />
          </div>

          <div className="mt-6 pt-5 border-t border-[var(--kfx-border-subtle)]">
            <Link
              href="/portal/profile"
              className="text-sm text-[var(--kfx-accent)] hover:opacity-80 transition"
            >
              Edit profile →
            </Link>
          </div>
        </Card>
      </div>

      {/* SUPPORT */}
      {recentTickets.length > 0 && (
        <Card className="kfx-hover-lift">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--kfx-text-muted)] mb-2">
                Support
              </p>
              <h2 className="text-lg font-semibold">
                Recent Activity
              </h2>
            </div>

            <Link
              href="/portal/support"
              className="text-xs text-[var(--kfx-accent)] hover:opacity-80 transition"
            >
              View all
            </Link>
          </div>

          <div className="space-y-2">
            {recentTickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

/* ================= HELPERS ================= */

function InfoRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--kfx-border-subtle)] last:border-0">
      <span className="text-xs text-[var(--kfx-text-muted)]">{label}</span>
      <span className="text-xs text-right">{value}</span>
    </div>
  )
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <Link
      href={`/portal/support/${ticket.id}`}
      className="flex items-center justify-between p-3 rounded-xl border border-[var(--kfx-border-subtle)] hover:bg-[var(--kfx-surface-soft)] transition"
    >
      <div className="flex items-center gap-2">
        <StatusBadge type="ticket" status={ticket.status} />
        <span className="text-sm">{ticket.subject}</span>
      </div>
      <span className="text-xs text-[var(--kfx-text-muted)]">
        {formatDate(ticket.created_at)}
      </span>
    </Link>
  )
}

const ShieldIcon = () => <span>🛡️</span>
const DocumentIcon = () => <span>📄</span>
const ApplicationIcon = () => <span>📊</span>
const TicketIcon = () => <span>🎫</span>

function formatKYCLabel(status: string): string {
  const map: Record<string, string> = {
    not_started: 'Not Started',
    pending: 'Pending',
    under_review: 'In Review',
    approved: 'Approved',
    rejected: 'Rejected',
  }
  return map[status] ?? status
}

function formatAccountType(type: string): string {
  const map: Record<string, string> = {
    individual: 'Individual',
    professional: 'Professional',
    institutional: 'Institutional',
  }
  return map[type] ?? type
}