import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Lead, LeadStatus, ApiResponse } from '@/types'

export async function getAllLeads(
  status?: LeadStatus
): Promise<ApiResponse<Lead[]>> {
  const supabase = await createServerSupabaseClient()
  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) return { data: null, error: error.message }
  return { data: data as Lead[], error: null }
}

export async function getLeadById(id: string): Promise<ApiResponse<Lead>> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('leads').select('*').eq('id', id).single()
  if (error) return { data: null, error: error.message }
  return { data: data as Lead, error: null }
}

export async function createLead(
  payload: Omit<Lead, 'id' | 'created_at' | 'updated_at'>
): Promise<ApiResponse<Lead>> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('leads').insert({ ...payload, status: 'new' }).select().single()
  if (error) return { data: null, error: error.message }
  return { data: data as Lead, error: null }
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<ApiResponse<void>> {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function updateLead(
  id: string,
  payload: Partial<Lead>
): Promise<ApiResponse<Lead>> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('leads')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  if (error) return { data: null, error: error.message }
  return { data: data as Lead, error: null }
}

export async function convertLeadToClient(
  leadId: string,
  clientId: string
): Promise<ApiResponse<void>> {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('leads')
    .update({ status: 'converted', converted_client_id: clientId, updated_at: new Date().toISOString() })
    .eq('id', leadId)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}