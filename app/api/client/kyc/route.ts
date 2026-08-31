import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAuthenticatedApi } from '@/lib/auth/guards'
import { parseJsonBody } from '@/lib/api/validation'
import { kycSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedApi()
    if (auth.response) return auth.response

    const parsed = await parseJsonBody(request, kycSchema)
    if (parsed.response) return parsed.response

    const supabase = await createServiceRoleClient()
    const { data: profile, error: profileError } = await supabase
      .from('client_profiles')
      .select('id, onboarding_step')
      .eq('user_id', auth.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
    }

    const { data: existingSubmission, error: existingError } = await supabase
      .from('kyc_submissions')
      .select('status')
      .eq('client_id', profile.id)
      .maybeSingle()

    if (existingError) throw existingError
    if (existingSubmission?.status === 'approved' || existingSubmission?.status === 'under_review') {
      return NextResponse.json(
        { error: 'This KYC submission is locked while it is under review or approved' },
        { status: 409 }
      )
    }

    const data = parsed.data
    const now = new Date().toISOString()
    const submission = {
      client_id: profile.id,
      status: 'pending',
      submitted_at: now,
      reviewed_at: null,
      reviewed_by: null,
      rejection_reason: null,
      employment_status: data.employmentStatus,
      employer_name: data.employerName || null,
      annual_income_range: data.annualIncomeRange,
      source_of_funds: data.sourceOfFunds,
      trading_experience: data.tradingExperience,
      investment_objectives: data.investmentObjectives,
      politically_exposed: data.politicallyExposed,
      pep_details: data.pepDetails || null,
      us_person: data.usPerson,
      tax_residency: data.taxResidency || null,
      tax_id_number: data.taxIdNumber || null,
      updated_at: now,
    }

    if (existingSubmission) {
      const { data: updatedSubmission, error: submissionError } = await supabase
        .from('kyc_submissions')
        .update(submission)
        .eq('client_id', profile.id)
        .in('status', ['not_started', 'pending', 'rejected'])
        .select('id')
        .maybeSingle()

      if (submissionError) throw submissionError
      if (!updatedSubmission) {
        return NextResponse.json(
          { error: 'This KYC submission was locked while the request was being processed' },
          { status: 409 }
        )
      }
    } else {
      const { error: submissionError } = await supabase
        .from('kyc_submissions')
        .insert(submission)

      if (submissionError) throw submissionError
    }

    const { error: updateProfileError } = await supabase
      .from('client_profiles')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        date_of_birth: data.dateOfBirth,
        nationality: data.nationality,
        country_of_residence: data.countryOfResidence,
        address_line1: data.addressLine1,
        address_line2: data.addressLine2 || null,
        city: data.city,
        postal_code: data.postalCode,
        kyc_status: 'pending',
        onboarding_step: Math.max(profile.onboarding_step, 1),
        updated_at: now,
      })
      .eq('id', profile.id)

    if (updateProfileError) throw updateProfileError
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('KYC submission failed', error)
    return NextResponse.json({ error: 'Unable to submit KYC information' }, { status: 500 })
  }
}
