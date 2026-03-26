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
  if (!profile) redirect('/portal/kyc')

  const [{ data: kyc }, { data: documents }, { data: tickets }] = await Promise.all([
    getKYCByClientId(profile.id),
    getDocumentsByClientId(profile.id),
    getTicketsByClientId(profile.id),
  ])

  const verifiedDocs  = documents?.filter((d) => d.status === 'verified').length ?? 0
  const pendingDocs   = documents?.filter((d) => d.status === 'pending').length  ?? 0
  const openTickets   = tickets?.filter(
    (t) => t.status === 'open' || t.status === 'in_progress'
  ).length ?? 0
  const recentTickets = (tickets ?? []).slice(0, 3)
  const onboardingComplete =
    profile.onboarding_step >= 4 && kyc?.status === 'approved'

  return (
    <div>
      <PortalHeader
        title={`Welcome back, ${profile.first_name}`}
        subtitle="Here's an overview of your account status."
      />

      <div className="p-6 space-y-6">

        {/* Onboarding banner */}
        {!onboardingComplete && (
          <OnboardingBanner step={profile.onboarding_step} />
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="KYC Status"
            value={formatKYCLabel(kyc?.status ?? 'not_started')}
            icon={<ShieldIcon />}
          />
          <StatCard
            label="Documents Verified"
            value={`${verifiedDocs} / ${documents?.length ?? 0}`}
            delta={pendingDocs > 0 ? `${pendingDocs} pending review` : undefined}
            deltaType="neutral"
            icon={<DocumentIcon />}
          />
          <StatCard
            label="Account Application"
            value={profile.onboarding_step >= 3 ? 'Submitted' : 'Not Started'}
            icon={<ApplicationIcon />}
          />
          <StatCard
            label="Open Tickets"
            value={openTickets}
            icon={<TicketIcon />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Onboarding checklist */}
          <Card className="lg:col-span-2">
            <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-4">
              Onboarding Checklist
            </h2>
            <div className="space-y-3">
              <ChecklistItem
                label="KYC Verification"
                description="Complete your Know Your Customer profile"
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
                description="Upload passport, proof of address, and other required documents"
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
                description="Submit your trading account configuration"
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
                label="Account Approval"
                description="Your application is under review by our team"
                href="/portal/dashboard"
                status={onboardingComplete ? 'complete' : 'pending'}
                locked
              />
            </div>
          </Card>

          {/* Account info */}
          <Card>
            <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-4">
              Account Details
            </h2>
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
            <div className="mt-5 pt-4 border-t border-[var(--kfx-border)]">
              <Link
                href="/portal/profile"
                className="text-sm text-[var(--kfx-accent)] hover:underline"
              >
                Edit profile →
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent tickets */}
        {recentTickets.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[var(--kfx-text)]">
                Recent Support Tickets
              </h2>
              <Link
                href="/portal/support"
                className="text-xs text-[var(--kfx-accent)] hover:underline"
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
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OnboardingBanner({ step }: { step: number }) {
  const messages: Record
    number,
    { title: string; body: string; href: string; cta: string }
  > = {
    0: {
      title: 'Complete your KYC verification',
      body: 'To activate your account, please complete your Know Your Customer profile.',
      href: '/portal/kyc',
      cta: 'Start KYC',
    },
    1: {
      title: 'Upload your documents',
      body: 'Your KYC profile is saved. Upload the required identity and address documents next.',
      href: '/portal/documents',
      cta: 'Upload Documents',
    },
    2: {
      title: 'Submit your account application',
      body: 'Documents received. Configure and submit your trading account preferences.',
      href: '/portal/account-application',
      cta: 'Apply Now',
    },
    3: {
      title: 'Application under review',
      body: 'Your application has been submitted. Our team will review it shortly.',
      href: '/portal/dashboard',
      cta: 'View Status',
    },
  }

  const config = messages[Math.min(step, 3)]
  if (!config) return null

  return (
    <div className="rounded-lg border border-[var(--kfx-accent)]/20 bg-[var(--kfx-accent-muted)] p-4 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--kfx-accent)] flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">{step + 1}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--kfx-text)]">
            {config.title}
          </p>
          <p className="text-xs text-[var(--kfx-text-muted)] mt-0.5">
            {config.body}
          </p>
        </div>
      </div>
      <Link
        href={config.href}
        className="kfx-btn-primary text-xs !px-3 !py-2 shrink-0"
      >
        {config.cta}
      </Link>
    </div>
  )
}

function ChecklistItem({
  label,
  description,
  href,
  status,
  locked = false,
}: {
  label: string
  description: string
  href: string
  status: 'complete' | 'in_progress' | 'pending'
  locked?: boolean
}) {
  const icon =
    status === 'complete' ? (
      <div className="w-6 h-6 rounded-full bg-[var(--kfx-success)] flex items-center justify-center shrink-0">
        <svg
          className="w-3.5 h-3.5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    ) : status === 'in_progress' ? (
      <div className="w-6 h-6 rounded-full bg-[var(--kfx-accent-muted)] border-2 border-[var(--kfx-accent)] flex items-center justify-center shrink-0">
        <div className="w-2 h-2 rounded-full bg-[var(--kfx-accent)]" />
      </div>
    ) : (
      <div className="w-6 h-6 rounded-full bg-[var(--kfx-surface-raised)] border border-[var(--kfx-border)] flex items-center justify-center shrink-0">
        <div className="w-2 h-2 rounded-full bg-[var(--kfx-text-subtle)]" />
      </div>
    )

  const inner = (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--kfx-border)] hover:border-[var(--kfx-accent)]/40 hover:bg-[var(--kfx-surface-raised)] transition-all group">
      {icon}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            status === 'complete'
              ? 'text-[var(--kfx-text-muted)] line-through'
              : 'text-[var(--kfx-text)]'
          }`}
        >
          {label}
        </p>
        <p className="text-xs text-[var(--kfx-text-subtle)] mt-0.5 truncate">
          {description}
        </p>
      </div>
      {!locked && status !== 'complete' && (
        <svg
          className="w-4 h-4 text-[var(--kfx-text-subtle)] group-hover:text-[var(--kfx-accent)] transition-colors shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </div>
  )

  if (locked || status === 'complete') return <div>{inner}</div>
  return <Link href={href}>{inner}</Link>
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 border-b border-[var(--kfx-border-subtle)] last:border-0">
      <span className="text-xs text-[var(--kfx-text-muted)] shrink-0">{label}</span>
      <span className="text-xs text-[var(--kfx-text)] text-right">{value}</span>
    </div>
  )
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <Link
      href={`/portal/support/${ticket.id}`}
      className="flex items-center justify-between gap-4 p-3 rounded-lg border border-[var(--kfx-border)] hover:bg-[var(--kfx-surface-raised)] transition-colors group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <StatusBadge type="ticket" status={ticket.status} showDot />
        <span className="text-sm text-[var(--kfx-text)] truncate">
          {ticket.subject}
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-[var(--kfx-text-subtle)]">
          {formatDate(ticket.created_at)}
        </span>
        <svg
          className="w-4 h-4 text-[var(--kfx-text-subtle)] group-hover:text-[var(--kfx-accent)] transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ShieldIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const DocumentIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const ApplicationIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
)

const TicketIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
    />
  </svg>
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatKYCLabel(status: string): string {
  const map: Record<string, string> = {
    not_started:  'Not Started',
    pending:      'Pending',
    under_review: 'In Review',
    approved:     'Approved',
    rejected:     'Rejected',
  }
  return map[status] ?? status
}

function formatAccountType(type: string): string {
  const map: Record<string, string> = {
    individual:    'Individual',
    professional:  'Professional',
    institutional: 'Institutional',
  }
  return map[type] ?? type
}