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

    // The RPC locks the withdrawal and records the attestation atomically, so
    // an approval cannot race with a stale re-attestation.
    const { data: attestedAt, error: attestError } = await supabase.rpc(
      'record_withdrawal_attestation',
      {
        p_withdrawal_id: withdrawalId,
        p_admin_id: auth.user.id,
        p_attested_balance: freeMargin,
      }
    )

    if (attestError) {
      if (attestError.message?.includes('withdrawal_not_found')) {
        return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 })
      }
      if (attestError.message?.includes('withdrawal_not_pending')) {
        return NextResponse.json(
          { error: 'Only pending withdrawals can be attested.' },
          { status: 409 }
        )
      }
      if (attestError.message?.includes('insufficient_attested_balance')) {
        return NextResponse.json(
          {
            error: 'Attested MT5 free margin is below the requested withdrawal amount.',
            code: 'insufficient_attested_balance',
          },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: attestError.message }, { status: 500 })
    }

    if (typeof attestedAt !== 'string') {
      return NextResponse.json({ error: 'Invalid attestation response' }, { status: 500 })
    }

    return NextResponse.json({
      success:          true,
      attestedAt,
      expiresAt:        new Date(new Date(attestedAt).getTime() + 5 * 60 * 1000).toISOString(),
      withdrawalId,
      attestedFreeMargin: freeMargin,
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
