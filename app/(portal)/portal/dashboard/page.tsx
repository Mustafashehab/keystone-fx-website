import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getClientProfile } from '@/lib/dal/clients'
import { getKYCByClientId } from '@/lib/dal/kyc'
import { getDocumentsByClientId } from '@/lib/dal/documents'
import { getTicketsByClientId } from '@/lib/dal/tickets'
import type { Ticket } from '@/types'
import { DashboardContent } from './DashboardContent'

export default async function PortalDashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/portal/login')

  const { data: profile } = await getClientProfile(user.id)

  if (!profile) {
    return <DashboardContent hasProfile={false} />
  }

  const [{ data: kyc }, { data: documents }, { data: tickets }] =
    await Promise.all([
      getKYCByClientId(profile.id),
      getDocumentsByClientId(profile.id),
      getTicketsByClientId(profile.id),
    ])

  const verifiedDocs  = documents?.filter((d) => d.status === 'verified').length ?? 0
  const pendingDocs   = documents?.filter((d) => d.status === 'pending').length  ?? 0
  const totalDocs     = documents?.length ?? 0
  const openTickets   = tickets?.filter(
    (t: Ticket) => t.status === 'open' || t.status === 'in_progress'
  ).length ?? 0
  const recentTickets = (tickets ?? []).slice(0, 3) as Ticket[]

  const kycVerified       = kyc?.status === 'approved'
  const onboardingComplete = profile.onboarding_step >= 4 && kycVerified

  return (
    <DashboardContent
      hasProfile
      firstName={profile.first_name}
      lastName={profile.last_name}
      email={user.email ?? '—'}
      accountType={profile.account_type}
      kycStatus={kyc?.status ?? 'not_started'}
      onboardingStep={profile.onboarding_step}
      onboardingComplete={onboardingComplete}
      verifiedDocs={verifiedDocs}
      pendingDocs={pendingDocs}
      totalDocs={totalDocs}
      openTickets={openTickets}
      recentTickets={recentTickets}
      memberSince={profile.created_at}
    />
  )
}
