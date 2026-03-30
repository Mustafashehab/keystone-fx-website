'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PortalSidebar } from './PortalSidebar'

interface PortalSidebarClientProps {
  userName: string
  userEmail: string
}

export function PortalSidebarClient({ userName, userEmail }: PortalSidebarClientProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/portal/login')
    router.refresh()
  }

  return (
    <PortalSidebar
      userName={userName}
      userEmail={userEmail}
      onSignOut={handleSignOut}
    />
  )
}