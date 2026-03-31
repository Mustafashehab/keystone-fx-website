import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { checkWalletDeposits } from '@/lib/tron/monitor'
import { createNotification } from '@/lib/notifications'

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('client_profiles')
      .select('id, first_name, last_name')
      .eq('user_id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const { data: wallet } = await supabase
      .from('client_wallets')
      .select('tron_address')
      .eq('client_id', profile.id)
      .single()

    if (!wallet) return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })

    const { newDeposits, totalNewAmount, error } = await checkWalletDeposits(
      profile.id,
      wallet.tron_address
    )

    if (error) return NextResponse.json({ error }, { status: 500 })

    if (newDeposits > 0) {
      const clientName = `${profile.first_name} ${profile.last_name}`

      await createNotification({
        recipient: 'client',
        clientId:  profile.id,
        type:      'deposit_detected',
        title:     'Deposit Detected',
        message:   `$${totalNewAmount.toFixed(2)} USDT has been detected in your wallet and is being processed.`,
        link:      '/portal/deposit',
      })

      await createNotification({
        recipient: 'admin',
        clientId:  profile.id,
        type:      'deposit_detected',
        title:     'New Deposit Detected',
        message:   `${clientName} deposited $${totalNewAmount.toFixed(2)} USDT.`,
        link:      `/admin/clients/${profile.id}`,
      })
    }

    return NextResponse.json({ newDeposits })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}