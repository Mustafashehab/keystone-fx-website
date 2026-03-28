import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'

// POST /api/admin/tickets/reply
// Sends an admin reply to a ticket and optionally updates ticket status.
// Uses service role to bypass RLS on ticket_messages table.

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

    // Insert the message
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

    // Optionally update ticket status (e.g. open → in_progress on first reply)
    if (updateStatusTo) {
      const updates: Record<string, unknown> = {
        status:     updateStatusTo,
        updated_at: new Date().toISOString(),
      }
      if (updateStatusTo === 'resolved') {
        updates.resolved_at = new Date().toISOString()
      }
      await supabase
        .from('tickets')
        .update(updates)
        .eq('id', ticketId)
    }

    return NextResponse.json({ success: true, message })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH /api/admin/tickets/reply
// Updates ticket status only (no message).

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