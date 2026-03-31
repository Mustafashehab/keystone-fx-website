import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Document, DocumentStatus, ApiResponse } from '@/types'

const BUCKET = 'client-documents'

export async function getDocumentsByClientId(
  clientId: string
): Promise<ApiResponse<Document[]>> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('client_id', clientId)
    .order('uploaded_at', { ascending: false })
  if (error) return { data: null, error: error.message }
  return { data: data as Document[], error: null }
}

export async function getDocumentSignedUrl(
  filePath: string
): Promise<ApiResponse<string>> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filePath, 60 * 60)
  if (error) return { data: null, error: error.message }
  return { data: data.signedUrl, error: null }
}

export async function updateDocumentStatus(
  documentId: string,
  status: DocumentStatus,
  reviewerId: string,
  rejectionReason?: string
): Promise<ApiResponse<void>> {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('documents')
    .update({
      status,
      reviewed_at:      new Date().toISOString(),
      reviewed_by:      reviewerId,
      rejection_reason: rejectionReason ?? null,
    })
    .eq('id', documentId)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function deleteDocument(
  documentId: string,
  filePath: string
): Promise<ApiResponse<void>> {
  const supabase = await createServerSupabaseClient()
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([filePath])
  if (storageError) return { data: null, error: storageError.message }
  const { error } = await supabase.from('documents').delete().eq('id', documentId)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}