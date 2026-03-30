'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import type { KYCStatus } from '@/types'

export function KYCReviewActions({ kycId, clientId, reviewerId, currentStatus }: {
  kycId: string
  clientId: string
  reviewerId: string
  currentStatus: KYCStatus
}) {
  const router = useRouter()
  const { success, error: toastError } = useToast()

  const [rejectionReason, setRejectionReason] = useState('')
  const [showReject,      setShowReject]       = useState(false)
  const [processing,      setProcessing]       = useState(false)

  async function updateStatus(status: KYCStatus, reason?: string) {
    setProcessing(true)
    try {
      const res = await fetch('/api/admin/kyc', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kycId, clientId, status, reviewerId, rejectionReason: reason }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Update failed')
      }
      success(status === 'approved' ? 'KYC Approved' : status === 'rejected' ? 'KYC Rejected' : 'Status Updated')
      router.push('/admin/kyc')
      router.refresh()
    } catch (err: unknown) {
      toastError('Update failed', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white sticky top-6 overflow-hidden">
      <div className="px-4 py-3 border-b border-[#f1f5f9] bg-[#f8fafc]">
        <p className="text-xs font-semibold text-[#64748b] uppercase tracking-widest">Review Actions</p>
      </div>

      <div className="p-4 space-y-3">
        {currentStatus === 'pending' && (
          <button onClick={() => updateStatus('under_review')} disabled={processing}
            className="w-full py-2.5 rounded-xl text-sm font-medium border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all disabled:opacity-50">
            Mark as Under Review
          </button>
        )}

        <button onClick={() => updateStatus('approved')} disabled={processing}
          className="w-full py-2.5 rounded-xl text-sm font-semibold bg-green-500 text-white hover:bg-green-600 transition-all disabled:opacity-50">
          {processing ? 'Processing…' : '✓ Approve KYC'}
        </button>

        {!showReject ? (
          <button onClick={() => setShowReject(true)} disabled={processing}
            className="w-full py-2.5 rounded-xl text-sm font-medium border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-all disabled:opacity-50">
            ✕ Reject KYC
          </button>
        ) : (
          <div className="space-y-2">
            <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection (required)…" rows={3}
              className="w-full rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm text-[#0f172a] outline-none focus:border-[#94a3b8] resize-none" />
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setShowReject(false); setRejectionReason('') }}
                className="py-2 rounded-xl text-xs font-medium border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] transition-colors">
                Cancel
              </button>
              <button onClick={() => updateStatus('rejected', rejectionReason)}
                disabled={!rejectionReason.trim() || processing}
                className="py-2 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-40">
                Confirm Reject
              </button>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-[#f1f5f9]">
          <p className="text-[11px] text-[#94a3b8]">Actions are logged with your reviewer ID and timestamp.</p>
        </div>
      </div>
    </div>
  )
}