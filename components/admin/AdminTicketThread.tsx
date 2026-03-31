'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { formatDateTime, cn } from '@/lib/utils'
import type { Ticket, TicketMessage, TicketStatus } from '@/types'

const STATUS_ACTIONS: { label: string; status: TicketStatus; className: string }[] = [
  { label: 'Mark In Progress', status: 'in_progress', className: 'bg-blue-50 text-blue-600 border-blue-200' },
  { label: 'Mark Resolved',    status: 'resolved',    className: 'bg-green-50 text-green-600 border-green-200' },
  { label: 'Close Ticket',     status: 'closed',      className: 'bg-gray-50 text-gray-500 border-gray-200' },
]

const TICKET_STYLES: Record<string, string> = {
  open:        'bg-amber-100 text-amber-600',
  in_progress: 'bg-blue-100 text-blue-600',
  resolved:    'bg-green-100 text-green-600',
  closed:      'bg-gray-100 text-gray-500',
}

export function AdminTicketThread({ ticket, initialMessages, adminId: _adminId }: {
  ticket: Ticket
  initialMessages: TicketMessage[]
  adminId: string
}) {
  const router  = useRouter()
  const { success, error: toastError } = useToast()

  const [messages,       setMessages]       = useState<TicketMessage[]>(initialMessages)
  const [currentStatus,  setCurrentStatus]  = useState<TicketStatus>(ticket.status)
  const [reply,          setReply]          = useState('')
  const [sending,        setSending]        = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendReply() {
    if (!reply.trim()) return
    setSending(true)
    try {
      const res = await fetch('/api/admin/tickets/reply', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ticketId:       ticket.id,
          content:        reply.trim(),
          updateStatusTo: currentStatus === 'open' ? 'in_progress' : undefined,
        }),
      })

      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? 'Send failed')

      if (currentStatus === 'open') {
        setCurrentStatus('in_progress')
      }

      setMessages((prev) => [...prev, body.message as TicketMessage])
      setReply('')
      success('Reply sent')
    } catch (err: unknown) {
      toastError('Send failed', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSending(false)
    }
  }

  async function updateStatus(status: TicketStatus, notify = true) {
    setUpdatingStatus(true)
    try {
      const res = await fetch('/api/admin/tickets/reply', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ticketId: ticket.id, status }),
      })

      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? 'Update failed')

      setCurrentStatus(status)
      if (notify) {
        success('Status updated')
        router.refresh()
      }
    } catch (err: unknown) {
      toastError('Update failed', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const isClosed = currentStatus === 'closed' || currentStatus === 'resolved'

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
        <h2 className="text-sm font-semibold text-[#0f172a]">Thread</h2>
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${TICKET_STYLES[currentStatus]}`}>
          {currentStatus.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="p-5 space-y-4 max-h-[520px] overflow-y-auto min-h-[200px]">
        <MessageBubble content={ticket.description} isAdmin={false} time={ticket.created_at} label="Client" />
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            content={msg.content}
            isAdmin={msg.sender_role === 'admin'}
            time={msg.created_at}
            label={msg.sender_role === 'admin' ? 'You (Admin)' : 'Client'}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {!isClosed && (
        <div className="px-5 py-3 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center gap-2 flex-wrap">
          <p className="text-xs text-[#94a3b8] mr-1">Set status:</p>
          {STATUS_ACTIONS
            .filter((a) => !(a.status === 'in_progress' && currentStatus === 'in_progress'))
            .map((action) => (
              <button
                key={action.status}
                onClick={() => updateStatus(action.status)}
                disabled={updatingStatus}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${action.className}`}
              >
                {action.label}
              </button>
            ))}
        </div>
      )}

      {!isClosed ? (
        <div className="border-t border-[#f1f5f9] p-4 bg-[#f8fafc]">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendReply() }}
            placeholder="Write a reply to the client… (Cmd+Enter to send)"
            rows={3}
            className="w-full rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#94a3b8] focus:ring-2 focus:ring-[#eef2f6] resize-none transition-all"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-[#94a3b8]">Reply will be visible to the client</p>
            <button
              onClick={sendReply}
              disabled={!reply.trim() || sending}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#0f172a] text-white hover:bg-[#1e293b] transition-all disabled:opacity-40"
            >
              {sending ? 'Sending…' : 'Send Reply'}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-[#f1f5f9] p-4 text-center bg-[#f8fafc]">
          <p className="text-sm text-[#64748b]">This ticket is {currentStatus}.</p>
          <button
            onClick={() => updateStatus('open')}
            className="mt-2 text-xs text-blue-500 hover:underline"
          >
            Reopen ticket
          </button>
        </div>
      )}
    </div>
  )
}

function MessageBubble({ content, isAdmin, time, label }: {
  content: string
  isAdmin: boolean
  time: string
  label: string
}) {
  return (
    <div className={cn('flex', isAdmin ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[80%] flex flex-col gap-1', isAdmin ? 'items-end' : 'items-start')}>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-1 text-[#94a3b8]">
          {label}
        </span>
        <div className={cn(
          'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
          isAdmin
            ? 'bg-[#0f172a] text-white rounded-br-sm'
            : 'bg-[#f1f5f9] text-[#0f172a] rounded-bl-sm border border-[#e5e7eb]'
        )}>
          {content}
        </div>
        <span className="text-[10px] text-[#94a3b8] px-1">{formatDateTime(time)}</span>
      </div>
    </div>
  )
}