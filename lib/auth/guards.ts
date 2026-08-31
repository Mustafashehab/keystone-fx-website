import type { User } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export function isAdminUser(user: User | null | undefined): boolean {
  return user?.app_metadata?.role === 'admin'
}

export async function getAuthenticatedUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null
  return user
}

type ApiAuthSuccess = { user: User; response?: never }
type ApiAuthFailure = { user?: never; response: NextResponse }

export async function requireAuthenticatedApi(): Promise<ApiAuthSuccess | ApiAuthFailure> {
  const user = await getAuthenticatedUser()

  if (!user) {
    return {
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  return { user }
}

export async function requireAdminApi(): Promise<ApiAuthSuccess | ApiAuthFailure> {
  const auth = await requireAuthenticatedApi()
  if (auth.response) return auth

  if (!isAdminUser(auth.user)) {
    return {
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    }
  }

  return auth
}
