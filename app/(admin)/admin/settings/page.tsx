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

  const [email,       setEmail]       = useState('')
  const [newPwd,      setNewPwd]      = useState('')
  const [confirmPwd,  setConfirmPwd]  = useState('')
  const [pwdError,    setPwdError]    = useState<string | null>(null)
  const [savingEmail, setSavingEmail] = useState(false)
  const [savingPwd,   setSavingPwd]   = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/admin/login'); return }
      setEmail(user.email ?? '')
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

  return (
    <div>
      <AdminHeader title="Settings" subtitle="Administrator account and platform configuration" />

      <div className="p-6 max-w-xl space-y-5">

        <Section title="Account">
          <div className="space-y-4">
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="flex justify-end">
              <Button variant="primary" size="sm" loading={savingEmail} onClick={handleUpdateEmail}>Save</Button>
            </div>
          </div>
        </Section>

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

        <Section title="Platform Info">
          <div className="space-y-3">
            {[
              { label: 'Platform',  value: 'Keystone FX Client Portal' },
              { label: 'Version',   value: 'MVP 1.0' },
              { label: 'Framework', value: 'Next.js 15 App Router' },
              { label: 'Database',  value: 'Supabase Postgres' },
              { label: 'Auth',      value: 'Supabase Auth' },
              { label: 'Storage',   value: 'Supabase Storage' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-[#f1f5f9] last:border-0">
                <p className="text-xs text-[#94a3b8]">{label}</p>
                <p className="text-xs font-medium text-[#0f172a]">{value}</p>
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
    <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-[#f1f5f9] bg-[#f8fafc]">
        <p className="text-xs font-semibold text-[#64748b] uppercase tracking-widest">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}