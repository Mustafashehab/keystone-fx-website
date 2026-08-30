import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdminApi } from '@/lib/auth/guards'
import { parseJsonBody } from '@/lib/api/validation'
import { areFinancialOperationsEnabled } from '@/lib/financial/operations'

const attestationSchema = z.object({
  withdrawalId: z.string().uuid(),
  attestedBalance: z.coerce.number().finite().nonnegative(),
})

// POST /api/admin/withdrawals/attest
// Admin submits the MT5 free margin they visually confirmed in the terminal.
// Free margin = funds available after open positions and margin requirements.
// Returns an attestation record valid for 5 minutes.
// The approve endpoint will reject if no valid attestation exists.

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if (auth.response) return auth.response

    if (!(await areFinancialOperationsEnabled())) {
      return NextResponse.json({ error: 'Financial operations are disabled' }, { status: 503 })
    }

    const parsed = await parseJsonBody(req, attestationSchema)
    if (parsed.response) return parsed.response
    const { withdrawalId, attestedBalance: freeMargin } = parsed.data

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
          admin_id:         auth.user.id,
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
