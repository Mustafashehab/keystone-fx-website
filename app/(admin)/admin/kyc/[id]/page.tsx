import { redirect, notFound } from 'next/navigation'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { formatDateTime } from '@/lib/utils'
import { KYCReviewActions } from '@/components/admin/KYCReviewActions'
import type { KYCStatus } from '@/types'

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

export default async function AdminKYCDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabaseAuth = await createServerSupabaseClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) redirect('/admin/login')
  if (user.user_metadata?.role !== 'admin') redirect('/portal/dashboard')

  const supabase = await createServiceRoleClient()

  const { data: kyc } = await supabase.from('kyc_submissions').select('*').eq('id', id).single()
  if (!kyc) notFound()

  const { data: profile }   = await supabase.from('client_profiles').select('*').eq('id', kyc.client_id).single()
  const { data: documents } = await supabase.from('documents').select('*').eq('client_id', kyc.client_id).order('uploaded_at', { ascending: false })

  const isActionable = kyc.status === 'pending' || kyc.status === 'under_review'

  return (
    <div>
      <AdminHeader
        title="KYC Review"
        subtitle={(profile?.first_name ?? '') + ' ' + (profile?.last_name ?? '') + ' · ' + kyc.client_id.slice(0, 8).toUpperCase()}
        action={<span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${KYC_STYLES[kyc.status]}`}>{KYC_LABELS[kyc.status]}</span>}
      />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          <Section title="Personal Information">
            <Grid>
              <Field label="Full Name"     value={(profile?.first_name ?? '') + ' ' + (profile?.last_name ?? '')} />
              <Field label="Nationality"   value={profile?.nationality ?? '—'} />
              <Field label="Date of Birth" value={profile?.date_of_birth ?? '—'} />
              <Field label="Phone"         value={profile?.phone ?? '—'} />
              <Field label="Address"       value={profile?.address_line1 ? profile.address_line1 + ', ' + profile.city + ', ' + profile.postal_code : '—'} />
              <Field label="Country"       value={profile?.country_of_residence ?? '—'} />
            </Grid>
          </Section>

          <Section title="Financial Profile">
            <Grid>
              <Field label="Employment Status"     value={kyc.employment_status ?? '—'} />
              <Field label="Employer"              value={kyc.employer_name ?? '—'} />
              <Field label="Annual Income"         value={kyc.annual_income_range ?? '—'} />
              <Field label="Source of Funds"       value={kyc.source_of_funds ?? '—'} />
              <Field label="Trading Experience"    value={kyc.trading_experience ?? '—'} />
              <Field label="Investment Objectives" value={kyc.investment_objectives?.join(', ') ?? '—'} />
            </Grid>
          </Section>

          <Section title="Regulatory Declarations">
            <Grid>
              <Field label="Politically Exposed"
                value={kyc.politically_exposed ? <span className="text-red-500 font-semibold">YES</span> : 'No'} />
              {kyc.politically_exposed && kyc.pep_details && (
                <Field label="PEP Details" value={kyc.pep_details} />
              )}
              <Field label="US Person"
                value={kyc.us_person ? <span className="text-amber-500 font-semibold">YES</span> : 'No'} />
              <Field label="Tax Residency" value={kyc.tax_residency ?? '—'} />
              <Field label="Tax ID / TIN"  value={kyc.tax_id_number ?? '—'} />
            </Grid>
          </Section>

          <Section title="Submitted Documents">
            {!documents || documents.length === 0 ? (
              <p className="text-sm text-[#94a3b8]">No documents uploaded.</p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-[#e5e7eb] bg-[#f8fafc]">
                    <div>
                      <p className="text-sm text-[#0f172a]">{doc.file_name}</p>
                      <p className="text-xs text-[#94a3b8] capitalize">{doc.type.replace(/_/g, ' ')} · Uploaded {formatDateTime(doc.uploaded_at)}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-600' :
                      doc.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>{doc.status}</span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {kyc.rejection_reason && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-600">
              <strong>Previous rejection reason:</strong> {kyc.rejection_reason}
            </div>
          )}
        </div>

        <div>
          {isActionable ? (
            <KYCReviewActions kycId={kyc.id} clientId={kyc.client_id} reviewerId={user.id} currentStatus={kyc.status as KYCStatus} />
          ) : (
            <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 text-center">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${KYC_STYLES[kyc.status]}`}>{KYC_LABELS[kyc.status]}</span>
              <p className="text-xs text-[#94a3b8] mt-3">This submission has already been processed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-[#f1f5f9]">
        <h2 className="text-sm font-semibold text-[#0f172a]">{title}</h2>
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
      <div className="text-sm text-[#0f172a]">{value}</div>
    </div>
  )
}