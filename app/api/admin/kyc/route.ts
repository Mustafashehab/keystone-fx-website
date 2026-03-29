import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'

export async function GET() {
  try {
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) return NextResponse.json([], { status: 401 })
    if (user.user_metadata?.role !== 'admin') return NextResponse.json([], { status: 403 })

    const supabase = await createServiceRoleClient()
    const { data } = await supabase
      .from('kyc_submissions')
      .select('id, client_id, status, submitted_at, politically_exposed, us_person, client_profiles(first_name, last_name, account_type, nationality)')
      .order('submitted_at', { ascending: true })

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.user_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { kycId, clientId, status, reviewerId, rejectionReason } = await req.json()
    const now = new Date().toISOString()

    const supabase = await createServiceRoleClient()

    const { error: kycErr } = await supabase
      .from('kyc_submissions')
      .update({
        status,
        reviewed_at:      now,
        reviewed_by:      reviewerId,
        rejection_reason: rejectionReason ?? null,
        updated_at:       now,
      })
      .eq('id', kycId)

    if (kycErr) return NextResponse.json({ error: kycErr.message }, { status: 500 })

    const { error: profileErr } = await supabase
      .from('client_profiles')
      .update({ kyc_status: status, updated_at: now })
      .eq('id', clientId)

    if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 500 })

    // Notify client of KYC decision
    if (status === 'approved') {
      await createNotification({
        recipient: 'client',
        clientId,
        type:      'kyc_approved',
        title:     'KYC Approved',
        message:   'Your identity verification has been approved. You can now access all platform features.',
        link:      '/portal/dashboard',
      })
    } else if (status === 'rejected') {
      await createNotification({
        recipient: 'client',
        clientId,
        type:      'kyc_rejected',
        title:     'KYC Rejected',
        message:   rejectionReason
          ? `Your KYC was rejected: ${rejectionReason}. Please resubmit with the correct information.`
          : 'Your KYC was rejected. Please resubmit with the correct information.',
        link:      '/portal/kyc',
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}