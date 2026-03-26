'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, suffix, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="kfx-label">
            {label}
            {props.required && <span className="text-[var(--kfx-danger)] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--kfx-text-muted)]">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'kfx-input',
              prefix && 'pl-9',
              suffix && 'pr-9',
              error && 'border-[var(--kfx-danger)] focus:ring-[var(--kfx-danger)]',
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--kfx-text-muted)]">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-[var(--kfx-danger)]">{error}</p>}
        {!error && hint && <p className="mt-1.5 text-xs text-[var(--kfx-text-muted)]">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="kfx-label">
            {label}
            {props.required && <span className="text-[var(--kfx-danger)] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={cn(
            'kfx-input resize-none',
            error && 'border-[var(--kfx-danger)] focus:ring-[var(--kfx-danger)]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-[var(--kfx-danger)]">{error}</p>}
        {!error && hint && <p className="mt-1.5 text-xs text-[var(--kfx-text-muted)]">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="kfx-label">
            {label}
            {props.required && <span className="text-[var(--kfx-danger)] ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'kfx-input appearance-none cursor-pointer',
            error && 'border-[var(--kfx-danger)] focus:ring-[var(--kfx-danger)]',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs text-[var(--kfx-danger)]">{error}</p>}
        {!error && hint && <p className="mt-1.5 text-xs text-[var(--kfx-text-muted)]">{hint}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

// ─── Checkbox ─────────────────────────────────────────────────────────────────

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={cn(
            'mt-0.5 h-4 w-4 rounded border-[var(--kfx-border)] bg-[var(--kfx-surface-raised)]',
            'accent-[var(--kfx-accent)] cursor-pointer',
            'focus:ring-2 focus:ring-[var(--kfx-accent)] focus:ring-offset-[var(--kfx-bg)]',
            error && 'border-[var(--kfx-danger)]',
            className
          )}
          {...props}
        />
        {(label || description) && (
          <div>
            {label && (
              <label htmlFor={inputId} className="text-sm text-[var(--kfx-text)] cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-[var(--kfx-text-muted)] mt-0.5">{description}</p>
            )}
            {error && <p className="mt-1 text-xs text-[var(--kfx-danger)]">{error}</p>}
          </div>
        )}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

// ─── FormField wrapper ────────────────────────────────────────────────────────

export function FormField({
  label,
  required,
  error,
  hint,
  children,
}: {
  label?: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="w-full">
      {label && (
        <p className="kfx-label">
          {label}
          {required && <span className="text-[var(--kfx-danger)] ml-1">*</span>}
        </p>
      )}
      {children}
      {error && <p className="mt-1.5 text-xs text-[var(--kfx-danger)]">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-[var(--kfx-text-muted)]">{hint}</p>}
    </div>
  )
}