'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminHeader, AdminFilterBar } from '@/components/layout/AdminHeader'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/FormFields'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadSchema, type LeadFormData } from '@/lib/validations'
import type { Lead, LeadStatus } from '@/types'

const STATUS_OPTIONS: { label: string; value: LeadStatus }[] = [
  { label: 'New',       value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Qualified', value: 'qualified' },
  { label: 'Converted', value: 'converted' },
  { label: 'Lost',      value: 'lost' },
]

const PIPELINE_COLUMNS: { status: LeadStatus; label: string }[] = [
  { status: 'new',       label: 'New' },
  { status: 'contacted', label: 'Contacted' },
  { status: 'qualified', label: 'Qualified' },
  { status: 'converted', label: 'Converted' },
  { status: 'lost',      label: 'Lost' },
]

const STATUS_PILL: Record<LeadStatus, string> = {
  new:       'bg-blue-100 text-blue-600',
  contacted: 'bg-purple-100 text-purple-600',
  qualified: 'bg-amber-100 text-amber-600',
  converted: 'bg-green-100 text-green-600',
  lost:      'bg-red-100 text-red-500',
}

type ViewMode = 'pipeline' | 'table'

export default function AdminLeadsPage() {
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [leads,      setLeads]      = useState<Lead[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [viewMode,   setViewMode]   = useState<ViewMode>('pipeline')
  const [showCreate, setShowCreate] = useState(false)
  const [editLead,   setEditLead]   = useState<Lead | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<LeadFormData>({ resolver: zodResolver(leadSchema) })

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
      setLeads((data ?? []) as Lead[])
      setLoading(false)
    }
    load()
  }, [supabase])

  const filtered = useMemo(() => {
    if (!search) return leads
    const q = search.toLowerCase()
    return leads.filter((l) =>
      l.email.toLowerCase().includes(q) ||
      ((l.first_name ?? '') + ' ' + (l.last_name ?? '')).toLowerCase().includes(q)
    )
  }, [leads, search])

  async function createLead(data: LeadFormData) {
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({ email: data.email, first_name: data.firstName ?? null, last_name: data.lastName ?? null, phone: data.phone ?? null, country: data.country ?? null, source: data.source ?? null, notes: data.notes ?? null, status: 'new' })
      .select().single()
    if (error) { toastError('Error', error.message); return }
    setLeads((prev) => [lead as Lead, ...prev])
    success('Lead created')
    reset()
    setShowCreate(false)
  }

  async function updateLeadStatus(id: string, status: LeadStatus) {
    const { error } = await supabase.from('leads').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) { toastError('Error', error.message); return }
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l))
  }

  const byStatus = (status: LeadStatus) => filtered.filter((l) => l.status === status)

  return (
    <div>
      <AdminHeader
        title="Leads"
        subtitle={leads.length + ' total leads'}
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-[#e2e8f0] overflow-hidden">
              {(['pipeline', 'table'] as ViewMode[]).map((m) => (
                <button key={m} onClick={() => setViewMode(m)}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                    viewMode === m ? 'bg-[#eef2f6] text-[#0f172a]' : 'bg-white text-[#64748b]'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}
              icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
              Add Lead
            </Button>
          </div>
        }
      />

      <AdminFilterBar searchPlaceholder="Search by name or email…" searchValue={search} onSearchChange={setSearch} />

      {loading ? (
        <div className="p-6 grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-64 bg-[#f8fafc] rounded animate-pulse" />)}
        </div>
      ) : viewMode === 'pipeline' ? (
        <div className="p-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {PIPELINE_COLUMNS.map((col) => {
              const colLeads = byStatus(col.status)
              return (
                <div key={col.status} className="w-56 shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">{col.label}</p>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-[#eef2f6] text-[#64748b]">{colLeads.length}</span>
                  </div>
                  <div className="space-y-2">
                    {colLeads.map((lead) => (
                      <div key={lead.id} className="rounded-xl border border-[#e5e7eb] bg-white p-3 cursor-pointer hover:border-[#cbd5e1] transition-all"
                        onClick={() => setEditLead(lead)}>
                        <p className="text-xs font-medium text-[#0f172a] truncate">
                          {lead.first_name || lead.last_name ? ((lead.first_name ?? '') + ' ' + (lead.last_name ?? '')).trim() : lead.email}
                        </p>
                        <p className="text-[11px] text-[#94a3b8] truncate mt-0.5">{lead.email}</p>
                        {lead.country && <p className="text-[11px] text-[#94a3b8] mt-0.5">{lead.country}</p>}
                        <div className="mt-2 flex items-center justify-between">
                          <select value={lead.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => { e.stopPropagation(); updateLeadStatus(lead.id, e.target.value as LeadStatus) }}
                            className="text-[10px] border border-[#e2e8f0] rounded-lg px-1.5 py-0.5 text-[#64748b] bg-white outline-none">
                            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                          <span className="text-[10px] text-[#94a3b8]">{formatDate(lead.created_at)}</span>
                        </div>
                      </div>
                    ))}
                    {colLeads.length === 0 && (
                      <div className="rounded-xl border border-dashed border-[#e5e7eb] p-4 text-center">
                        <p className="text-xs text-[#94a3b8]">Empty</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#f1f5f9]">
              <tr>
                {['Name / Email', 'Phone', 'Country', 'Source', 'Status', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#0f172a]">{lead.first_name || lead.last_name ? ((lead.first_name ?? '') + ' ' + (lead.last_name ?? '')).trim() : '—'}</p>
                    <p className="text-xs text-[#64748b]">{lead.email}</p>
                  </td>
                  <td className="px-4 py-3 text-[#64748b]">{lead.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-[#64748b]">{lead.country ?? '—'}</td>
                  <td className="px-4 py-3 text-[#64748b] capitalize">{lead.source ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_PILL[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#64748b]">{formatDate(lead.created_at)}</td>
                  <td className="px-4 py-3">
                    <select value={lead.status} onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      className="text-xs border border-[#e2e8f0] rounded-lg px-2 py-1 text-[#64748b] bg-white outline-none w-28">
                      {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showCreate} onClose={() => { setShowCreate(false); reset() }}
        title="Add Lead" size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowCreate(false); reset() }}>Cancel</Button>
            <Button variant="primary" loading={isSubmitting} onClick={handleSubmit(createLead)}>Create Lead</Button>
          </>
        }>
        <div className="space-y-4">
          <Input label="Email" type="email" required error={errors.email?.message} {...register('email')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last Name"  error={errors.lastName?.message}  {...register('lastName')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Phone"   error={errors.phone?.message}   {...register('phone')} />
            <Input label="Country" error={errors.country?.message} {...register('country')} />
          </div>
          <Input label="Source" placeholder="e.g. Referral, LinkedIn" error={errors.source?.message} {...register('source')} />
          <Textarea label="Notes" rows={3} error={errors.notes?.message} {...register('notes')} />
        </div>
      </Modal>

      {editLead && (
        <Modal open={!!editLead} onClose={() => setEditLead(null)}
          title={editLead.first_name || editLead.last_name ? ((editLead.first_name ?? '') + ' ' + (editLead.last_name ?? '')).trim() : editLead.email}
          size="md"
          footer={<Button variant="secondary" onClick={() => setEditLead(null)}>Close</Button>}>
          <div className="space-y-3">
            {[
              { label: 'Email',   value: editLead.email },
              { label: 'Phone',   value: editLead.phone ?? '—' },
              { label: 'Country', value: editLead.country ?? '—' },
              { label: 'Source',  value: editLead.source ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="py-1.5 border-b border-[#f1f5f9] last:border-0">
                <p className="text-[11px] text-[#94a3b8] uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm text-[#0f172a]">{value}</p>
              </div>
            ))}
            {editLead.notes && (
              <div className="py-1.5">
                <p className="text-[11px] text-[#94a3b8] uppercase tracking-wider mb-0.5">Notes</p>
                <p className="text-sm text-[#0f172a]">{editLead.notes}</p>
              </div>
            )}
            <div className="pt-3 border-t border-[#f1f5f9]">
              <p className="text-xs font-medium text-[#64748b] mb-2">Move to Stage</p>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map((o) => (
                  <button key={o.value}
                    onClick={() => { updateLeadStatus(editLead.id, o.value); setEditLead((prev) => prev ? { ...prev, status: o.value } : prev) }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      editLead.status === o.value
                        ? 'bg-[#eef2f6] border-[#e2e8f0] text-[#0f172a] font-semibold'
                        : 'bg-white border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9]'
                    }`}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}