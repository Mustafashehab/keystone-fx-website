'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { Input } from '@/components/ui/FormFields'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useToast } from '@/components/ui/Toast'

export default function AdminSettingsPage() {
  const router   = useRouter()
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [email,           setEmail]           = useState('')
  const [newPwd,          setNewPwd]          = useState('')
  const [confirmPwd,      setConfirmPwd]      = useState('')
  const [pwdError,        setPwdError]        = useState<string | null>(null)
  const [savingEmail,     setSavingEmail]     = useState(false)
  const [savingPwd,       setSavingPwd]       = useState(false)

  // Maintenance toggle state
  const [financialEnabled,   setFinancialEnabled]   = useState(true)
  const [loadingToggle,      setLoadingToggle]      = useState(true)
  const [savingToggle,       setSavingToggle]       = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/admin/login'); return }
      setEmail(user.email ?? '')

      // Load platform settings
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        setFinancialEnabled(data.financial_services_enabled)
      }
      setLoadingToggle(false)
    }
    load()
  }, [supabase, router])

  async function handleUpdateEmail() {
    setSavingEmail(true)
    const { error } = await supabase.auth.updateUser({ email })
    setSavingEmail(false)
    if (error) { toastError('Update failed', error.message); return }
    success('Email updated', 'Confirm the change via your new email address.')
  }

  async function handleUpdatePassword() {
    setPwdError(null)
    if (newPwd.length < 8) { setPwdError('Minimum 8 characters'); return }
    if (newPwd !== confirmPwd) { setPwdError('Passwords do not match'); return }
    setSavingPwd(true)
    const { error } = await supabase.auth.updateUser({ password: newPwd })
    setSavingPwd(false)
    if (error) { setPwdError(error.message); return }
    success('Password updated')
    setNewPwd('')
    setConfirmPwd('')
  }

  async function handleToggleFinancial() {
    setSavingToggle(true)
    const newValue = !financialEnabled
    try {
      const res = await fetch('/api/admin/settings', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ financial_services_enabled: newValue }),
      })
      if (!res.ok) {
        toastError('Failed', 'Could not update financial services toggle.')
        return
      }
      setFinancialEnabled(newValue)
      success(
        newValue ? 'Financial services enabled' : 'Financial services disabled',
        newValue
          ? 'Clients can now deposit and withdraw normally.'
          : 'Deposit and withdrawal pages now show the WhatsApp support message.'
      )
    } catch {
      toastError('Network error', 'Could not reach server.')
    } finally {
      setSavingToggle(false)
    }
  }

  return (
    <div>
      <AdminHeader title="Settings" subtitle="Administrator account and platform configuration" />

      <div className="p-6 max-w-xl space-y-5">

        {/* ── Maintenance Toggle ─────────────────────────────────────── */}
        <Section title="Financial Services">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--kfx-text)]">
                Deposit &amp; Withdrawal
              </p>
              <p className="text-xs text-[var(--kfx-text-muted)] mt-0.5">
                {financialEnabled
                  ? 'Currently active — clients can deposit and withdraw.'
                  : 'Currently disabled — clients see WhatsApp support message.'}
              </p>
            </div>
            <button
              onClick={handleToggleFinancial}
              disabled={savingToggle || loadingToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                financialEnabled ? 'bg-green-500' : 'bg-red-500'
              } ${savingToggle || loadingToggle ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  financialEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {!financialEnabled && (
            <p className="text-xs text-amber-600 mt-3 bg-amber-50 px-3 py-2 rounded">
              ⚠ Financial services are OFF. Clients cannot deposit or withdraw until this is re-enabled.
            </p>
          )}
        </Section>

        {/* ── Account ───────────────────────────────────────────────── */}
        <Section title="Account">
          <div className="space-y-4">
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="flex justify-end">
              <Button variant="primary" size="sm" loading={savingEmail} onClick={handleUpdateEmail}>Save</Button>
            </div>
          </div>
        </Section>

        {/* ── Password ──────────────────────────────────────────────── */}
        <Section title="Change Password">
          <div className="space-y-4">
            {pwdError && <Alert variant="error">{pwdError}</Alert>}
            <Input label="New Password" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} hint="Minimum 8 characters." />
            <Input label="Confirm New Password" type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
            <div className="flex justify-end">
              <Button variant="primary" size="sm" loading={savingPwd} onClick={handleUpdatePassword}>Update Password</Button>
            </div>
          </div>
        </Section>

        {/* ── Platform Info ─────────────────────────────────────────── */}
        <Section title="Platform Info">
          <div className="space-y-3">
            {[
              { label: 'Platform',   value: 'Keystone FX Client Portal' },
              { label: 'Version',    value: 'MVP 1.0' },
              { label: 'Framework',  value: 'Next.js 15 App Router' },
              { label: 'Database',   value: 'Supabase Postgres' },
              { label: 'Auth',       value: 'Supabase Auth' },
              { label: 'Storage',    value: 'Supabase Storage' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-[var(--kfx-text-muted)]">{label}</span>
                <span className="text-[var(--kfx-text)] font-medium">{value}</span>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--kfx-surface)] border border-[var(--kfx-border)] rounded-xl p-5">
      <h2 className="text-sm font-semibold text-[var(--kfx-text)] mb-4">{title}</h2>
      {children}
    </div>
  )
}