import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuthenticatedApi } from '@/lib/auth/guards'
import { parseJsonBody } from '@/lib/api/validation'
import { areFinancialOperationsEnabled } from '@/lib/financial/operations'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'

const createWithdrawalSchema = z.object({
  amount: z.coerce.number().finite().min(10).max(10_000_000),
  walletAddress: z.string().trim().regex(/^T[A-Za-z0-9]{33}$/, 'Invalid TRC-20 address'),
  mt5Account: z.string().trim().min(1).max(64).regex(/^[A-Za-z0-9_-]+$/),
})

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedApi()
    if (auth.response) return auth.response

    if (!(await areFinancialOperationsEnabled())) {
      return NextResponse.json({ error: 'Financial operations are disabled' }, { status: 503 })
    }

    const parsed = await parseJsonBody(request, createWithdrawalSchema)
    if (parsed.response) return parsed.response

    const supabase = await createServiceRoleClient()
    const { data: profile, error: profileError } = await supabase
      .from('client_profiles')
      .select('id, first_name, last_name, kyc_status')
      .eq('user_id', auth.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (profile.kyc_status !== 'approved') {
      return NextResponse.json({ error: 'KYC must be approved first' }, { status: 403 })
    }

    const { data: wallet, error: walletError } = await supabase
      .from('client_wallets')
      .select('tron_address')
      .eq('client_id', profile.id)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Registered wallet not found' }, { status: 400 })
    }

    if (wallet.tron_address !== parsed.data.walletAddress) {
      return NextResponse.json(
        { error: 'Withdrawal destination does not match the registered wallet' },
        { status: 400 }
      )
    }

    const { data: pendingRequest } = await supabase
      .from('withdrawal_requests')
      .select('id')
      .eq('client_id', profile.id)
      .eq('status', 'pending')
      .maybeSingle()

    if (pendingRequest) {
      return NextResponse.json({ error: 'A withdrawal request is already pending' }, { status: 409 })
    }

    const { data: created, error: createError } = await supabase
      .from('withdrawal_requests')
      .insert({
        client_id: profile.id,
        amount: parsed.data.amount,
        wallet_address: parsed.data.walletAddress,
        mt5_account: parsed.data.mt5Account,
        status: 'pending',
      })
      .select('id, amount, wallet_address, mt5_account, status, rejection_reason, created_at')
      .single()

    if (createError || !created) {
      return NextResponse.json({ error: 'Could not create withdrawal request' }, { status: 500 })
    }

    await createNotification({
      recipient: 'admin',
      clientId: profile.id,
      type: 'new_withdrawal',
      title: 'New Withdrawal Request',
      message: `${profile.first_name} ${profile.last_name} submitted a withdrawal request for $${Number(created.amount).toFixed(2)} USDT.`,
      link: '/admin/withdrawals',
    })

    return NextResponse.json({ request: created }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
