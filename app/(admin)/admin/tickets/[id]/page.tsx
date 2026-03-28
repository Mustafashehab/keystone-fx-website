import { redirect, notFound } from 'next/navigation'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { formatDateTime } from '@/lib/utils'
import { AdminTicketThread } from '@/components/admin/AdminTicketThread'
import type { Ticket, TicketMessage } from '@/types'

const TICKET_STYLES: Record<string, string> = {
  open: 'bg-amber-100 text-amber-600', in_progress: 'bg-blue-100 text-blue-600',
  resolved: 'bg-green-100 text-green-600', closed: 'bg-gray-100 text-gray-500',
}
const PRIORITY_STYLES: Record<string, string> = {
  low: 'bg-gray-100 text-gray-500', medium: 'bg-amber-100 text-amber-600',
  high: 'bg-orange-100 text-orange-500', urgent: 'bg-red-100 text-red-600',
}

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabaseAuth = await createServerSupabaseClient()
  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) redirect('/admin/login')
  if (user.user_metadata?.role !== 'admin') redirect('/portal/dashboard')

  const supabase = await createServiceRoleClient()

  const [{ data: ticket }, { data: messages }] = await Promise.all([
    supabase.from('tickets').select('*').eq('id', id).single(),
    supabase.from('ticket_messages').select('*').eq('ticket_id', id).order('created_at', { ascending: true }),
  ])

  if (!ticket) notFound()

  const { data: profile } = await supabase
    .from('client_profiles').select('first_name, last_name').eq('id', ticket.client_id).single()

  return (
    <div>
      <AdminHeader
        title={ticket.subject}
        subtitle={(profile ? profile.first_name + ' ' + profile.last_name + ' · ' : '') + '#' + ticket.id.slice(0, 8).toUpperCase()}
        action={
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TICKET_STYLES[ticket.status] ?? TICKET_STYLES.open}`}>
            {ticket.status.replace(/_/g, ' ')}
          </span>
        }
      />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminTicketThread
            ticket={ticket as Ticket}
            initialMessages={(messages ?? []) as TicketMessage[]}
            adminId={user.id}
          />
        </div>

        <div>
          <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-[#f1f5f9] bg-[#f8fafc]">
              <p className="text-xs font-semibold text-[#64748b] uppercase tracking-widest">Ticket Details</p>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Status',   value: <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TICKET_STYLES[ticket.status]}`}>{ticket.status.replace(/_/g, ' ')}</span> },
                { label: 'Priority', value: <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_STYLES[ticket.priority]}`}>{ticket.priority}</span> },
                { label: 'Category', value: <span className="text-sm text-[#0f172a] capitalize">{ticket.category?.replace(/_/g, ' ') ?? '—'}</span> },
                { label: 'Client',   value: <span className="text-sm text-[#0f172a]">{profile ? profile.first_name + ' ' + profile.last_name : '—'}</span> },
                { label: 'Opened',   value: <span className="text-sm text-[#0f172a]">{formatDateTime(ticket.created_at)}</span> },
                ...(ticket.resolved_at ? [{ label: 'Resolved', value: <span className="text-sm text-[#0f172a]">{formatDateTime(ticket.resolved_at)}</span> }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-3 py-1 border-b border-[#f1f5f9] last:border-0">
                  <p className="text-xs text-[#94a3b8]">{label}</p>
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}