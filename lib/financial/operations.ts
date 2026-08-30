import { createServiceRoleClient } from '@/lib/supabase/server'

/**
 * Financial operations require two independent switches:
 * 1. A server-only deployment flag.
 * 2. The database platform setting controlled by an administrator.
 *
 * Any missing configuration or database error fails closed.
 */
export async function areFinancialOperationsEnabled(): Promise<boolean> {
  if (process.env.FINANCIAL_OPERATIONS_ENABLED !== 'true') return false

  try {
    const supabase = await createServiceRoleClient()
    const { data, error } = await supabase
      .from('platform_settings')
      .select('financial_services_enabled')
      .eq('id', 'global')
      .single()

    if (error) return false
    return data?.financial_services_enabled === true
  } catch {
    return false
  }
}
