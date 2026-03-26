'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { ticketSchema, type TicketFormData } from '@/lib/validations'
import { PortalHeader } from '@/components/layout/PortalHeader'
import { Card } from '@/components/ui/Card'
import { Input, Textarea, Select } from '@/components/ui/FormFields'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/Alert'
import { useToast } from '@/components/ui/Toast'
import { formatDateTime } from '@/lib/utils'
import type { Ticket, ClientProfile } from '@/types'

const PRIORITY_OPTIONS = [
  { label: 'Low',    value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High',   value: 'high' },
  { label: 'Urgent', value: 'urgent' },
]

const CATEGORY_OPTIONS = [
  { label: 'Account Verification', value: 'verification' },
  { label: 'Document Upload',      value: 'documents' },
  { label: 'Account Application',  value: 'application' },
  { label: 'Technical Issue',      value: 'technical' },
  { label: 'Other',                value: 'other' },
]

export default function SupportPage() {
  const router   = useRouter()
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [profile,  setProfile]  = useState<ClientProfile | null>(null)
  const [tickets,  setTickets]  = useState<Ticket[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { priority: 'medium' },
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/portal/login'); return }

      const { data: profileData } = await supabase
        .from('client_profiles').select('*').eq('user_id', user.id).single()

      if (!profileData) { setLoading(false); return }
      setProfile(profileData as ClientProfile)

      const { data: ticketsData } = await supabase
        .from('tickets')
        .select('*')
        .eq('client_id', profileData.id)
        .order('created_at', { ascending: false })

      setTickets((ticketsData ?? []) as Ticket[])
      setLoading(false)
    }
    load()
  }, [supabase, router])

  async function onSubmit(data: TicketFormData) {
    if (!profile) return
    try {
      const { data: ticket, error } = await supabase
        .from('tickets')
        .insert({
          client_id:   profile.id,
          subject:     data.subject,
          description: data.description,
          priority:    data.priority,
          category:    data.category ?? null,
          status:      'open',
        })
        .select()
        .single()

      if (error) throw new Error(error.message)
      setTickets((prev) => [ticket as Ticket, ...prev])
      success('Ticket created', 'Our support team will respond shortly.')
      reset()
      setShowForm(false)
    } catch (err: unknown) {
      toastError('Error', err instanceof Error ? err.message : 'Failed to create ticket')
    }
  }

  const openCount     = tickets.filter(
    (t) => t.status === 'open' || t.status === 'in_progress'
  ).length
  const resolvedCount = tickets.filter(
    (t) => t.status === 'resolved' || t.status === 'closed'
  ).length

  return (
    <div>
      <PortalHeader
        title="Support"
        subtitle="Get help with your account or submit a new request."
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
            icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            New Ticket
          </Button>
        }
      />

      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Tickets',     value: tickets.length },
            { label: 'Open / In Progress', value: openCount },
            { label: 'Resolved',          value: resolvedCount },
          ].map((s) => (
            <div key={s.label} className="kfx-card p-4 text-center">
              <p className="text-2xl font-semibold text-[var(--kfx-text)] tabular-nums">
                {s.value}
              </p>
              <p className="text-xs text-[var(--kfx-text-muted)] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Ticket list */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-[var(--kfx-border)]">
            <h2 className="text-sm font-semibold text-[var(--kfx-text)]">
              Your Tickets
            </h2>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-[var(--kfx-surface-raised)] rounded animate-pulse"
                />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <EmptyState
              title="No support tickets"
              description="You haven't submitted any support requests yet."
              action={
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowForm(true)}
                >
                  Create your first ticket
                </Button>
              }
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              }
            />
          ) : (
            <div className="divide-y divide-[var(--kfx-border-subtle)]">
              {tickets.map((ticket) => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => router.push(`/portal/support/${ticket.id}`)}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* New ticket modal */}
      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); reset() }}
        title="New Support Ticket"
        description="Describe your issue and we'll get back to you as soon as possible."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowForm(false); reset() }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Submit Ticket
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Subject" required
            placeholder="Brief description of your issue"
            error={errors.subject?.message}
            {...register('subject')}
          />
          <Textarea
            label="Description" required rows={5}
            placeholder="Please provide as much detail as possible…"
            error={errors.description?.message}
            {...register('description')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority" required
              options={PRIORITY_OPTIONS}
              error={errors.priority?.message}
              {...register('priority')}
            />
            <Select
              label="Category"
              options={CATEGORY_OPTIONS}
              placeholder="Select category"
              error={errors.category?.message}
              {...register('category')}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

function TicketRow({
  ticket,
  onClick,
}: {
  ticket: Ticket
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[var(--kfx-surface-raised)] transition-colors text-left group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-sm font-medium text-[var(--kfx-text)] truncate">
            {ticket.subject}
          </p>
          {ticket.category && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--kfx-surface-raised)] text-[var(--kfx-text-muted)] border border-[var(--kfx-border)] capitalize whitespace-nowrap">
              {ticket.category}
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--kfx-text-subtle)]">
          Opened {formatDateTime(ticket.created_at)}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge type="priority" status={ticket.priority} showDot={false} />
        <StatusBadge type="ticket"   status={ticket.status} />
        <svg
          className="w-4 h-4 text-[var(--kfx-text-subtle)] group-hover:text-[var(--kfx-accent)] transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}