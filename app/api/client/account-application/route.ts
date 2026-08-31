import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAuthenticatedApi } from '@/lib/auth/guards'
import { parseJsonBody } from '@/lib/api/validation'
import { accountApplicationSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedApi()
    if (auth.response) return auth.response

    const parsed = await parseJsonBody(request, accountApplicationSchema)
    if (parsed.response) return parsed.response

    const supabase = await createServiceRoleClient()
    const { data: profile, error: profileError } = await supabase
      .from('client_profiles')
      .select('id')
      .eq('user_id', auth.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
    }

    const { data: existingApplication, error: existingError } = await supabase
      .from('account_applications')
      .select('status')
      .eq('client_id', profile.id)
      .maybeSingle()

    if (existingError) throw existingError
    if (
      existingApplication?.status === 'submitted' ||
      existingApplication?.status === 'under_review' ||
      existingApplication?.status === 'approved'
    ) {
      return NextResponse.json(
        { error: 'This account application is already submitted or under review' },
        { status: 409 }
      )
    }

    const data = parsed.data
    const now = new Date().toISOString()
    const applicationValues = {
      client_id: profile.id,
      account_type: data.accountType,
      leverage_preference: data.leveragePreference,
      base_currency: data.baseCurrency,
      platform_preference: data.platformPreference,
      initial_deposit_amount: data.initialDepositAmount,
      status: 'submitted',
      submitted_at: now,
      reviewed_at: null,
      reviewed_by: null,
      rejection_reason: null,
      updated_at: now,
    }

    let application
    if (existingApplication) {
      const { data: updatedApplication, error: applicationError } = await supabase
        .from('account_applications')
        .update(applicationValues)
        .eq('client_id', profile.id)
        .in('status', ['draft', 'rejected'])
        .select()
        .maybeSingle()

      if (applicationError) throw applicationError
      if (!updatedApplication) {
        return NextResponse.json(
          { error: 'This application was locked while the request was being processed' },
          { status: 409 }
        )
      }
      application = updatedApplication
    } else {
      const { data: insertedApplication, error: applicationError } = await supabase
        .from('account_applications')
        .insert(applicationValues)
        .select()
        .single()

      if (applicationError) throw applicationError
      application = insertedApplication
    }

    const { error: profileUpdateError } = await supabase
      .from('client_profiles')
      .update({ onboarding_step: 4, updated_at: now })
      .eq('id', profile.id)

    if (profileUpdateError) throw profileUpdateError
    return NextResponse.json({ application })
  } catch (error: unknown) {
    console.error('Account application submission failed', error)
    return NextResponse.json({ error: 'Unable to submit account application' }, { status: 500 })
  }
}
