import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdminApi } from '@/lib/auth/guards'

export async function GET() {
  try {
    const auth = await requireAdminApi()
    if (auth.response) return auth.response

    const supabase = await createServiceRoleClient()
    const { data } = await supabase
      .from('client_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
