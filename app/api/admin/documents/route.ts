import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) return NextResponse.json([], { status: 401 })
    if (user.user_metadata?.role !== 'admin') return NextResponse.json([], { status: 403 })

    const supabase = await createServiceRoleClient()
    const { data } = await supabase
      .from('documents')
      .select('id, client_id, type, file_name, file_path, file_size, status, uploaded_at, rejection_reason, client_profiles(first_name, last_name)')
      .order('uploaded_at', { ascending: true })

    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.user_metadata?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { id, status, rejection_reason } = await req.json()

    const supabase = await createServiceRoleClient()
    const { error } = await supabase
      .from('documents')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        rejection_reason: rejection_reason ?? null,
      })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}