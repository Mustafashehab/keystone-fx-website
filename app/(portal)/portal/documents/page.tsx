'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PortalHeader } from '@/components/layout/PortalHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useToast } from '@/components/ui/Toast'
import { formatDate, formatFileSize } from '@/lib/utils'
import type { Document, DocumentType, ClientProfile } from '@/types'

const BUCKET = 'client-documents'

const REQUIRED_DOCUMENTS: {
  type: DocumentType
  label: string
  description: string
  accept: string
}[] = [
  {
    type: 'passport',
    label: 'Passport',
    description: 'Clear colour scan of your valid passport (photo page)',
    accept: 'image/jpeg,image/png,application/pdf',
  },
  {
    type: 'proof_of_address',
    label: 'Proof of Address',
    description:
      'Utility bill, bank statement, or government letter (issued within 3 months)',
    accept: 'image/jpeg,image/png,application/pdf',
  },
  {
    type: 'bank_statement',
    label: 'Bank Statement',
    description:
      'Most recent bank statement showing your name and account details',
    accept: 'image/jpeg,image/png,application/pdf',
  },
]

export default function DocumentsPage() {
  const router   = useRouter()
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [profile,   setProfile]   = useState<ClientProfile | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/portal/login'); return }

      const { data: profileData } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!profileData) { setLoading(false); return }
      setProfile(profileData as ClientProfile)

      const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', profileData.id)
        .order('uploaded_at', { ascending: false })

      setDocuments((docs ?? []) as Document[])
      setLoading(false)
    }
    load()
  }, [supabase, router])

  async function handleUpload(file: File, type: DocumentType) {
    if (!profile) return
    setUploading((prev) => ({ ...prev, [type]: true }))

    try {
      const ext      = file.name.split('.').pop()
      const filePath = `${profile.id}/${type}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { upsert: false })

      if (uploadError) throw new Error(uploadError.message)

      const { data, error: insertError } = await supabase
        .from('documents')
        .insert({
          client_id: profile.id,
          type,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          status:    'pending',
        })
        .select()
        .single()

      if (insertError) throw new Error(insertError.message)

      setDocuments((prev) => [data as Document, ...prev])
      success('Document uploaded', `${file.name} has been submitted for review.`)

      if (profile.onboarding_step < 2) {
        await supabase
          .from('client_profiles')
          .update({ onboarding_step: 2, updated_at: new Date().toISOString() })
          .eq('id', profile.id)
        setProfile((prev) => (prev ? { ...prev, onboarding_step: 2 } : prev))
      }
    } catch (err: unknown) {
      toastError('Upload failed', err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }))
    }
  }

  async function handleDelete(doc: Document) {
    try {
      await supabase.storage.from(BUCKET).remove([doc.file_path])
      await supabase.from('documents').delete().eq('id', doc.id)
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id))
      success('Document removed')
    } catch {
      toastError('Delete failed', 'Unable to remove document.')
    }
  }

  async function handleView(filePath: string) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(filePath, 3600)

    if (error || !data) { toastError('Could not load file'); return }
    window.open(data.signedUrl, '_blank')
  }

  if (loading) {
    return (
      <div>
        <PortalHeader
          title="Documents"
          subtitle="Upload and manage your verification documents."
        />
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-[var(--kfx-surface-raised)] rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  const docsByType = documents.reduce<Record<string, Document[]>>((acc, doc) => {
    acc[doc.type] = [...(acc[doc.type] ?? []), doc]
    return acc
  }, {})

  const allRequiredUploaded = REQUIRED_DOCUMENTS.every(
    (req) => (docsByType[req.type]?.length ?? 0) > 0
  )

  return (
    <div>
      <PortalHeader
        title="Document Verification"
        subtitle="Upload clear, legible copies of the required documents below."
      />

      <div className="p-6 space-y-5">
        <Alert variant="info">
          All documents must be valid, unedited, and clearly readable. Files
          must be JPG, PNG, or PDF and under 10 MB each.
        </Alert>

        {REQUIRED_DOCUMENTS.map((req) => {
          const uploaded = docsByType[req.type] ?? []
          const latest   = uploaded[0]
          return (
            <Card key={req.type}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-[var(--kfx-text)]">
                      {req.label}
                    </h3>
                    <span className="text-xs text-[var(--kfx-danger)]">Required</span>
                    {latest && (
                      <StatusBadge type="document" status={latest.status} />
                    )}
                  </div>
                  <p className="text-xs text-[var(--kfx-text-muted)]">
                    {req.description}
                  </p>
                </div>
                <UploadButton
                  accept={req.accept}
                  loading={uploading[req.type] ?? false}
                  onFile={(file) => handleUpload(file, req.type)}
                  disabled={latest?.status === 'verified'}
                />
              </div>

              {uploaded.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploaded.map((doc) => (
                    <DocumentRow
                      key={doc.id}
                      doc={doc}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}

              {latest?.status === 'rejected' && latest.rejection_reason && (
                <Alert variant="error" className="mt-3">
                  <strong>Rejected:</strong> {latest.rejection_reason}. Please
                  upload a new document.
                </Alert>
              )}
            </Card>
          )
        })}

        {/* Additional / other uploaded docs not in required list */}
        {Object.entries(docsByType)
          .filter(([type]) => !REQUIRED_DOCUMENTS.some((r) => r.type === type))
          .map(([type, docs]) => (
            <Card key={type}>
              <h3 className="text-sm font-semibold text-[var(--kfx-text)] mb-3 capitalize">
                {type.replace(/_/g, ' ')}
              </h3>
              <div className="space-y-2">
                {docs.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    doc={doc}
                    onView={handleView}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </Card>
          ))}

        {allRequiredUploaded && (
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => router.push('/portal/account-application')}
            >
              Continue to Account Application →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function UploadButton({
  accept,
  loading,
  onFile,
  disabled,
}: {
  accept: string
  loading: boolean
  onFile: (file: File) => void
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) { onFile(file); e.target.value = '' }
        }}
      />
      <Button
        variant="secondary"
        size="sm"
        loading={loading}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        icon={
          !loading ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          ) : undefined
        }
      >
        {disabled ? 'Verified' : 'Upload'}
      </Button>
    </>
  )
}

function DocumentRow({
  doc,
  onView,
  onDelete,
}: {
  doc: Document
  onView: (path: string) => void
  onDelete: (doc: Document) => void
}) {
  const isVerified = doc.status === 'verified'
  const isRejected = doc.status === 'rejected'

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
        isRejected
          ? 'border-[var(--kfx-danger)]/30 bg-[var(--kfx-danger-muted)]'
          : isVerified
          ? 'border-[var(--kfx-success)]/30 bg-[var(--kfx-success-muted)]'
          : 'border-[var(--kfx-border)] bg-[var(--kfx-surface-raised)]'
      }`}
    >
      <div className="w-8 h-8 rounded bg-[var(--kfx-surface)] flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-[var(--kfx-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[var(--kfx-text)] truncate">
          {doc.file_name}
        </p>
        <p className="text-[11px] text-[var(--kfx-text-subtle)] mt-0.5">
          {formatFileSize(doc.file_size)} · Uploaded {formatDate(doc.uploaded_at)}
        </p>
      </div>

      <StatusBadge type="document" status={doc.status} />

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onView(doc.file_path)}
          className="kfx-btn-ghost !px-2 !py-1.5"
          title="View"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        {!isVerified && (
          <button
            onClick={() => onDelete(doc)}
            className="kfx-btn-ghost !px-2 !py-1.5 !text-[var(--kfx-danger)] hover:!bg-[var(--kfx-danger-muted)]"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}