import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuthenticatedApi } from '@/lib/auth/guards'
import { createNotification } from '@/lib/notifications'

export async function POST() {
  try {
    const auth = await requireAuthenticatedApi()
    if (auth.response) return auth.response

    const supabase = await createServerSupabaseClient()
    const { data: profile } = await supabase
      .from('client_profiles')
      .select('id, first_name, last_name')
      .eq('user_id', auth.user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const { data: submission } = await supabase
      .from('kyc_submissions')
      .select('id, status')
      .eq('client_id', profile.id)
      .in('status', ['pending', 'under_review'])
      .maybeSingle()

    if (!submission) {
      return NextResponse.json({ error: 'No submitted KYC record found' }, { status: 409 })
    }

    const clientName = `${profile.first_name} ${profile.last_name}`.trim()

    await createNotification({
      recipient: 'admin',
      clientId:  profile.id,
      type:      'kyc_submitted',
      title:     'New KYC Submission',
      message:   `${clientName} submitted their KYC for review.`,
      link:      `/admin/kyc`,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
