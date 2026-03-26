'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PortalHeader } from '@/components/layout/PortalHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useToast } from '@/components/ui/Toast'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Ticket, TicketMessage } from '@/types'

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id     = params.id as string
  const supabase = createClient()
  const { error: toastError } = useToast()

  const [ticket,   setTicket]   = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [userId,   setUserId]   = useState<string | null>(null)
  const [reply,    setReply]    = useState('')
  const [sending,  setSending]  = useState(false)
  const [loading,  setLoading]  = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/portal/login'); return }
      setUserId(user.id)

      const [ticketRes, messagesRes] = await Promise.all([
        supabase.from('tickets').select('*').eq('id', id).single(),
        supabase.from('ticket_messages').select('*').eq('ticket_id', id).order('created_at', { ascending: true }),
      ])

      if (ticketRes.error) { router.push('/portal/support'); return }
      setTicket(ticketRes.data as Ticket)
      setMessages((messagesRes.data ?? []) as TicketMessage[])
      setLoading(false)
    }
    load()
  }, [supabase, router, id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendReply() {
    if (!reply.trim() || !userId || !ticket) return
    setSending(true)
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id:   ticket.id,
          sender_id:   userId,
          sender_role: 'client',
          content:     reply.trim(),
        })
        .select()
        .single()

      if (error) throw new Error(error.message)
      setMessages((prev) => [...prev, data as TicketMessage])
      setReply('')
    } catch (err: unknown) {
      toastError('Send failed', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div>
        <PortalHeader title="Support Ticket" />
        <div className="p-6">
          <div className="h-64 bg-[var(--kfx-surface-raised)] rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (!ticket) return null

  const isClosed = ticket.status === 'closed' || ticket.status === 'resolved'

  return (
    <div>
      <PortalHeader
        title={ticket.subject}
        subtitle={`Ticket #${ticket.id.slice(0, 8).toUpperCase()}`}
        action={<StatusBadge type="ticket" status={ticket.status} />}
      />

      <div className="p-6 space-y-5">

        {/* Ticket metadata */}
        <Card>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-[var(--kfx-text-muted)] mb-1">Status</p>
              <StatusBadge type="ticket" status={ticket.status} />
            </div>
            <div>
              <p className="text-xs text-[var(--kfx-text-muted)] mb-1">Priority</p>
              <StatusBadge type="priority" status={ticket.priority} />
            </div>
            <div>
              <p className="text-xs text-[var(--kfx-text-muted)] mb-1">Category</p>
              <p className="text-sm text-[var(--kfx-text)] capitalize">
                {ticket.category?.replace(/_/g, ' ') ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--kfx-text-muted)] mb-1">Opened</p>
              <p className="text-sm text-[var(--kfx-text)]">{formatDateTime(ticket.created_at)}</p>
            </div>
          </div>
        </Card>

        {/* Message thread */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-[var(--kfx-border)]">
            <h2 className="text-sm font-semibold text-[var(--kfx-text)]">Messages</h2>
          </div>

          <div className="p-5 space-y-4 min-h-[200px] max-h-[480px] overflow-y-auto">
            {/* Original description */}
            <MessageBubble
              content={ticket.description}
              role="client"
              isOwn={true}
              time={ticket.created_at}
            />

            {/* Thread messages */}
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                content={msg.content}
                role={msg.sender_role as 'client' | 'admin'}
                isOwn={msg.sender_role === 'client'}
                time={msg.created_at}
              />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Reply box */}
          {!isClosed && (
            <div className="border-t border-[var(--kfx-border)] p-4">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendReply()
                }}
                placeholder="Write a reply… (Cmd+Enter to send)"
                rows={3}
                className="kfx-input resize-none w-full"
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-[var(--kfx-text-subtle)]">
                  Cmd+Enter to send
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  loading={sending}
                  disabled={!reply.trim()}
                  onClick={sendReply}
                >
                  Send Reply
                </Button>
              </div>
            </div>
          )}

          {isClosed && (
            <div className="border-t border-[var(--kfx-border)] p-4">
              <p className="text-sm text-[var(--kfx-text-muted)] text-center">
                This ticket is {ticket.status}. Open a new ticket if you need further assistance.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function MessageBubble({
  content,
  role,
  isOwn,
  time,
}: {
  content: string
  role: 'client' | 'admin'
  isOwn: boolean
  time: string
}) {
  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[80%]', isOwn ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
        {!isOwn && (
          <span className="text-[10px] font-semibold text-[var(--kfx-gold)] uppercase tracking-wider px-1">
            Keystone FX Support
          </span>
        )}
        <div
          className={cn(
            'px-4 py-2.5 rounded-xl text-sm leading-relaxed',
            isOwn
              ? 'bg-[var(--kfx-accent)] text-white rounded-br-sm'
              : 'bg-[var(--kfx-surface-raised)] border border-[var(--kfx-border)] text-[var(--kfx-text)] rounded-bl-sm'
          )}
        >
          {content}
        </div>
        <span className="text-[10px] text-[var(--kfx-text-subtle)] px-1">
          {formatDateTime(time)}
        </span>
      </div>
    </div>
  )
}