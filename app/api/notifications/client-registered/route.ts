import { NextResponse } from 'next/server'
import { requireAuthenticatedApi } from '@/lib/auth/guards'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'

export async function POST() {
  try {
    const auth = await requireAuthenticatedApi()
    if (auth.response) return auth.response

    const supabase = await createServerSupabaseClient()
    const { data: profile } = await supabase
      .from('client_profiles')
      .select('id, first_name, last_name, account_type')
      .eq('user_id', auth.user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const clientName = `${profile.first_name} ${profile.last_name}`.trim()
    const email = auth.user.email ?? 'email unavailable'

    await createNotification({
      recipient: 'admin',
      clientId:  profile.id,
      type:      'new_client',
      title:     'New Client Registration',
      message:   `${clientName} (${email}) registered as a ${profile.account_type} client.`,
      link:      '/admin/clients',
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
