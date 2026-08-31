import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuthenticatedApi } from '@/lib/auth/guards'
import { parseJsonBody } from '@/lib/api/validation'
import { createNotification } from '@/lib/notifications'

const ticketNotificationSchema = z.object({ ticketId: z.string().uuid() })

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuthenticatedApi()
    if (auth.response) return auth.response

    const parsed = await parseJsonBody(req, ticketNotificationSchema)
    if (parsed.response) return parsed.response

    const supabase = await createServerSupabaseClient()
    const { data: profile } = await supabase
      .from('client_profiles')
      .select('id, first_name, last_name')
      .eq('user_id', auth.user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const { data: ticket } = await supabase
      .from('tickets')
      .select('id, client_id, subject, priority')
      .eq('id', parsed.data.ticketId)
      .eq('client_id', profile.id)
      .single()

    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })

    const clientName = `${profile.first_name} ${profile.last_name}`.trim()

    await createNotification({
      recipient: 'admin',
      clientId:  profile.id,
      type:      'new_ticket',
      title:     'New Support Ticket',
      message:   `${clientName} opened a ${ticket.priority} priority ticket: "${ticket.subject}"`,
      link:      `/admin/tickets/${ticket.id}`,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
