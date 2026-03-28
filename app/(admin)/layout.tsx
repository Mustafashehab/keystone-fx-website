import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AdminSidebarClient } from '@/components/layout/AdminSidebarClient'
import { ToastProvider } from '@/components/ui/Toast'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')
  if (user.user_metadata?.role !== 'admin') redirect('/portal/dashboard')

  const adminName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Admin'

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
        <AdminSidebarClient adminName={adminName} adminEmail={user.email ?? ''} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}