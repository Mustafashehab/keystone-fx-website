'use client'

import Link from 'next/link'
import { usePortalI18n } from '@/lib/portal-i18n'
import { PortalHeader } from '@/components/layout/PortalHeader'
import { Card, StatCard } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'
import type { Ticket } from '@/types'

type Props =
  | { hasProfile: false }
  | {
      hasProfile: true
      firstName: string
      lastName: string
      email: string
      accountType: string
      kycStatus: string
      onboardingStep: number
      onboardingComplete: boolean
      verifiedDocs: number
      pendingDocs: number
      totalDocs: number
      openTickets: number
      recentTickets: Ticket[]
      memberSince: string
    }

export function DashboardContent(props: Props) {
  const { t } = usePortalI18n()
  const d = t.dashboard

  if (!props.hasProfile) {
    return (
      <div className="p-6">
        <div className="kfx-card p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">{d.profileSetup}</h2>
          <p className="text-sm text-[var(--kfx-text-muted)] mb-4">
            {d.profileSetupDesc}
          </p>
          <Link href="/portal/kyc" className="kfx-btn-primary">
            {d.startVerification}
          </Link>
        </div>
      </div>
    )
  }

  const {
    firstName, lastName, email, accountType, kycStatus,
    onboardingStep, onboardingComplete,
    verifiedDocs, pendingDocs, totalDocs,
    openTickets, recentTickets, memberSince,
  } = props

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">

      <PortalHeader
        title={`${d.welcomeBack} ${firstName}`}
        subtitle={d.subtitle}
      />

      {!onboardingComplete && (
        <OnboardingBanner step={onboardingStep} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label={d.kycStatus}
          value={d.kycLabel[kycStatus as keyof typeof d.kycLabel] ?? kycStatus}
          icon={<ShieldIcon />}
        />
        <StatCard
          label={d.documentsVerified}
          value={`${verifiedDocs} / ${totalDocs}`}
          delta={pendingDocs > 0 ? `${pendingDocs} ${d.pending}` : undefined}
          deltaType="neutral"
          icon={<DocumentIcon />}
        />
        <StatCard
          label={d.application}
          value={onboardingStep >= 3 ? d.submitted : d.notStarted}
          icon={<ApplicationIcon />}
        />
        <StatCard
          label={d.openTickets}
          value={openTickets}
          icon={<TicketIcon />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2">
          <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-4">
            {d.onboardingProgress}
          </h2>
          <div className="space-y-3">
            <ChecklistItem
              label={d.documentUpload}
              description={d.documentUploadDesc}
              href="/portal/documents"
              status={
                verifiedDocs > 0 && pendingDocs === 0
                  ? 'complete'
                  : totalDocs > 0
                  ? 'in_progress'
                  : 'pending'
              }
            />
            <ChecklistItem
              label={d.accountApplication}
              description={d.accountApplicationDesc}
              href="/portal/account-application"
              status={
                onboardingStep >= 4
                  ? 'complete'
                  : onboardingStep >= 3
                  ? 'in_progress'
                  : 'pending'
              }
            />
            <ChecklistItem
              label={d.approval}
              description={d.approvalDesc}
              href="/portal/dashboard"
              status={onboardingComplete ? 'complete' : 'pending'}
              locked
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-[var(--kfx-text)] mb-4">
            {d.accountOverview}
          </h2>
          <div className="space-y-3">
            <InfoRow label={d.fullName}    value={`${firstName} ${lastName}`} />
            <InfoRow label={d.email}       value={email} />
            <InfoRow label={d.accountType} value={d.accountTypeLabel[accountType as keyof typeof d.accountTypeLabel] ?? accountType} />
            <InfoRow
              label={d.kycStatus}
              value={<StatusBadge type="kyc" status={kycStatus as "not_started" | "pending" | "under_review" | "approved" | "rejected"} />}
            />
            <InfoRow label={d.memberSince} value={formatDate(memberSince)} />
          </div>
          <div className="mt-5 pt-4 border-t border-[var(--kfx-border)]">
            <Link href="/portal/profile" className="text-sm text-[var(--kfx-accent)] hover:underline">
              {d.editProfile}
            </Link>
          </div>
        </Card>
      </div>

      {recentTickets.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--kfx-text)]">
              {d.recentTickets}
            </h2>
            <Link href="/portal/support" className="text-xs text-[var(--kfx-accent)] hover:underline">
              {d.viewAll}
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function OnboardingBanner({ step }: { step: number }) {
  const { t } = usePortalI18n()
  const b = t.dashboard.onboardingBanner

  const messages: Record<number, { title: string; body: string; href: string; cta: string }> = {
    0: {
      title: b.uploadDocs,
      body:  b.uploadDocsBody,
      href:  '/portal/documents',
      cta:   b.uploadDocsCta,
    },
    1: {
      title: b.uploadDocs,
      body:  b.uploadDocsBody,
      href:  '/portal/documents',
      cta:   b.uploadDocsCta,
    },
    2: {
      title: b.submitApp,
      body:  b.submitAppBody,
      href:  '/portal/account-application',
      cta:   b.submitAppCta,
    },
    3: {
      title: b.underReview,
      body:  b.underReviewBody,
      href:  '/portal/dashboard',
      cta:   b.underReviewCta,
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
          <p className="text-sm font-semibold text-[var(--kfx-text)]">{config.title}</p>
          <p className="text-xs text-[var(--kfx-text-muted)] mt-0.5">{config.body}</p>
        </div>
      </div>
      <Link href={config.href} className="kfx-btn-primary text-xs !px-3 !py-2 shrink-0">
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
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
        <p className={`text-sm font-medium ${status === 'complete' ? 'text-[var(--kfx-text-muted)] line-through' : 'text-[var(--kfx-text)]'}`}>
          {label}
        </p>
        <p className="text-xs text-[var(--kfx-text-subtle)] mt-0.5 truncate">{description}</p>
      </div>
      {!locked && status !== 'complete' && (
        <svg className="w-4 h-4 text-[var(--kfx-text-subtle)] group-hover:text-[var(--kfx-accent)] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  )

  if (locked || status === 'complete') {
    return <div>{inner}</div>
  }
  return <Link href={href}>{inner}</Link>
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
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
        <span className="text-sm text-[var(--kfx-text)] truncate">{ticket.subject}</span>
      </div>
      <span className="text-xs text-[var(--kfx-text-subtle)] shrink-0">
        {formatDate(ticket.created_at)}
      </span>
    </Link>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ShieldIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const DocumentIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const ApplicationIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

const TicketIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
)
