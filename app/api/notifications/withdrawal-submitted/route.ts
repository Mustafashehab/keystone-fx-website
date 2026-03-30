import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { clientId, clientName, amount } = await req.json()

    await createNotification({
      recipient: 'admin',
      clientId,
      type:      'new_withdrawal',
      title:     'New Withdrawal Request',
      message:   `${clientName} submitted a withdrawal request for $${Number(amount).toFixed(2)} USDT.`,
      link:      '/admin/withdrawals',
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}