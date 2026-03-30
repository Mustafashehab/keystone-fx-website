import { cn } from '@/lib/utils'

export function PortalPage({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'w-full px-6 py-6 space-y-6 max-w-[1400px] mx-auto',
        className
      )}
    >
      {children}
    </div>
  )
}