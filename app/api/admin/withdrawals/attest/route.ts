import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'

// POST /api/admin/withdrawals/attest
// Admin submits the MT5 free margin they visually confirmed in the terminal.
// Free margin = funds available after open positions and margin requirements.
// Returns an attestation record valid for 5 minutes.
// The approve endpoint will reject if no valid attestation exists.

export async function POST(req: NextRequest) {
  try {
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { withdrawalId, attestedBalance } = await req.json()

    if (!withdrawalId) {
      return NextResponse.json({ error: 'withdrawalId is required' }, { status: 400 })
    }

    const freeMargin = Number(attestedBalance)
    if (isNaN(freeMargin) || freeMargin < 0) {
      return NextResponse.json(
        { error: 'Free margin must be a non-negative number' },
        { status: 400 }
      )
    }

    const supabase = await createServiceRoleClient()

    // Verify the withdrawal exists and is still pending
    const { data: withdrawal, error: fetchError } = await supabase
      .from('withdrawal_requests')
      .select('id, status, amount, client_id')
      .eq('id', withdrawalId)
      .single()

    if (fetchError || !withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 })
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json(
        { error: `Cannot attest a ${withdrawal.status} withdrawal. Only pending requests can be attested.` },
        { status: 409 }
      )
    }

    // Upsert the attestation — if admin re-attests (e.g. entered wrong value),
    // the previous attestation is replaced with the fresh one.
    // DB column is attested_balance — stores the free margin value.
    const now = new Date().toISOString()
    const { error: attestError } = await supabase
      .from('withdrawal_attestations')
      .upsert(
        {
          withdrawal_id:    withdrawalId,
          admin_id:         user.id,
          attested_balance: freeMargin,
          attested_at:      now,
          used:             false,
        },
        { onConflict: 'withdrawal_id,admin_id' }
      )

    if (attestError) {
      return NextResponse.json({ error: attestError.message }, { status: 500 })
    }

    return NextResponse.json({
      success:          true,
      attestedAt:       now,
      expiresAt:        new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      withdrawalId,
      attestedFreeMargin: freeMargin,
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}