import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdminApi } from '@/lib/auth/guards'
import { parseJsonBody } from '@/lib/api/validation'
import { areFinancialOperationsEnabled } from '@/lib/financial/operations'

const updateFinancialSettingsSchema = z.object({
  financial_services_enabled: z.boolean(),
})

export async function GET() {
  const enabled = await areFinancialOperationsEnabled()
  return NextResponse.json({
    financial_services_enabled: enabled,
    deployment_gate_enabled: process.env.FINANCIAL_OPERATIONS_ENABLED === 'true',
  })
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if (auth.response) return auth.response

    const parsed = await parseJsonBody(req, updateFinancialSettingsSchema)
    if (parsed.response) return parsed.response
    const { financial_services_enabled } = parsed.data

    const supabase = await createServiceRoleClient()
    const { error } = await supabase
      .from('platform_settings')
      .update({
        financial_services_enabled,
        updated_at: new Date().toISOString(),
        updated_by: auth.user.id,
      })
      .eq('id', 'global')

    if (error) throw error
    return NextResponse.json({
      success: true,
      financial_services_enabled: await areFinancialOperationsEnabled(),
      deployment_gate_enabled: process.env.FINANCIAL_OPERATIONS_ENABLED === 'true',
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
