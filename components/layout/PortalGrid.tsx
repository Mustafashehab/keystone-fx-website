import { cn } from '@/lib/utils'

export function PortalGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid gap-5',
        'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  )
}