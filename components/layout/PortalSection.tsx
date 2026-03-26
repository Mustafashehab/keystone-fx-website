import { cn } from '@/lib/utils'

export function PortalSection({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'kfx-panel p-5 kfx-hover-lift',
        className
      )}
    >
      {children}
    </section>
  )
}