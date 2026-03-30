import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'

const ATTESTATION_WINDOW_MS = 5 * 60 * 1000

export async function GET() {
  try {
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) return NextResponse.json([], { status: 401 })
    if (user.user_metadata?.role !== 'admin') return NextResponse.json([], { status: 403 })

    const supabase = await createServiceRoleClient()
    const { data } = await supabase
      .from('withdrawal_requests')
      .select(`
        id, client_id, amount, wallet_address, mt5_account,
        status, rejection_reason, reviewed_by, reviewed_at,
        created_at, updated_at,
        client_profiles(first_name, last_name)
      `)
      .order('created_at', { ascending: false })

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
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, status, rejectionReason } = await req.json()

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()

    const { data: request, error: fetchError } = await supabase
      .from('withdrawal_requests')
      .select('id, client_id, amount, wallet_address, status')
      .eq('id', id)
      .single()

    if (fetchError || !request) {
      return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 })
    }

    if (request.status !== 'pending') {
      return NextResponse.json(
        { error: `Cannot ${status} a request that is already ${request.status}.` },
        { status: 409 }
      )
    }

    const { data: clientWallet } = await supabase
      .from('client_wallets')
      .select('tron_address')
      .eq('client_id', request.client_id)
      .single()

    if (!clientWallet) {
      return NextResponse.json({ error: 'Client has no registered deposit wallet.' }, { status: 400 })
    }

    if (clientWallet.tron_address !== request.wallet_address) {
      return NextResponse.json(
        { error: 'Withdrawal destination does not match registered wallet.', },
        { status: 400 }
      )
    }

    if (status === 'approved') {
      const { data: attestation, error: attestFetchError } = await supabase
        .from('withdrawal_attestations')
        .select('id, attested_balance, attested_at, used')
        .eq('withdrawal_id', id)
        .eq('admin_id', user.id)
        .single()

      if (attestFetchError || !attestation) {
        return NextResponse.json(
          { error: 'MT5 free margin attestation required.', code: 'attestation_missing' },
          { status: 400 }
        )
      }

      if (attestation.used) {
        return NextResponse.json(
          { error: 'This attestation has already been used.', code: 'attestation_used' },
          { status: 400 }
        )
      }

      const ageMs = Date.now() - new Date(attestation.attested_at).getTime()
      if (ageMs > ATTESTATION_WINDOW_MS) {
        const minutesAgo = Math.floor(ageMs / 60000)
        return NextResponse.json(
          { error: `Attestation expired ${minutesAgo} minute(s) ago.`, code: 'attestation_expired' },
          { status: 400 }
        )
      }

      const { error: rpcError } = await supabase.rpc('approve_withdrawal', {
        p_withdrawal_id:    id,
        p_reviewer_id:      user.id,
        p_attested_balance: attestation.attested_balance,
        p_attested_at:      attestation.attested_at,
      })

      if (rpcError) {
        if (rpcError.message?.includes('withdrawal_not_pending')) {
          return NextResponse.json({ error: 'Already processed.' }, { status: 409 })
        }
        if (rpcError.message?.includes('attestation_expired')) {
          return NextResponse.json({ error: 'Attestation expired during approval.' }, { status: 400 })
        }
        return NextResponse.json({ error: rpcError.message }, { status: 500 })
      }

      // Notify client
      await createNotification({
        recipient: 'client',
        clientId:  request.client_id,
        type:      'withdrawal_approved',
        title:     'Withdrawal Approved',
        message:   `Your withdrawal of $${Number(request.amount).toFixed(2)} USDT has been approved and is being processed.`,
        link:      '/portal/withdrawal',
      })

      return NextResponse.json({ success: true, newStatus: 'approved' })
    }

    if (status === 'rejected') {
      if (!rejectionReason?.trim()) {
        return NextResponse.json({ error: 'A rejection reason is required.' }, { status: 400 })
      }

      const { error: rpcError } = await supabase.rpc('reject_withdrawal', {
        p_withdrawal_id:    id,
        p_reviewer_id:      user.id,
        p_rejection_reason: rejectionReason.trim(),
      })

      if (rpcError) {
        if (rpcError.message?.includes('withdrawal_not_pending')) {
          return NextResponse.json({ error: 'Already processed.' }, { status: 409 })
        }
        return NextResponse.json({ error: rpcError.message }, { status: 500 })
      }

      // Notify client
      await createNotification({
        recipient: 'client',
        clientId:  request.client_id,
        type:      'withdrawal_rejected',
        title:     'Withdrawal Rejected',
        message:   `Your withdrawal of $${Number(request.amount).toFixed(2)} USDT was rejected. Reason: ${rejectionReason.trim()}`,
        link:      '/portal/withdrawal',
      })

      return NextResponse.json({ success: true, newStatus: 'rejected' })
    }
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}