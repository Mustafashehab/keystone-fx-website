import { NextResponse } from 'next/server'
import { createNotification } from '@/lib/notifications'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const clientName = `${user.user_metadata?.first_name ?? ''} ${user.user_metadata?.last_name ?? ''}`.trim() || 'Client'
    const email = user.email
    const accountType = user.user_metadata?.account_type ?? 'individual'

    await createNotification({
      recipient: 'admin',
      type:      'new_client',
      title:     'New Client Registration',
      message:   `${clientName} (${email}) registered as a ${accountType} client.`,
      link:      '/admin/clients',
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}