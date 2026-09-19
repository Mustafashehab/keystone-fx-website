import Link from "next/link";

export const metadata = {
  title: "Applications Paused | Keystone FX",
  robots: { index: false, follow: false },
};

export default function PortalRegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ed] px-5 py-16 text-[#0a1726]">
      <section className="w-full max-w-lg rounded-3xl border border-[#c9a84c]/30 bg-white p-8 text-center shadow-[0_28px_80px_rgba(10,23,38,0.12)] sm:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0a1726] text-xl text-[#d7bd76]">⏸</div>
        <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.3em] text-[#9b7a2e]">Temporary notice</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">New applications are paused</h1>
        <p className="mt-5 text-sm leading-7 text-[#5a6878]">
          Keystone FX is currently reviewing its public information and is not accepting new client applications at this time.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/en" className="rounded-lg bg-[#0a1726] px-5 py-3 text-sm font-semibold text-white">Return to website</Link>
          <a href="mailto:info@keystone-fx.com" className="rounded-lg border border-[#c9a84c]/45 px-5 py-3 text-sm font-semibold">Contact us</a>
        </div>
      </section>
    </main>
  );
}
