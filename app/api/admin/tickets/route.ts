import { NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) return NextResponse.json([], { status: 401 })
    if (user.user_metadata?.role !== 'admin') return NextResponse.json([], { status: 403 })

    const supabase = await createServiceRoleClient()
    const { data } = await supabase
      .from('tickets')
      .select('id, subject, status, priority, category, created_at, client_profiles(first_name, last_name)')
      .order('created_at', { ascending: false })

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}