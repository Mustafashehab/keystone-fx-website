import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  try {
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { ticketId, content, updateStatusTo } = await req.json()

    if (!ticketId || !content?.trim()) {
      return NextResponse.json({ error: 'ticketId and content are required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()

    const { data: message, error: msgError } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id:   ticketId,
        sender_id:   user.id,
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
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { ticketId, status } = await req.json()

    if (!ticketId || !status) {
      return NextResponse.json({ error: 'ticketId and status are required' }, { status: 400 })
    }

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