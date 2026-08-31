import { z } from 'zod'

export const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z
  .object({
    email:           z.string().email('Invalid email address'),
    password:        z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName:       z.string().min(1, 'First name is required'),
    lastName:        z.string().min(1, 'Last name is required'),
    accountType:     z.enum(['individual', 'professional', 'institutional']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const kycSchema = z.object({
  firstName:            z.string().trim().min(1, 'Required').max(100),
  lastName:             z.string().trim().min(1, 'Required').max(100),
  dateOfBirth:          z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
  nationality:          z.string().trim().min(1, 'Required').max(100),
  countryOfResidence:   z.string().trim().min(1, 'Required').max(100),
  addressLine1:         z.string().trim().min(1, 'Required').max(250),
  addressLine2:         z.string().trim().max(250).optional(),
  city:                 z.string().trim().min(1, 'Required').max(100),
  postalCode:           z.string().trim().min(1, 'Required').max(30),
  phone:                z.string().trim().min(1, 'Required').max(40),
  employmentStatus:     z.string().trim().min(1, 'Required').max(100),
  employerName:         z.string().trim().max(150).optional(),
  annualIncomeRange:    z.string().trim().min(1, 'Required').max(100),
  sourceOfFunds:        z.string().trim().min(1, 'Required').max(500),
  tradingExperience:    z.string().trim().min(1, 'Required').max(100),
  investmentObjectives: z.array(z.string().trim().min(1).max(100)).min(1, 'Select at least one objective').max(10),
  politicallyExposed:   z.boolean(),
  pepDetails:           z.string().trim().max(1000).optional(),
  usPerson:             z.boolean(),
  taxResidency:         z.string().trim().max(100).optional(),
  taxIdNumber:          z.string().trim().max(100).optional(),
})

export const accountApplicationSchema = z.object({
  accountType:          z.enum(['individual', 'professional', 'institutional']),
  leveragePreference:   z.enum(['1:100', '1:200', '1:500']),
  baseCurrency:         z.enum(['USD', 'EUR']),
  platformPreference:   z.literal('MT5'),
  initialDepositAmount: z.number().finite().min(1, 'Must be a positive amount').max(1_000_000_000),
})

export const ticketSchema = z.object({
  subject:     z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(20, 'Please provide more detail (min 20 characters)'),
  priority:    z.enum(['low', 'medium', 'high', 'urgent']),
  category:    z.string().optional(),
})

export const ticketMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
})

export const leadSchema = z.object({
  email:     z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName:  z.string().optional(),
  phone:     z.string().optional(),
  country:   z.string().optional(),
  source:    z.string().optional(),
  notes:     z.string().optional(),
})

export type LoginFormData              = z.infer<typeof loginSchema>
export type RegisterFormData           = z.infer<typeof registerSchema>
export type KYCFormData                = z.infer<typeof kycSchema>
export type AccountApplicationFormData = z.infer<typeof accountApplicationSchema>
export type TicketFormData             = z.infer<typeof ticketSchema>
export type TicketMessageFormData      = z.infer<typeof ticketMessageSchema>
export type LeadFormData               = z.infer<typeof leadSchema>
