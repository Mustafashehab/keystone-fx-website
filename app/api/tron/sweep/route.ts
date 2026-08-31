import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminApi } from '@/lib/auth/guards'
import { parseJsonBody } from '@/lib/api/validation'
import { areFinancialOperationsEnabled } from '@/lib/financial/operations'
import { sweepToMaster } from '@/lib/tron/sweep'

const sweepSchema = z.object({ clientId: z.string().uuid() })

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminApi()
    if (auth.response) return auth.response

    if (!(await areFinancialOperationsEnabled())) {
      return NextResponse.json({ error: 'Financial operations are disabled' }, { status: 503 })
    }

    const parsed = await parseJsonBody(req, sweepSchema)
    if (parsed.response) return parsed.response
    const { clientId } = parsed.data

    const result = await sweepToMaster(clientId)

    if (result.error) {
      return NextResponse.json(
        {
          error: result.error,
          pendingReview: result.pendingReview,
          usdtTxHash: result.usdtTxHash,
          usdtAmount: result.usdtAmount,
        },
        { status: result.pendingReview ? 409 : 500 }
      )
    }

    return NextResponse.json({
      success:    true,
      usdtTxHash: result.usdtTxHash,
      trxTxHash:  result.trxTxHash,
      usdtAmount: result.usdtAmount,
      trxAmount:  result.trxAmount,
      confirmed:  result.confirmed,
      pendingReview: result.pendingReview,
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
