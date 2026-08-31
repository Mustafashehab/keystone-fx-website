import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAuthenticatedApi } from '@/lib/auth/guards'

const documentIdSchema = z.string().uuid()
const BUCKET = 'client-documents'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuthenticatedApi()
    if (auth.response) return auth.response

    const parsedId = documentIdSchema.safeParse((await params).id)
    if (!parsedId.success) {
      return NextResponse.json({ error: 'Invalid document identifier' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()
    const { data: profile, error: profileError } = await supabase
      .from('client_profiles')
      .select('id')
      .eq('user_id', auth.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
    }

    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('id, file_path, status')
      .eq('id', parsedId.data)
      .eq('client_id', profile.id)
      .single()

    if (documentError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }
    if (document.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending documents can be removed' },
        { status: 409 }
      )
    }

    const { data: deletedDocument, error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', document.id)
      .eq('client_id', profile.id)
      .eq('status', 'pending')
      .select('file_path')
      .maybeSingle()

    if (deleteError) throw deleteError
    if (!deletedDocument) {
      return NextResponse.json(
        { error: 'The document status changed before it could be removed' },
        { status: 409 }
      )
    }

    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([deletedDocument.file_path])

    if (storageError) throw storageError
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Document deletion failed', error)
    return NextResponse.json({ error: 'Unable to remove document' }, { status: 500 })
  }
}
