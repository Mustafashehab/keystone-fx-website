import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In | Keystone FX',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--kfx-bg)]">

      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--kfx-border-subtle) 1px, transparent 1px),
            linear-gradient(90deg, var(--kfx-border-subtle) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--kfx-border-subtle)]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[var(--kfx-accent)] flex items-center justify-center">
            <span className="text-white text-xs font-bold tracking-tight">K</span>
          </div>
          <span className="text-sm font-semibold text-[var(--kfx-text)] tracking-tight">
            Keystone <span className="text-[var(--kfx-accent)]">FX</span>
          </span>
        </Link>
        <p className="text-xs text-[var(--kfx-text-subtle)]">
          Secure Client Portal
        </p>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-5 border-t border-[var(--kfx-border-subtle)]">
        <p className="text-xs text-[var(--kfx-text-subtle)]">
          © {new Date().getFullYear()} Keystone FX Ltd. All rights reserved.
        </p>
      </footer>
    </div>
  )
}