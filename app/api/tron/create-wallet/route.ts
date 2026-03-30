import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createClientWallet, getClientWallet } from '@/lib/tron/wallet'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('client_profiles')
      .select('id, kyc_status')
      .eq('user_id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    if (profile.kyc_status !== 'approved') {
      return NextResponse.json({ error: 'KYC must be approved first' }, { status: 403 })
    }

    const existing = await getClientWallet(profile.id)
    if (existing) {
      return NextResponse.json({ address: existing.tron_address })
    }

    const { address, error } = await createClientWallet(profile.id)
    if (error) return NextResponse.json({ error }, { status: 500 })

    return NextResponse.json({ address })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}