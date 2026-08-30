import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdminApi } from '@/lib/auth/guards'
import { parseJsonBody } from '@/lib/api/validation'

const reviewDocumentSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['verified', 'rejected']),
  rejection_reason: z.string().trim().max(1000).optional().nullable(),
})

export async function GET() {
  try {
    const auth = await requireAdminApi()
    if (auth.response) return auth.response

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
    const auth = await requireAdminApi()
    if (auth.response) return auth.response

    const parsed = await parseJsonBody(req, reviewDocumentSchema)
    if (parsed.response) return parsed.response
    const { id, status, rejection_reason } = parsed.data

    if (status === 'rejected' && !rejection_reason) {
      return NextResponse.json({ error: 'A rejection reason is required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()
    const { error } = await supabase
      .from('documents')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: auth.user.id,
        rejection_reason: status === 'rejected' ? rejection_reason : null,
      })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
