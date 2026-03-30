import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type {
  KYCStatus,
  DocumentStatus,
  ApplicationStatus,
  LeadStatus,
  TicketStatus,
  TicketPriority,
} from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const KYC_STATUS_MAP: Record<KYCStatus, { label: string; color: string }> = {
  not_started:  { label: 'Not Started', color: 'text-zinc-400 bg-zinc-400/10' },
  pending:      { label: 'Pending Review', color: 'text-amber-400 bg-amber-400/10' },
  under_review: { label: 'Under Review', color: 'text-blue-400 bg-blue-400/10' },
  approved:     { label: 'Approved', color: 'text-emerald-400 bg-emerald-400/10' },
  rejected:     { label: 'Rejected', color: 'text-red-400 bg-red-400/10' },
}

export const DOCUMENT_STATUS_MAP: Record<DocumentStatus, { label: string; color: string }> = {
  pending:  { label: 'Pending',  color: 'text-amber-400 bg-amber-400/10' },
  verified: { label: 'Verified', color: 'text-emerald-400 bg-emerald-400/10' },
  rejected: { label: 'Rejected', color: 'text-red-400 bg-red-400/10' },
}

export const APPLICATION_STATUS_MAP: Record<ApplicationStatus, { label: string; color: string }> = {
  draft:        { label: 'Draft',        color: 'text-zinc-400 bg-zinc-400/10' },
  submitted:    { label: 'Submitted',    color: 'text-amber-400 bg-amber-400/10' },
  under_review: { label: 'Under Review', color: 'text-blue-400 bg-blue-400/10' },
  approved:     { label: 'Approved',     color: 'text-emerald-400 bg-emerald-400/10' },
  rejected:     { label: 'Rejected',     color: 'text-red-400 bg-red-400/10' },
}

export const LEAD_STATUS_MAP: Record<LeadStatus, { label: string; color: string }> = {
  new:       { label: 'New',       color: 'text-blue-400 bg-blue-400/10' },
  contacted: { label: 'Contacted', color: 'text-purple-400 bg-purple-400/10' },
  qualified: { label: 'Qualified', color: 'text-amber-400 bg-amber-400/10' },
  converted: { label: 'Converted', color: 'text-emerald-400 bg-emerald-400/10' },
  lost:      { label: 'Lost',      color: 'text-red-400 bg-red-400/10' },
}

export const TICKET_STATUS_MAP: Record<TicketStatus, { label: string; color: string }> = {
  open:        { label: 'Open',        color: 'text-amber-400 bg-amber-400/10' },
  in_progress: { label: 'In Progress', color: 'text-blue-400 bg-blue-400/10' },
  resolved:    { label: 'Resolved',    color: 'text-emerald-400 bg-emerald-400/10' },
  closed:      { label: 'Closed',      color: 'text-zinc-400 bg-zinc-400/10' },
}

export const TICKET_PRIORITY_MAP: Record<TicketPriority, { label: string; color: string }> = {
  low:    { label: 'Low',    color: 'text-zinc-400 bg-zinc-400/10' },
  medium: { label: 'Medium', color: 'text-amber-400 bg-amber-400/10' },
  high:   { label: 'High',   color: 'text-orange-400 bg-orange-400/10' },
  urgent: { label: 'Urgent', color: 'text-red-400 bg-red-400/10' },
}