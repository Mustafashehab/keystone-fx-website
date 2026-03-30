import { cn } from '@/lib/utils'

// ─── Base Table ───────────────────────────────────────────────────────────────

interface Column<T> {
  key: string
  header: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render: (row: T) => React.ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  onRowClick?: (row: T) => void
  emptyMessage?: string
  emptyDescription?: string
  loading?: boolean
  className?: string
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No records found',
  emptyDescription,
  loading = false,
  className,
}: TableProps<T>) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  if (loading) {
    return <TableSkeleton columns={columns.length} rows={5} />
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="kfx-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={alignClass[col.align ?? 'left']}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <TableEmpty message={emptyMessage} description={emptyDescription} />
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(onRowClick && 'cursor-pointer')}
              >
                {columns.map((col) => (
                  <td key={col.key} className={alignClass[col.align ?? 'left']}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function TableEmpty({
  message,
  description,
}: {
  message: string
  description?: string
}) {
  return (
    <div className="py-16 text-center">
      <div className="w-10 h-10 rounded-full bg-[var(--kfx-surface-raised)] flex items-center justify-center mx-auto mb-3">
        <svg
          className="w-5 h-5 text-[var(--kfx-text-subtle)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-[var(--kfx-text-muted)]">{message}</p>
      {description && (
        <p className="text-xs text-[var(--kfx-text-subtle)] mt-1">{description}</p>
      )}
    </div>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function TableSkeleton({ columns, rows }: { columns: number; rows: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="kfx-table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i}>
                <div className="h-3 bg-[var(--kfx-surface-raised)] rounded w-20 animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx}>
                  <div
                    className="h-4 bg-[var(--kfx-surface-raised)] rounded animate-pulse"
                    style={{
                      width: `${60 + (((rowIdx * columns + colIdx) * 17) % 30)}%`,
                      animationDelay: `${rowIdx * 50}ms`,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--kfx-border)]">
      <p className="text-xs text-[var(--kfx-text-muted)]">
        Showing{' '}
        <span className="font-medium text-[var(--kfx-text)]">
          {from}–{to}
        </span>{' '}
        of <span className="font-medium text-[var(--kfx-text)]">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="kfx-btn-ghost !px-2 !py-1.5 text-xs disabled:opacity-40"
        >
          ← Prev
        </button>
        {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
          const p = i + 1
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'w-7 h-7 rounded text-xs font-medium transition-colors',
                p === page
                  ? 'bg-[var(--kfx-accent)] text-white'
                  : 'text-[var(--kfx-text-muted)] hover:text-[var(--kfx-text)] hover:bg-[var(--kfx-surface-raised)]'
              )}
            >
              {p}
            </button>
          )
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="kfx-btn-ghost !px-2 !py-1.5 text-xs disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  )
}