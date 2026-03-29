import { NextRequest, NextResponse } from 'next/server'
import { createNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  try {
    const { clientName, email, accountType } = await req.json()

    await createNotification({
      recipient: 'admin',
      type:      'new_client',
      title:     'New Client Registration',
      message:   `${clientName} (${email}) registered as a ${accountType} client.`,
      link:      '/admin/clients',
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}