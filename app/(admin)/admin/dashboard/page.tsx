import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/layout/AdminHeader'

export default async function AdminDashboardPage() {
  const supabaseAuth = await createServerSupabaseClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) redirect('/admin/login')
  if (user.user_metadata?.role !== 'admin') redirect('/portal/dashboard')

  const supabase = await createServiceRoleClient()

  const [
    { count: totalClients },
    { count: pendingKYC },
    { count: openTickets },
    { count: newLeads },
    { data: recentClients },
    { data: recentKYC },
    { data: recentTickets },
  ] = await Promise.all([
    supabase.from('client_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('kyc_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('client_profiles').select('id, first_name, last_name, account_type, kyc_status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('kyc_submissions').select('id, client_id, status, submitted_at').eq('status', 'pending').order('submitted_at', { ascending: true }).limit(5),
    supabase.from('tickets').select('id, subject, priority, status, created_at').in('status', ['open', 'in_progress']).order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'Total Clients', value: totalClients ?? 0, href: '/admin/clients', urgent: false },
    { label: 'Pending KYC',   value: pendingKYC ?? 0,   href: '/admin/kyc',     urgent: (pendingKYC ?? 0) > 0 },
    { label: 'Open Tickets',  value: openTickets ?? 0,  href: '/admin/tickets', urgent: (openTickets ?? 0) > 0 },
    { label: 'New Leads',     value: newLeads ?? 0,     href: '/admin/leads',   urgent: false },
  ]

  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="Overview of platform activity" />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Link key={s.label} href={s.href}>
              <div className={`rounded-xl border p-5 bg-white transition-all hover:shadow-sm ${s.urgent ? 'border-orange-200 bg-orange-50' : 'border-[#e5e7eb]'}`}>
                <p className="text-xs font-medium uppercase tracking-wider text-[#94a3b8] mb-3">{s.label}</p>
                <p className={`text-3xl font-bold tabular-nums ${s.urgent ? 'text-orange-500' : 'text-[#0f172a]'}`}>
                  {s.value}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="rounded-xl border border-[#e5e7eb] bg-white">
            <SectionHeader title="Recent Clients" href="/admin/clients" />
            <div className="divide-y divide-[#f1f5f9]">
              {(recentClients ?? []).length === 0 ? (
                <EmptyRow message="No clients yet" />
              ) : (
                (recentClients ?? []).map((c) => (
                  <Link key={c.id} href={'/admin/clients/' + c.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#f8fafc] transition-colors">
                    <Avatar name={c.first_name + ' ' + c.last_name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0f172a] truncate">{c.first_name} {c.last_name}</p>
                      <p className="text-xs text-[#94a3b8] capitalize">{c.account_type}</p>
                    </div>
                    <KYCPill status={c.kyc_status} />
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white">
            <SectionHeader title="KYC Queue" href="/admin/kyc" urgent={(pendingKYC ?? 0) > 0} />
            <div className="divide-y divide-[#f1f5f9]">
              {(recentKYC ?? []).length === 0 ? (
                <EmptyRow message="No pending submissions" />
              ) : (
                (recentKYC ?? []).map((k) => (
                  <Link key={k.id} href={'/admin/kyc/' + k.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#f8fafc] transition-colors">
                    <div>
                      <p className="text-sm text-[#0f172a] font-mono">{k.client_id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-[#94a3b8]">{k.submitted_at ? formatTimeAgo(k.submitted_at) : 'Not submitted'}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
                      PENDING
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#e5e7eb] bg-white">
            <SectionHeader title="Open Tickets" href="/admin/tickets" />
            <div className="divide-y divide-[#f1f5f9]">
              {(recentTickets ?? []).length === 0 ? (
                <EmptyRow message="No open tickets" />
              ) : (
                (recentTickets ?? []).map((t) => (
                  <Link key={t.id} href={'/admin/tickets/' + t.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#f8fafc] transition-colors">
                    <PriorityDot priority={t.priority} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#0f172a] truncate">{t.subject}</p>
                      <p className="text-xs text-[#94a3b8]">{formatTimeAgo(t.created_at)}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Review KYC',     href: '/admin/kyc',       desc: 'Process pending submissions' },
              { label: 'View Documents', href: '/admin/documents', desc: 'Verify uploaded files' },
              { label: 'Manage Leads',   href: '/admin/leads',     desc: 'Update pipeline status' },
              { label: 'Answer Tickets', href: '/admin/tickets',   desc: 'Respond to client requests' },
            ].map((action) => (
              <Link key={action.label} href={action.href}
                className="p-3 rounded-xl border border-[#e5e7eb] hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all">
                <p className="text-sm font-medium text-[#0f172a]">{action.label}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title, href, urgent = false }: { title: string; href: string; urgent?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
      <p className="text-sm font-semibold text-[#0f172a]">{title}</p>
      <Link href={href} className={`text-xs ${urgent ? 'text-orange-500' : 'text-[#64748b]'} hover:underline`}>
        View all →
      </Link>
    </div>
  )
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="px-4 py-8 text-center">
      <p className="text-xs text-[#94a3b8]">{message}</p>
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-[#eef2f6] text-[#64748b]">
      {initials}
    </div>
  )
}

function KYCPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    not_started:  'bg-gray-100 text-gray-500',
    pending:      'bg-amber-100 text-amber-600',
    under_review: 'bg-blue-100 text-blue-600',
    approved:     'bg-green-100 text-green-600',
    rejected:     'bg-red-100 text-red-600',
  }
  const labels: Record<string, string> = {
    not_started: 'Not Started', pending: 'Pending',
    under_review: 'In Review', approved: 'Approved', rejected: 'Rejected',
  }
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${map[status] ?? map.not_started}`}>
      {labels[status] ?? status}
    </span>
  )
}

function PriorityDot({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    low: 'bg-gray-300', medium: 'bg-amber-400', high: 'bg-red-400', urgent: 'bg-red-600',
  }
  return <div className={`w-2 h-2 rounded-full shrink-0 ${colors[priority] ?? colors.medium}`} />
}

function formatTimeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 60)  return mins + 'm ago'
  if (hours < 24) return hours + 'h ago'
  return days + 'd ago'
}