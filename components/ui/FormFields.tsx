'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type BaseFieldProps = {
  label?: string
  error?: string
  hint?: string
}

/* ================= INPUT ================= */

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  BaseFieldProps & {
    prefix?: React.ReactNode
    suffix?: React.ReactNode
  }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, prefix, suffix, ...props }, ref) => {
    const inputId = id ?? props.name ?? undefined

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-[var(--kfx-text)]"
          >
            {label}
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
              'w-full h-[46px] rounded-xl border bg-white px-3 text-sm text-[var(--kfx-text)] outline-none transition-all',
              'border-[#e2e8f0]',
              'shadow-[inset_0_1px_2px_rgba(15,23,42,0.05)]',
              'focus:border-[#94a3b8] focus:ring-4 focus:ring-[#eef2f6] focus:shadow-[0_6px_20px_rgba(15,23,42,0.08)]',
              'hover:border-[#cbd5e1]',
              prefix && 'pl-10',
              suffix && 'pr-10',
              error && 'border-red-400 focus:ring-red-100',
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

        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[var(--kfx-text-muted)]">{hint}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'

/* ================= TEXTAREA ================= */

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  BaseFieldProps

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? props.name ?? undefined

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-[var(--kfx-text)]"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full min-h-[110px] rounded-xl border bg-white px-3 py-2 text-sm text-[var(--kfx-text)] outline-none transition-all',
            'border-[#e2e8f0]',
            'shadow-[inset_0_1px_2px_rgba(15,23,42,0.05)]',
            'focus:border-[#94a3b8] focus:ring-4 focus:ring-[#eef2f6] focus:shadow-[0_6px_20px_rgba(15,23,42,0.08)]',
            'hover:border-[#cbd5e1]',
            error && 'border-red-400 focus:ring-red-100',
            className
          )}
          {...props}
        />

        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[var(--kfx-text-muted)]">{hint}</p>
        ) : null}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

/* ================= SELECT ================= */

type SelectOption = {
  label: string
  value: string
  disabled?: boolean
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> &
  BaseFieldProps & {
    options: SelectOption[]
    placeholder?: string
  }

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className, id, options, placeholder, ...props }, ref) => {
    const inputId = id ?? props.name ?? undefined

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-[var(--kfx-text)]"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-[46px] rounded-xl border bg-white px-3 text-sm text-[var(--kfx-text)] outline-none transition-all',
            'border-[#e2e8f0]',
            'shadow-[inset_0_1px_2px_rgba(15,23,42,0.05)]',
            'focus:border-[#94a3b8] focus:ring-4 focus:ring-[#eef2f6]',
            'hover:border-[#cbd5e1]',
            error && 'border-red-400 focus:ring-red-100',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[var(--kfx-text-muted)]">{hint}</p>
        ) : null}
      </div>
    )
  }
)

Select.displayName = 'Select'

/* ================= CHECKBOX ================= */

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> &
  BaseFieldProps & {
    description?: string
  }

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name ?? undefined

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="flex items-start gap-3 text-sm text-[var(--kfx-text)]"
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={cn(
              'mt-1 h-4 w-4 rounded border border-[#cbd5e1] bg-white',
              'focus:ring-2 focus:ring-[#94a3b8]',
              className
            )}
            {...props}
          />

          <span>
            {label && <span className="font-medium">{label}</span>}
            {description && (
              <span className="block text-xs text-[var(--kfx-text-muted)] mt-0.5">
                {description}
              </span>
            )}
          </span>
        </label>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'