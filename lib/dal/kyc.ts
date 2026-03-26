import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { KYCSubmission, ApiResponse, KYCStatus } from '@/types'

export async function getKYCByClientId(
  clientId: string
): Promise<ApiResponse<KYCSubmission>> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('kyc_submissions')
    .select('*')
    .eq('client_id', clientId)
    .maybeSingle()
  if (error) return { data: null, error: error.message }
  return { data: data as KYCSubmission | null, error: null }
}

export async function upsertKYCSubmission(
  clientId: string,
  payload: Partial<KYCSubmission>
): Promise<ApiResponse<KYCSubmission>> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('kyc_submissions')
    .upsert({ ...payload, client_id: clientId, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: data as KYCSubmission, error: null }
}

export async function submitKYC(clientId: string): Promise<ApiResponse<void>> {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('kyc_submissions')
    .update({ status: 'pending' as KYCStatus, submitted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('client_id', clientId)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function updateKYCStatus(
  submissionId: string,
  status: KYCStatus,
  reviewerId: string,
  rejectionReason?: string
): Promise<ApiResponse<void>> {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('kyc_submissions')
    .update({
      status,
      reviewed_at:      new Date().toISOString(),
      reviewed_by:      reviewerId,
      rejection_reason: rejectionReason ?? null,
      updated_at:       new Date().toISOString(),
    })
    .eq('id', submissionId)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function getAllKYCSubmissions(
  status?: KYCStatus
): Promise<ApiResponse<KYCSubmission[]>> {
  const supabase = await createServerSupabaseClient()
  let query = supabase
    .from('kyc_submissions')
    .select('*')
    .order('submitted_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) return { data: null, error: error.message }
  return { data: data as KYCSubmission[], error: null }
}