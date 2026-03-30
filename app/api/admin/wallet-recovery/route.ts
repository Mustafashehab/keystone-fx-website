import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'

// POST /api/admin/wallet-recovery
// Returns the decrypted private key for a client wallet.
// Admin only. Every access is logged to financial_events.
// Use this when funds are stuck in a client wallet and manual intervention is needed.

export async function POST(req: NextRequest) {
  try {
    // Auth check — admin only
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { walletAddress, reason } = await req.json()

    if (!walletAddress) {
      return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 })
    }

    if (!reason || reason.trim().length < 10) {
      return NextResponse.json(
        { error: 'A reason is required (minimum 10 characters) for audit purposes.' },
        { status: 400 }
      )
    }

    const supabase = await createServiceRoleClient()

    // Find the wallet
    const { data: wallet, error: walletError } = await supabase
      .from('client_wallets')
      .select('id, client_id, tron_address, encrypted_private_key, usdt_balance')
      .eq('tron_address', walletAddress)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    if (!wallet.encrypted_private_key) {
      return NextResponse.json({ error: 'No private key on record for this wallet' }, { status: 400 })
    }

    // Decrypt the private key
    const { decryptPrivateKey } = await import('@/lib/tron/encrypt')
    const privateKey = decryptPrivateKey(wallet.encrypted_private_key)

    // Log every access to financial_events for full audit trail
    await supabase.from('financial_events').insert({
      event_type:   'wallet.key_accessed',
      client_id:    wallet.client_id,
      actor_id:     user.id,
      actor_role:   'admin',
      entity_type:  'client_wallet',
      entity_id:    wallet.id,
      metadata: {
        wallet_address:  walletAddress,
        usdt_balance:    wallet.usdt_balance,
        access_reason:   reason.trim(),
        accessed_by:     user.email,
        accessed_at:     new Date().toISOString(),
        warning:         'Private key was decrypted and returned to admin. Verify this was authorized.',
      },
      idempotency_key: `wallet_key_accessed:${wallet.id}:${Date.now()}`,
    })

    return NextResponse.json({
      success:       true,
      walletAddress: wallet.tron_address,
      privateKey,
      usdtBalance:   wallet.usdt_balance,
      warning:       'This access has been logged permanently. Import this key into TronLink to manually move funds. Delete the key from memory when done.',
    })

  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}