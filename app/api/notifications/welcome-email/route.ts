import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerSupabaseClient } from '@/lib/supabase/server'

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const email = user.email
    const firstName = escapeHtml(String(user.user_metadata?.first_name ?? 'Client'))
    const lastName = escapeHtml(String(user.user_metadata?.last_name ?? ''))
    const safeEmail = escapeHtml(email)

    const apiKey = process.env.RESEND_API_KEY
    // TODO: add RESEND_API_KEY to .env.local and your hosting platform (Vercel)
    if (!apiKey) {
      console.warn('[welcome-email] RESEND_API_KEY not set — skipping email send')
      return NextResponse.json({ success: true, skipped: true })
    }

    const resend = new Resend(apiKey)

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 40px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #c9a84c; margin: 0; font-size: 24px; letter-spacing: 0.5px;">Keystone FX</h1>
          <p style="color: #94a3b8; margin: 8px 0 0; font-size: 14px;">Client Portal</p>
        </div>
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin: 0 0 8px; font-size: 20px;">Welcome, ${firstName}!</h2>
          <p style="color: #64748b; margin: 0 0 28px; font-size: 15px;">Your Keystone FX account has been created. You can sign in using your email and the password you chose during registration.</p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px 24px; margin-bottom: 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #64748b; width: 110px;">Full Name</td>
                <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #0f172a;">${firstName} ${lastName}</td>
              </tr>
              <tr style="border-top: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; font-size: 13px; color: #64748b;">Email</td>
                <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #0f172a;">${safeEmail}</td>
              </tr>

            </table>
          </div>

          <a href="https://keystone-fx.com/portal/login"
            style="display: inline-block; background: linear-gradient(135deg, #c9a84c 0%, #f5c842 100%); color: #0f0a02; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
            Log In to Your Portal
          </a>

          <p style="color: #94a3b8; font-size: 12px; margin: 28px 0 0;">
            Keep your password private. Keystone FX will never email it to you.
            If you have any questions, contact us via WhatsApp or email.
          </p>
        </div>
      </div>
    `

    const { error } = await resend.emails.send({
      from:    'Keystone FX <info@keystone-fx.com>',
      to:      [email],
      subject: 'Welcome to Keystone FX — Your Account Details',
      html,
    })

    if (error) {
      console.error('[welcome-email] Resend error:', error)
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
