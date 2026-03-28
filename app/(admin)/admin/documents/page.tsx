'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminHeader, AdminFilterBar } from '@/components/layout/AdminHeader'
import { useToast } from '@/components/ui/Toast'
import { formatDateTime, formatFileSize } from '@/lib/utils'
import type { DocumentStatus } from '@/types'

const BUCKET = 'client-documents'

interface DocRow {
  id: string
  client_id: string
  type: string
  file_name: string
  file_path: string
  file_size: number
  status: DocumentStatus
  uploaded_at: string
  rejection_reason: string | null
  client_profiles: { first_name: string; last_name: string } | null
}

const STATUS_FILTERS: { label: string; value: DocumentStatus | 'all' }[] = [
  { label: 'All',      value: 'all' },
  { label: 'Pending',  value: 'pending' },
  { label: 'Verified', value: 'verified' },
  { label: 'Rejected', value: 'rejected' },
]

const DOC_STYLES: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-600',
  verified: 'bg-green-100 text-green-600',
  rejected: 'bg-red-100 text-red-600',
}

export default function AdminDocumentsPage() {
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [documents,    setDocuments]    = useState<DocRow[]>([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('pending')
  const [rejecting,    setRejecting]    = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/documents')
      const data = await res.json()
      setDocuments(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      const name        = ((d.client_profiles?.first_name ?? '') + ' ' + (d.client_profiles?.last_name ?? '')).toLowerCase()
      const matchSearch = !search || name.includes(search.toLowerCase()) || d.file_name.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || d.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [documents, search, statusFilter])

  async function updateStatus(id: string, status: DocumentStatus, reason?: string) {
    const res = await fetch('/api/admin/documents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, rejection_reason: reason }),
    })
    if (!res.ok) { toastError('Update failed', 'Could not update document status'); return }
    setDocuments((prev) => prev.map((d) => d.id === id ? { ...d, status, rejection_reason: reason ?? null } : d))
    setRejecting(null)
    setRejectReason('')
    success(status === 'verified' ? 'Document verified' : 'Document rejected')
  }

  async function viewDocument(filePath: string) {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(filePath, 3600)
    if (error || !data) { toastError('Could not load file'); return }
    window.open(data.signedUrl, '_blank')
  }

  return (
    <div>
      <AdminHeader title="Documents" subtitle="Review and verify client-submitted documents" />
      <AdminFilterBar searchPlaceholder="Search by client or filename…" searchValue={search} onSearchChange={setSearch}>
        <div className="flex items-center gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                statusFilter === f.value
                  ? 'bg-[#eef2f6] border-[#e2e8f0] text-[#0f172a] font-semibold'
                  : 'bg-white border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9]'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </AdminFilterBar>

      <div className="p-6 space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-[#f8fafc] rounded animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-[#64748b]">No documents match your filters.</p>
          </div>
        ) : (
          filtered.map((doc) => (
            <div key={doc.id} className="rounded-xl border border-[#e5e7eb] bg-white p-4">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-[#f8fafc] border border-[#e5e7eb] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-medium text-[#0f172a] truncate">{doc.file_name}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${DOC_STYLES[doc.status]}`}>
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b]">
                    <span className="font-medium text-[#0f172a]">{doc.client_profiles?.first_name} {doc.client_profiles?.last_name}</span>
                    {' · '}
                    <span className="capitalize">{doc.type.replace(/_/g, ' ')}</span>
                    {' · '}{formatFileSize(doc.file_size)}
                    {' · '}{formatDateTime(doc.uploaded_at)}
                  </p>
                  {doc.rejection_reason && (
                    <p className="text-xs text-red-500 mt-1">Rejected: {doc.rejection_reason}</p>
                  )}

                  {rejecting === doc.id && (
                    <div className="mt-3 flex gap-2">
                      <input type="text" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Reason for rejection…"
                        className="flex-1 h-9 px-3 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] outline-none focus:border-[#94a3b8]" />
                      <button onClick={() => updateStatus(doc.id, 'rejected', rejectReason)}
                        disabled={!rejectReason.trim()}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white disabled:opacity-40">
                        Confirm
                      </button>
                      <button onClick={() => { setRejecting(null); setRejectReason('') }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e2e8f0] text-[#64748b]">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => viewDocument(doc.file_path)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] transition-colors">
                    View
                  </button>
                  {doc.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(doc.id, 'verified')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                        Verify
                      </button>
                      <button onClick={() => setRejecting(doc.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-500 hover:bg-red-200 transition-colors">
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}