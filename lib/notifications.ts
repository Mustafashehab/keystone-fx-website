import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

interface CreateNotificationParams {
  recipient:  'client' | 'admin'
  clientId?:  string
  type:       string
  title:      string
  message:    string
  link?:      string
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const supabase = getServiceClient()
    await supabase.from('notifications').insert({
      recipient:  params.recipient,
      client_id:  params.clientId ?? null,
      type:       params.type,
      title:      params.title,
      message:    params.message,
      link:       params.link ?? null,
    })
  } catch (err) {
    // Non-critical — log but don't throw
    console.error('[notifications] Failed to create notification:', err)
  }
}