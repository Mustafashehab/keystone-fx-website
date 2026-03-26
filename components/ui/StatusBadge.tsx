import { cn } from '@/lib/utils'
import type {
  KYCStatus,
  DocumentStatus,
  ApplicationStatus,
  LeadStatus,
  TicketStatus,
  TicketPriority,
} from '@/types'
import {
  KYC_STATUS_MAP,
  DOCUMENT_STATUS_MAP,
  APPLICATION_STATUS_MAP,
  LEAD_STATUS_MAP,
  TICKET_STATUS_MAP,
  TICKET_PRIORITY_MAP,
} from '@/lib/utils'

type StatusType =
  | { type: 'kyc'; status: KYCStatus }
  | { type: 'document'; status: DocumentStatus }
  | { type: 'application'; status: ApplicationStatus }
  | { type: 'lead'; status: LeadStatus }
  | { type: 'ticket'; status: TicketStatus }
  | { type: 'priority'; status: TicketPriority }

interface StatusBadgeProps extends StatusType {
  className?: string
  showDot?: boolean
}

export function StatusBadge({
  type,
  status,
  className,
  showDot = true,
}: StatusBadgeProps) {
  const map = {
    kyc: KYC_STATUS_MAP,
    document: DOCUMENT_STATUS_MAP,
    application: APPLICATION_STATUS_MAP,
    lead: LEAD_STATUS_MAP,
    ticket: TICKET_STATUS_MAP,
    priority: TICKET_PRIORITY_MAP,
  }[type] as Record<string, { label: string; color: string }>

  const config = map[status] ?? {
    label: status,
    color: 'text-zinc-400 bg-zinc-400/10',
  }

  return (
    <span className={cn('kfx-badge', config.color, className)}>
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {config.label}
    </span>
  )
}