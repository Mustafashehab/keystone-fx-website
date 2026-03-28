import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getClientProfile } from '@/lib/dal/clients'
import { PortalSidebarClient } from '@/components/layout/PortalSidebarClient'
import { ToastProvider } from '@/components/ui/Toast'
import { PortalWhatsAppButton } from '@/components/layout/PortalWhatsAppButton'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/portal/login')
  }

  if (user.user_metadata?.role === 'admin') {
    redirect('/admin/dashboard')
  }

  const { data: profile } = await getClientProfile(user.id)

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user.email?.split('@')[0] ?? 'Client'

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--kfx-bg)]">

        <PortalSidebarClient
          userName={fullName}
          userEmail={user.email ?? ''}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.06),transparent_40%)]" />
          <main className="relative flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* WhatsApp support button — visible on all portal pages */}
        <PortalWhatsAppButton />

      </div>
    </ToastProvider>
  )
}