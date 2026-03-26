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
  firstName:            z.string().min(1, 'Required'),
  lastName:             z.string().min(1, 'Required'),
  dateOfBirth:          z.string().min(1, 'Required'),
  nationality:          z.string().min(1, 'Required'),
  countryOfResidence:   z.string().min(1, 'Required'),
  addressLine1:         z.string().min(1, 'Required'),
  addressLine2:         z.string().optional(),
  city:                 z.string().min(1, 'Required'),
  postalCode:           z.string().min(1, 'Required'),
  phone:                z.string().min(1, 'Required'),
  employmentStatus:     z.string().min(1, 'Required'),
  employerName:         z.string().optional(),
  annualIncomeRange:    z.string().min(1, 'Required'),
  sourceOfFunds:        z.string().min(1, 'Required'),
  tradingExperience:    z.string().min(1, 'Required'),
  investmentObjectives: z.array(z.string()).min(1, 'Select at least one objective'),
  politicallyExposed:   z.boolean(),
  pepDetails:           z.string().optional(),
  usPerson:             z.boolean(),
  taxResidency:         z.string().min(1, 'Required'),
  taxIdNumber:          z.string().optional(),
})

export const accountApplicationSchema = z.object({
  accountType:          z.enum(['individual', 'professional', 'institutional']),
  leveragePreference:   z.string().min(1, 'Required'),
  baseCurrency:         z.string().min(1, 'Required'),
  platformPreference:   z.string().min(1, 'Required'),
  initialDepositAmount: z.number().positive('Must be a positive amount'),
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

export type LoginFormData               = z.infer<typeof loginSchema>
export type RegisterFormData            = z.infer<typeof registerSchema>
export type KYCFormData                 = z.infer<typeof kycSchema>
export type AccountApplicationFormData  = z.infer<typeof accountApplicationSchema>
export type TicketFormData              = z.infer<typeof ticketSchema>
export type TicketMessageFormData       = z.infer<typeof ticketMessageSchema>
export type LeadFormData                = z.infer<typeof leadSchema>