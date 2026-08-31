import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdminApi } from '@/lib/auth/guards'

export async function GET() {
  try {
    const auth = await requireAdminApi()
    if (auth.response) return auth.response

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
