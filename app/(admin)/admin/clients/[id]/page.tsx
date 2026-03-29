import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { formatDate, formatDateTime, formatFileSize } from '@/lib/utils'
import { InternalNotesPanel } from '@/components/admin/InternalNotesPanel'
import { AdminWalletPanel } from '@/components/admin/AdminWalletPanel'

const KYC_STYLES: Record<string, string> = {
  not_started:  'bg-gray-100 text-gray-500',
  pending:      'bg-amber-100 text-amber-600',
  under_review: 'bg-blue-100 text-blue-600',
  approved:     'bg-green-100 text-green-600',
  rejected:     'bg-red-100 text-red-600',
}
const KYC_LABELS: Record<string, string> = {
  not_started: 'Not Started', pending: 'Pending',
  under_review: 'In Review', approved: 'Approved', rejected: 'Rejected',
}
const DOC_STYLES: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-600',
  verified: 'bg-green-100 text-green-600',
  rejected: 'bg-red-100 text-red-600',
}
const APP_STYLES: Record<string, string> = {
  draft:        'bg-gray-100 text-gray-500',
  submitted:    'bg-amber-100 text-amber-600',
  under_review: 'bg-blue-100 text-blue-600',
  approved:     'bg-green-100 text-green-600',
  rejected:     'bg-red-100 text-red-600',
}
const TICKET_STYLES: Record<string, string> = {
  open:        'bg-amber-100 text-amber-600',
  in_progress: 'bg-blue-100 text-blue-600',
  resolved:    'bg-green-100 text-green-600',
  closed:      'bg-gray-100 text-gray-500',
}

export default async function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabaseAuth = await createServerSupabaseClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) redirect('/admin/login')
  if (user.user_metadata?.role !== 'admin') redirect('/portal/dashboard')

  const supabase = await createServiceRoleClient()

  const [
    { data: profile },
    { data: kyc },
    { data: documents },
    { data: application },
    { data: tickets },
    { data: notes },
    { data: wallet },
  ] = await Promise.all([
    supabase.from('client_profiles').select('*').eq('id', id).single(),
    supabase.from('kyc_submissions').select('*').eq('client_id', id).maybeSingle(),
    supabase.from('documents').select('*').eq('client_id', id).order('uploaded_at', { ascending: false }),
    supabase.from('account_applications').select('*').eq('client_id', id).maybeSingle(),
    supabase.from('tickets').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('internal_notes').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('client_wallets').select('*').eq('client_id', id).maybeSingle(),
  ])

  if (!profile) notFound()

  return (
    <div>
      <AdminHeader
        title={profile.first_name + ' ' + profile.last_name}
        subtitle={'ID: ' + profile.id.slice(0, 8).toUpperCase() + ' · Registered ' + formatDate(profile.created_at)}
        action={
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${KYC_STYLES[kyc?.status ?? 'not_started']}`}>
            {KYC_LABELS[kyc?.status ?? 'not_started']}
          </span>
        }
      />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          <Section title="Personal Information">
            <Grid>
              <Field label="First Name"    value={profile.first_name} />
              <Field label="Last Name"     value={profile.last_name} />
              <Field label="Date of Birth" value={formatDate(profile.date_of_birth)} />
              <Field label="Nationality"   value={profile.nationality ?? '—'} />
              <Field label="Phone"         value={profile.phone ?? '—'} />
              <Field label="Account Type"  value={<span className="capitalize">{profile.account_type}</span>} />
              <Field label="Address"       value={profile.address_line1 ? profile.address_line1 + ', ' + profile.city + ', ' + profile.postal_code : '—'} />
              <Field label="Country"       value={profile.country_of_residence ?? '—'} />
            </Grid>
          </Section>

          {kyc && (
            <Section title="KYC Submission"
              action={<Link href={'/admin/kyc/' + kyc.id} className="text-xs text-blue-500 hover:underline">Review →</Link>}>
              <Grid>
                <Field label="Status"         value={<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${KYC_STYLES[kyc.status]}`}>{KYC_LABELS[kyc.status]}</span>} />
                <Field label="Submitted"       value={formatDateTime(kyc.submitted_at)} />
                <Field label="Employment"      value={kyc.employment_status ?? '—'} />
                <Field label="Income Range"    value={kyc.annual_income_range ?? '—'} />
                <Field label="Source of Funds" value={kyc.source_of_funds ?? '—'} />
                <Field label="PEP"             value={kyc.politically_exposed ? 'Yes' : 'No'} />
                <Field label="US Person"       value={kyc.us_person ? 'Yes' : 'No'} />
                <Field label="Tax Residency"   value={kyc.tax_residency ?? '—'} />
              </Grid>
            </Section>
          )}

          <Section title="Documents">
            {!documents || documents.length === 0 ? (
              <p className="text-sm text-[#94a3b8]">No documents uploaded.</p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#e5e7eb] bg-[#f8fafc]">
                    <div className="min-w-0">
                      <p className="text-sm text-[#0f172a] truncate">{doc.file_name}</p>
                      <p className="text-xs text-[#94a3b8] capitalize">{doc.type.replace(/_/g, ' ')} · {formatFileSize(doc.file_size)}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${DOC_STYLES[doc.status] ?? DOC_STYLES.pending}`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {application && (
            <Section title="Account Application">
              <Grid>
                <Field label="Status"          value={<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${APP_STYLES[application.status]}`}>{application.status}</span>} />
                <Field label="Account Type"    value={<span className="capitalize">{application.account_type}</span>} />
                <Field label="Base Currency"   value={application.base_currency ?? '—'} />
                <Field label="Platform"        value={application.platform_preference ?? '—'} />
                <Field label="Leverage"        value={application.leverage_preference ?? '—'} />
                <Field label="Initial Deposit" value={application.initial_deposit_amount ? '$' + application.initial_deposit_amount.toLocaleString() : '—'} />
                <Field label="Submitted"       value={formatDate(application.submitted_at)} />
                <Field label="Reviewed"        value={formatDate(application.reviewed_at)} />
              </Grid>
            </Section>
          )}

          {tickets && tickets.length > 0 && (
            <Section title="Support Tickets">
              <div className="space-y-2">
                {tickets.map((t) => (
                  <Link key={t.id} href={'/admin/tickets/' + t.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#e5e7eb] hover:bg-[#f8fafc] transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm text-[#0f172a] truncate">{t.subject}</p>
                      <p className="text-xs text-[#94a3b8]">{formatDateTime(t.created_at)}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TICKET_STYLES[t.status] ?? TICKET_STYLES.open}`}>
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            </Section>
          )}
        </div>

        <div className="space-y-5">
          <InternalNotesPanel
            clientId={id}
            authorId={user.id}
            initialNotes={(notes ?? []) as { id: string; content: string; author_id: string; created_at: string }[]}
          />
          {wallet && (
            <AdminWalletPanel
              clientId={id}
              wallet={wallet}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
        <h2 className="text-sm font-semibold text-[#0f172a]">{title}</h2>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">{children}</div>
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="py-1.5 border-b border-[#f1f5f9] last:border-0">
      <p className="text-[11px] text-[#94a3b8] uppercase tracking-wider mb-0.5">{label}</p>
      <div className="text-sm text-[#0f172a]">{value ?? '—'}</div>
    </div>
  )
}