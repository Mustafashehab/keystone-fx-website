'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PortalHeader } from '@/components/layout/PortalHeader'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/FormFields'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { ConfirmDialog } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

const NOTIFICATION_PREFS = [
  {
    key: 'kycUpdates' as const,
    label: 'KYC status updates',
    desc: 'When your KYC review status changes',
  },
  {
    key: 'documentUpdates' as const,
    label: 'Document review updates',
    desc: 'When uploaded documents are verified or rejected',
  },
  {
    key: 'ticketReplies' as const,
    label: 'Support ticket replies',
    desc: 'When our team responds to your tickets',
  },
  {
    key: 'accountUpdates' as const,
    label: 'Account application updates',
    desc: 'When your account application status changes',
  },
  {
    key: 'marketing' as const,
    label: 'Product updates & news',
    desc: 'Occasional updates about Keystone FX services',
  },
]

type NotificationKeys = (typeof NOTIFICATION_PREFS)[number]['key']
type NotificationState = Record<NotificationKeys, boolean>

const DEFAULT_NOTIFICATIONS: NotificationState = {
  kycUpdates:      true,
  documentUpdates: true,
  ticketReplies:   true,
  accountUpdates:  true,
  marketing:       false,
}

export default function SettingsPage() {
  const router   = useRouter()
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [email,         setEmail]         = useState('')
  const [newPwd,        setNewPwd]        = useState('')
  const [confirmPwd,    setConfirmPwd]    = useState('')
  const [pwdError,      setPwdError]      = useState<string | null>(null)
  const [savingEmail,   setSavingEmail]   = useState(false)
  const [savingPwd,     setSavingPwd]     = useState(false)
  const [showDeleteDlg, setShowDeleteDlg] = useState(false)
  const [notifications, setNotifications] = useState<NotificationState>(
    DEFAULT_NOTIFICATIONS
  )

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/portal/login'); return }
      setEmail(user.email ?? '')
    }
    load()
  }, [supabase, router])

  async function handleUpdateEmail() {
    if (!email) return
    setSavingEmail(true)
    const { error } = await supabase.auth.updateUser({ email })
    setSavingEmail(false)
    if (error) { toastError('Update failed', error.message); return }
    success('Email updated', 'Please check your new email to confirm the change.')
  }

  async function handleUpdatePassword() {
    setPwdError(null)
    if (newPwd.length < 8) {
      setPwdError('Password must be at least 8 characters')
      return
    }
    if (newPwd !== confirmPwd) {
      setPwdError('Passwords do not match')
      return
    }
    setSavingPwd(true)
    const { error } = await supabase.auth.updateUser({ password: newPwd })
    setSavingPwd(false)
    if (error) { setPwdError(error.message); return }
    success('Password updated')
    setNewPwd('')
    setConfirmPwd('')
  }

  function handleDeleteAccount() {
    toastError(
      'Contact support',
      'To close your account please contact support@keystonefx.com'
    )
    setShowDeleteDlg(false)
  }

  function toggleNotification(key: NotificationKeys) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div>
      <PortalHeader
        title="Settings"
        subtitle="Manage your account preferences and security."
      />

      <div className="p-6 space-y-6 max-w-2xl">

        {/* Email */}
        <Card>
          <h2 className="text-sm font-semibold text-[var(--kfx-text)] mb-5">
            Email Address
          </h2>
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              hint="Changing your email will require re-verification."
            />
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                loading={savingEmail}
                onClick={handleUpdateEmail}
              >
                Update Email
              </Button>
            </div>
          </div>
        </Card>

        {/* Password */}
        <Card>
          <h2 className="text-sm font-semibold text-[var(--kfx-text)] mb-5">
            Change Password
          </h2>
          <div className="space-y-4">
            {pwdError && <Alert variant="error">{pwdError}</Alert>}
            <Input
              label="New Password"
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              autoComplete="new-password"
              hint="Minimum 8 characters."
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              autoComplete="new-password"
            />
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                loading={savingPwd}
                onClick={handleUpdatePassword}
              >
                Change Password
              </Button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <h2 className="text-sm font-semibold text-[var(--kfx-text)] mb-5">
            Notification Preferences
          </h2>
          <div className="space-y-4">
            {NOTIFICATION_PREFS.map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-start justify-between gap-4 py-1"
              >
                <div>
                  <p className="text-sm text-[var(--kfx-text)]">{label}</p>
                  <p className="text-xs text-[var(--kfx-text-muted)] mt-0.5">
                    {desc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotification(key)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 mt-0.5 ${
                    notifications[key]
                      ? 'bg-[var(--kfx-accent)]'
                      : 'bg-[var(--kfx-surface-raised)] border border-[var(--kfx-border)]'
                  }`}
                  role="switch"
                  aria-checked={notifications[key]}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                      notifications[key]
                        ? 'translate-x-[18px]'
                        : 'translate-x-[3px]'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Danger zone */}
        <Card>
          <h2 className="text-sm font-semibold text-[var(--kfx-danger)] mb-2">
            Danger Zone
          </h2>
          <p className="text-xs text-[var(--kfx-text-muted)] mb-4">
            Closing your account will permanently remove all your data. This
            action cannot be undone.
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteDlg(true)}
          >
            Close Account
          </Button>
        </Card>
      </div>

      <ConfirmDialog
        open={showDeleteDlg}
        onClose={() => setShowDeleteDlg(false)}
        onConfirm={handleDeleteAccount}
        title="Close Account"
        message="Are you sure you want to close your Keystone FX account? This action is permanent and cannot be undone."
        confirmLabel="Yes, Close Account"
        cancelLabel="Keep Account"
        variant="danger"
      />
    </div>
  )
}