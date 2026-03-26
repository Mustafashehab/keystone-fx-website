'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from './AdminSidebar'

interface AdminSidebarClientProps {
  adminName: string
  adminEmail: string
}

export function AdminSidebarClient({ adminName, adminEmail }: AdminSidebarClientProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <AdminSidebar
      adminName={adminName}
      adminEmail={adminEmail}
      onSignOut={handleSignOut}
    />
  )
}