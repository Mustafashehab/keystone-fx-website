import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Ticket, TicketMessage, TicketStatus, TicketPriority, ApiResponse } from '@/types'

export async function createTicket(payload: {
  client_id: string
  subject: string
  description: string
  priority: TicketPriority
  category?: string
}): Promise<ApiResponse<Ticket>> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('tickets')
    .insert({ ...payload, status: 'open' as TicketStatus })
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: data as Ticket, error: null }
}

export async function getTicketsByClientId(
  clientId: string
): Promise<ApiResponse<Ticket[]>> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  if (error) return { data: null, error: error.message }
  return { data: data as Ticket[], error: null }
}

export async function getTicketWithMessages(
  ticketId: string
): Promise<ApiResponse<Ticket & { messages: TicketMessage[] }>> {
  const supabase = await createServerSupabaseClient()
  const [ticketResult, messagesResult] = await Promise.all([
    supabase.from('tickets').select('*').eq('id', ticketId).single(),
    supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true }),
  ])
  if (ticketResult.error) return { data: null, error: ticketResult.error.message }
  if (messagesResult.error) return { data: null, error: messagesResult.error.message }
  return {
    data: { ...(ticketResult.data as Ticket), messages: messagesResult.data as TicketMessage[] },
    error: null,
  }
}

export async function sendTicketMessage(payload: {
  ticket_id: string
  sender_id: string
  sender_role: 'client' | 'admin'
  content: string
}): Promise<ApiResponse<TicketMessage>> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('ticket_messages')
    .insert(payload)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: data as TicketMessage, error: null }
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
): Promise<ApiResponse<void>> {
  const supabase = await createServerSupabaseClient()
  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
  if (status === 'resolved') updates.resolved_at = new Date().toISOString()
  const { error } = await supabase.from('tickets').update(updates).eq('id', ticketId)
  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function getAllTickets(
  status?: TicketStatus
): Promise<ApiResponse<Ticket[]>> {
  const supabase = await createServerSupabaseClient()
  let query = supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) return { data: null, error: error.message }
  return { data: data as Ticket[], error: null }
}