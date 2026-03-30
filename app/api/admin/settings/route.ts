import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServiceRoleClient()
    const { data, error } = await supabase
      .from('platform_settings')
      .select('financial_services_enabled')
      .eq('id', 'global')
      .single()

    if (error) throw error
    return NextResponse.json({ financial_services_enabled: data.financial_services_enabled })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.user_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { financial_services_enabled } = await req.json()

    const supabase = await createServiceRoleClient()
    const { error } = await supabase
      .from('platform_settings')
      .update({
        financial_services_enabled,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq('id', 'global')

    if (error) throw error
    return NextResponse.json({ success: true, financial_services_enabled })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}