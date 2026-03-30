import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { checkWalletDeposits } from '@/lib/tron/monitor'
import { createNotification } from '@/lib/notifications'

export const maxDuration = 60 // seconds — Vercel max for hobby plan

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createServiceRoleClient()

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

      // Send notifications if new deposits detected
      if (result.newDeposits > 0) {

        // Get client name for admin notification
        const { data: profile } = await supabase
          .from('client_profiles')
          .select('first_name, last_name')
          .eq('id', wallet.client_id)
          .single()

        const clientName = profile
          ? `${profile.first_name} ${profile.last_name}`
          : 'A client'

        // Notify client
        await createNotification({
          recipient: 'client',
          clientId:  wallet.client_id,
          type:      'deposit_detected',
          title:     'Deposit Detected',
          message:   `$${result.totalNewAmount.toFixed(2)} USDT has been detected in your wallet and is being processed.`,
          link:      '/portal/deposit',
        })

        // Notify admin
        await createNotification({
          recipient: 'admin',
          clientId:  wallet.client_id,
          type:      'deposit_detected',
          title:     'New Deposit Detected',
          message:   `${clientName} deposited $${result.totalNewAmount.toFixed(2)} USDT.`,
          link:      `/admin/clients/${wallet.client_id}`,
        })
      }

      results.push({
        address:     wallet.tron_address,
        newDeposits: result.newDeposits,
        totalAmount: result.totalNewAmount,
        error:       result.error,
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