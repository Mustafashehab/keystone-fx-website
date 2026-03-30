export type UserRole          = 'client' | 'admin'
export type KYCStatus         = 'not_started' | 'pending' | 'under_review' | 'approved' | 'rejected'
export type DocumentStatus    = 'pending' | 'verified' | 'rejected'
export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
export type LeadStatus        = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
export type TicketStatus      = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority    = 'low' | 'medium' | 'high' | 'urgent'
export type AccountType       = 'individual' | 'professional' | 'institutional'
export type DocumentType      =
  | 'passport'
  | 'national_id'
  | 'drivers_license'
  | 'proof_of_address'
  | 'bank_statement'
  | 'tax_document'
  | 'corporate_document'
  | 'other'

// Financial entity status types — typed strictly so 'string' is never used for financial state
export type WithdrawalStatus      = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type DepositStatus         = 'detected' | 'swept'
export type SweepStatus           = 'pending' | 'confirmed' | 'failed'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface ClientProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  phone: string | null
  nationality: string | null
  date_of_birth: string | null
  country_of_residence: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  postal_code: string | null
  account_type: AccountType
  kyc_status: KYCStatus
  onboarding_step: number
  created_at: string
  updated_at: string
}

export interface KYCSubmission {
  id: string
  client_id: string
  status: KYCStatus
  submitted_at: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  rejection_reason: string | null
  source_of_funds: string | null
  employment_status: string | null
  employer_name: string | null
  annual_income_range: string | null
  trading_experience: string | null
  investment_objectives: string[]
  politically_exposed: boolean
  pep_details: string | null
  us_person: boolean
  tax_residency: string | null
  tax_id_number: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  client_id: string
  type: DocumentType
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  status: DocumentStatus
  uploaded_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  rejection_reason: string | null
}

export interface AccountApplication {
  id: string
  client_id: string
  account_type: AccountType
  leverage_preference: string | null
  base_currency: string | null
  platform_preference: string | null
  initial_deposit_amount: number | null
  status: ApplicationStatus
  submitted_at: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  country: string | null
  source: string | null
  status: LeadStatus
  assigned_to: string | null
  notes: string | null
  converted_client_id: string | null
  created_at: string
  updated_at: string
}

export interface InternalNote {
  id: string
  client_id: string
  author_id: string
  content: string
  created_at: string
}

export interface Ticket {
  id: string
  client_id: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
}

export interface TicketMessage {
  id: string
  ticket_id: string
  sender_id: string
  sender_role: UserRole
  content: string
  created_at: string
}

// ─── Financial Entities ────────────────────────────────────────────────────────

export interface WithdrawalRequest {
  id: string
  client_id: string
  amount: number
  wallet_address: string
  mt5_account: string | null
  status: WithdrawalStatus
  rejection_reason: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

// Used in admin views where client name is joined
export interface WithdrawalRequestWithClient extends WithdrawalRequest {
  client_profiles: {
    first_name: string
    last_name: string
  } | null
}

export interface DepositTransaction {
  id: string
  client_id: string
  wallet_id: string
  tx_hash: string
  amount: number
  status: DepositStatus
  swept_at: string | null
  sweep_tx_hash: string | null
  created_at: string
}

export interface ClientWallet {
  id: string
  client_id: string
  tron_address: string
  encrypted_private_key: string
  usdt_balance: number
  total_deposited: number
  sweep_locked: boolean
  last_checked_at: string | null
  created_at: string
  updated_at: string
}

// ─── Shared Response Wrappers ──────────────────────────────────────────────────

export interface ApiResponse<T = void> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
}

// ─── Composite / View Types ────────────────────────────────────────────────────

export interface ClientSummary {
  id: string
  user_id: string
  email: string
  full_name: string
  account_type: AccountType
  kyc_status: KYCStatus
  onboarding_step: number
  created_at: string
}

export interface ClientWithProfile {
  user: User
  profile: ClientProfile
}

export interface TicketWithMessages extends Ticket {
  messages: TicketMessage[]
  client_name?: string
}

export interface KYCWithClient extends KYCSubmission {
  client: ClientProfile
  email: string
}

export interface SelectOption {
  label: string
  value: string
}