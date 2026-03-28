import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { sweepToMaster } from '@/lib/tron/sweep'

// Admin only endpoint
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

    const { txHash, amount, error } = await sweepToMaster(clientId)
    if (error) return NextResponse.json({ error }, { status: 500 })

    return NextResponse.json({ txHash, amount })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}