import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdminApi } from '@/lib/auth/guards'
import { parseJsonBody } from '@/lib/api/validation'
import { createNotification } from '@/lib/notifications'

const ticketStatusSchema = z.enum(['open', 'in_progress', 'resolved', 'closed'])
const replySchema = z.object({
  ticketId: z.string().uuid(),
  content: z.string().trim().min(1).max(5000),
  updateStatusTo: ticketStatusSchema.optional(),
})
const updateTicketSchema = z.object({
  ticketId: z.string().uuid(),
  status: ticketStatusSchema,
})

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if (auth.response) return auth.response

    const parsed = await parseJsonBody(req, replySchema)
    if (parsed.response) return parsed.response
    const { ticketId, content, updateStatusTo } = parsed.data

    const supabase = await createServiceRoleClient()

    const { data: message, error: msgError } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id:   ticketId,
        sender_id:   auth.user.id,
        sender_role: 'admin',
        content:     content.trim(),
      })
      .select()
      .single()

    if (msgError) {
      return NextResponse.json({ error: msgError.message }, { status: 500 })
    }

    if (updateStatusTo) {
      const updates: Record<string, unknown> = {
        status:     updateStatusTo,
        updated_at: new Date().toISOString(),
      }
      if (updateStatusTo === 'resolved') {
        updates.resolved_at = new Date().toISOString()
      }
      await supabase.from('tickets').update(updates).eq('id', ticketId)
    }

    // Get ticket to find client_id for notification
    const { data: ticket } = await supabase
      .from('tickets')
      .select('client_id, subject')
      .eq('id', ticketId)
      .single()

    if (ticket) {
      // Notify client of admin reply
      await createNotification({
        recipient: 'client',
        clientId:  ticket.client_id,
        type:      'ticket_reply',
        title:     'New reply on your ticket',
        message:   `Support replied to: "${ticket.subject}"`,
        link:      `/portal/support/${ticketId}`,
      })
    }

    return NextResponse.json({ success: true, message })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if (auth.response) return auth.response

    const parsed = await parseJsonBody(req, updateTicketSchema)
    if (parsed.response) return parsed.response
    const { ticketId, status } = parsed.data

    const supabase = await createServiceRoleClient()

    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }
    if (status === 'resolved') {
      updates.resolved_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', ticketId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, newStatus: status })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
