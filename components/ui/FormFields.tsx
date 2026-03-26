'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type BaseFieldProps = {
  label?: string
  error?: string
  hint?: string
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  BaseFieldProps & {
    prefix?: React.ReactNode
    suffix?: React.ReactNode
  }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, prefix, suffix, ...props }, ref) => {
    const inputId = id ?? props.name ?? undefined

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--kfx-text)]"
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
              'w-full rounded-lg border border-[var(--kfx-border)] bg-[var(--kfx-surface)] px-3 py-2 text-sm text-[var(--kfx-text)] outline-none transition',
              'focus:border-[var(--kfx-accent)] focus:ring-2 focus:ring-[var(--kfx-accent)]/20',
              prefix && 'pl-10',
              suffix && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
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

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  BaseFieldProps

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? props.name ?? undefined

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--kfx-text)]"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border border-[var(--kfx-border)] bg-[var(--kfx-surface)] px-3 py-2 text-sm text-[var(--kfx-text)] outline-none transition',
            'focus:border-[var(--kfx-accent)] focus:ring-2 focus:ring-[var(--kfx-accent)]/20',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
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
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--kfx-text)]"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border border-[var(--kfx-border)] bg-[var(--kfx-surface)] px-3 py-2 text-sm text-[var(--kfx-text)] outline-none transition',
            'focus:border-[var(--kfx-accent)] focus:ring-2 focus:ring-[var(--kfx-accent)]/20',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
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

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> &
  BaseFieldProps & {
    description?: string
  }

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name ?? undefined

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="flex items-start gap-3 text-sm text-[var(--kfx-text)]"
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={cn(
              'mt-1 h-4 w-4 rounded border-[var(--kfx-border)]',
              className
            )}
            {...props}
          />
          <span>
            {label && <span className="font-medium">{label}</span>}
            {description && (
              <span className="mt-0.5 block text-xs text-[var(--kfx-text-muted)]">
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