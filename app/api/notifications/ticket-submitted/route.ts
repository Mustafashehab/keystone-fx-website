import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { clientId, clientName, subject, priority, ticketId } = await req.json()

    await createNotification({
      recipient: 'admin',
      clientId,
      type:      'new_ticket',
      title:     'New Support Ticket',
      message:   `${clientName} opened a ${priority} priority ticket: "${subject}"`,
      link:      `/admin/tickets/${ticketId}`,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}