import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { checkWalletDeposits } from '@/lib/tron/monitor'

export const maxDuration = 60 // seconds — Vercel max for hobby plan

export async function GET(request: Request) {
  // Security — Vercel signs cron requests with this header
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createServiceRoleClient()

    // Fetch all active client wallets
    const { data: wallets, error } = await supabase
      .from('client_wallets')
      .select('client_id, tron_address')
      .eq('sweep_locked', false)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!wallets || wallets.length === 0) {
      return NextResponse.json({ message: 'No wallets to check', checked: 0 })
    }

    const results = []

    for (const wallet of wallets) {
      const result = await checkWalletDeposits(
        wallet.client_id,
        wallet.tron_address
      )
      results.push({
        address:      wallet.tron_address,
        newDeposits:  result.newDeposits,
        totalAmount:  result.totalNewAmount,
        error:        result.error,
      })
    }

    const totalNewDeposits = results.reduce((sum, r) => sum + r.newDeposits, 0)
    const errors = results.filter(r => r.error)

    return NextResponse.json({
      message:          'Deposit monitor complete',
      walletsChecked:   wallets.length,
      totalNewDeposits,
      errors:           errors.length,
      results,
    })

  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Cron failed' },
      { status: 500 }
    )
  }
}