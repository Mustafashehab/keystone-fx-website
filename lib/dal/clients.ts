import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { ClientProfile, ApiResponse, ClientSummary } from '@/types'

export async function getClientProfile(
  userId: string
): Promise<ApiResponse<ClientProfile>> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) return { data: null, error: error.message }
  return { data: data as ClientProfile, error: null }
}

export async function upsertClientProfile(
  userId: string,
  profile: Partial<ClientProfile>
): Promise<ApiResponse<ClientProfile>> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('client_profiles')
    .upsert({ ...profile, user_id: userId, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: data as ClientProfile, error: null }
}

export async function updateOnboardingStep(
  userId: string,
  step: number
): Promise<ApiResponse<void>> {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('client_profiles')
    .update({ onboarding_step: step, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function getAllClients(
  page = 1,
  pageSize = 20
): Promise<ApiResponse<ClientSummary[]>> {
  const supabase = await createServerSupabaseClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const { data, error } = await supabase
    .from('client_profiles')
    .select('id, user_id, first_name, last_name, account_type, kyc_status, onboarding_step, created_at')
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error) return { data: null, error: error.message }
  const summaries: ClientSummary[] = (data ?? []).map((row) => ({
    id:               row.id,
    user_id:          row.user_id,
    email:            '',
    full_name:        `${row.first_name} ${row.last_name}`,
    account_type:     row.account_type as ClientProfile['account_type'],
    kyc_status:       row.kyc_status as ClientProfile['kyc_status'],
    onboarding_step:  row.onboarding_step,
    created_at:       row.created_at,
  }))
  return { data: summaries, error: null }
}

export async function getClientById(
  clientId: string
): Promise<ApiResponse<ClientProfile>> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('id', clientId)
    .single()
  if (error) return { data: null, error: error.message }
  return { data: data as ClientProfile, error: null }
}