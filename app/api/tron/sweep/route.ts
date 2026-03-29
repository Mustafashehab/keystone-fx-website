import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { sweepToMaster } from '@/lib/tron/sweep'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    const { clientId } = await req.json()
    if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

    const result = await sweepToMaster(clientId)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success:    true,
      usdtTxHash: result.usdtTxHash,
      trxTxHash:  result.trxTxHash,
      usdtAmount: result.usdtAmount,
      trxAmount:  result.trxAmount,
      confirmed:  result.confirmed,
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}