import Link from "next/link";

const services = [
  {
    eyebrow: "01",
    title: "Software Solutions",
    text: "Purpose-built digital tools that support clear, reliable professional workflows.",
    icon: "processor",
  },
  {
    eyebrow: "02",
    title: "Platform Connectivity",
    text: "Practical integration support across professional desktop, web, and mobile environments.",
    icon: "network",
  },
  {
    eyebrow: "03",
    title: "Technical Support",
    text: "Responsive configuration, maintenance, and operational assistance for business users.",
    icon: "support",
  },
];

const workflow = [
  ["Discover", "Understand the operating requirement."],
  ["Configure", "Shape the appropriate technical setup."],
  ["Integrate", "Connect approved tools and workflows."],
  ["Support", "Maintain continuity after delivery."],
];

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${small ? "h-9 w-8" : "h-20 w-[4.5rem]"}`}
      aria-hidden="true"
    >
      <span className="absolute inset-x-[12%] bottom-0 top-[11%] [clip-path:polygon(50%_100%,7%_70%,7%_12%,50%_0,93%_12%,93%_70%)] bg-gradient-to-b from-slate-200 via-white to-slate-400 p-[2px] shadow-[0_10px_28px_rgba(0,0,0,0.28)]">
        <span className="block h-full w-full [clip-path:inherit] bg-gradient-to-br from-[#15263b] via-[#f7f3ea] to-[#718197]" />
      </span>
      <span className="absolute left-1/2 top-0 h-[28%] w-[46%] -translate-x-1/2 [clip-path:polygon(15%_0,85%_0,100%_28%,67%_100%,33%_100%,0_28%)] bg-gradient-to-b from-[#f7d77f] via-[#c9a84c] to-[#8b6a21] shadow-[0_3px_10px_rgba(201,168,76,0.42)]" />
    </span>
  );
}

function ServiceIcon({ type }: { type: string }) {
  if (type === "network") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="24" r="5" /><circle cx="36" cy="12" r="5" /><circle cx="36" cy="36" r="5" />
        <path d="M16.5 21.8 31.5 14.2M16.5 26.2l15 7.6" />
      </svg>
    );
  }
  if (type === "support") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 25v-2a15 15 0 0 1 30 0v2M9 25h5v12H9a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3ZM39 25h-5v12h5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3ZM34 38c-2 4-5 5-10 5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="13" y="13" width="22" height="22" rx="3" /><path d="M18 18h12v12H18zM19 7v6M29 7v6M19 35v6M29 35v6M7 19h6M7 29h6M35 19h6M35 29h6" />
    </svg>
  );
}

function InfrastructureVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[610px]" aria-hidden="true">
      <div className="absolute inset-[7%] rounded-full border border-[#c9a84c]/25 bg-[radial-gradient(circle_at_42%_38%,rgba(142,166,193,0.22),transparent_34%),radial-gradient(circle_at_60%_58%,rgba(201,168,76,0.14),transparent_47%),linear-gradient(145deg,rgba(17,36,57,0.96),rgba(5,13,24,0.2))] shadow-[inset_-35px_-25px_70px_rgba(0,0,0,0.7),0_0_80px_rgba(82,119,155,0.13)]" />
      <div className="absolute inset-[16%] rounded-full border border-white/[0.06]" />
      <div className="absolute left-[17%] top-[26%] h-[48%] w-[66%] rotate-[-12deg] rounded-[50%] border border-[#c9a84c]/30" />
      <div className="absolute left-[23%] top-[19%] h-[62%] w-[54%] rotate-[20deg] rounded-[50%] border border-[#8ea6c1]/20" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 600" fill="none">
        <path d="M45 352C154 288 188 151 310 145c102-5 134 107 247 67" stroke="url(#lineA)" strokeWidth="1.5" />
        <path d="M61 205c94 9 129 191 268 188 90-2 113-105 206-125" stroke="url(#lineB)" strokeWidth="1.2" />
        <path d="M128 470c58-123 164-113 207-220 24-61 102-70 167-67" stroke="#C9A84C" strokeOpacity=".36" />
        <defs>
          <linearGradient id="lineA" x1="45" y1="352" x2="557" y2="212"><stop stopColor="#8EA6C1" stopOpacity="0"/><stop offset=".45" stopColor="#E9D395"/><stop offset="1" stopColor="#C9A84C" stopOpacity="0"/></linearGradient>
          <linearGradient id="lineB" x1="61" y1="205" x2="535" y2="268"><stop stopColor="#C9A84C" stopOpacity="0"/><stop offset=".5" stopColor="#C9A84C"/><stop offset="1" stopColor="#8EA6C1" stopOpacity="0"/></linearGradient>
        </defs>
      </svg>
      {[[18,34],[30,20],[50,24],[72,29],[82,44],[69,63],[47,68],[28,66]].map(([x,y], index) => (
        <span key={index} className="absolute h-2 w-2 rounded-full bg-[#e8ce88] shadow-[0_0_18px_5px_rgba(201,168,76,0.36)]" style={{ left: `${x}%`, top: `${y}%` }} />
      ))}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[32px] border border-white/10 bg-[#0a1726]/75 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <BrandMark />
      </div>
      <p className="absolute right-[2%] top-[42%] max-w-[110px] text-[10px] font-semibold uppercase leading-5 tracking-[0.34em] text-white/[0.55]">
        Technology connecting professional workflows
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f3ec] text-[#081426]">
      <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#07111f]/75 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/en" className="flex items-center gap-3" aria-label="Keystone FX home">
            <BrandMark small />
            <span className="text-[17px] font-semibold tracking-[0.08em]">KEYSTONE <span className="text-[#d3b66a]">FX</span></span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-white/[0.72] lg:flex">
            <a href="#solutions" className="transition hover:text-white">Solutions</a>
            <a href="#infrastructure" className="transition hover:text-white">Infrastructure</a>
            <a href="#platforms" className="transition hover:text-white">Platforms</a>
            <a href="#company" className="transition hover:text-white">Company</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/portal/login" className="hidden rounded-lg border border-[#c9a84c]/55 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.06] sm:inline-flex">
              Client Login
            </Link>
            <a href="mailto:info@keystone-fx.com" className="rounded-lg bg-gradient-to-b from-[#ead38a] to-[#c9a84c] px-4 py-2.5 text-xs font-bold text-[#07111f] shadow-[0_6px_20px_rgba(201,168,76,0.2)] transition hover:brightness-105">
              Contact Us
            </a>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-[760px] items-center overflow-hidden bg-[#07111f] pb-20 pt-32 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(66,101,135,0.25),transparent_34%),radial-gradient(circle_at_8%_62%,rgba(201,168,76,0.08),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="max-w-2xl py-8">
            <p className="mb-7 text-[11px] font-semibold uppercase tracking-[0.38em] text-[#d7bd76]">Digital technology &amp; infrastructure</p>
            <h1 className="text-[clamp(3rem,6vw,5.8rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
              Technology built for <span className="text-[#d6b968]">modern workflows.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#c5d0dc] sm:text-lg">
              Secure software, platform connectivity, and responsive technical support designed for professional business environments.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#solutions" className="inline-flex items-center gap-3 rounded-lg bg-gradient-to-b from-[#ead38a] to-[#c9a84c] px-6 py-3.5 text-sm font-bold text-[#07111f] shadow-[0_10px_30px_rgba(201,168,76,0.2)]">
                Explore Solutions <span aria-hidden="true">→</span>
              </a>
              <a href="#company" className="rounded-lg border border-white/20 bg-white/[0.025] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.06]">Company Overview</a>
            </div>
            <div className="mt-10 flex items-center gap-3 text-xs leading-5 text-white/50">
              <span className="h-2 w-2 rounded-full bg-[#d5b75f] shadow-[0_0_12px_rgba(201,168,76,.7)]" />
              Public information is being reviewed and updated for accuracy.
            </div>
          </div>
          <InfrastructureVisual />
        </div>
      </section>

      <section className="border-b border-[#0a1c31]/10 bg-[#f6f3ec]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#0a1c31]/10 px-5 sm:px-8 md:grid-cols-4">
          {["Digital solutions", "Platform support", "Secure workflows", "Professional service"].map((item) => (
            <div key={item} className="flex min-h-[82px] items-center justify-center gap-3 px-4 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-[#21344a] sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />{item}
            </div>
          ))}
        </div>
      </section>

      <section id="solutions" className="scroll-mt-20 bg-[#fbfaf7] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#9b7a2e]">What we provide</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#081426] sm:text-5xl">Technology that supports the way you work.</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="group relative overflow-hidden rounded-2xl border border-[#0c1c2f]/10 bg-white p-7 shadow-[0_15px_55px_rgba(20,31,45,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_65px_rgba(20,31,45,0.1)]">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1eee6] text-[#0e2238]"><ServiceIcon type={service.icon} /></span>
                  <span className="text-xs font-semibold tracking-[0.2em] text-[#a38b55]">{service.eyebrow}</span>
                </div>
                <h3 className="mt-8 text-xl font-semibold text-[#0a1b31]">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#526173]">{service.text}</p>
                <div className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#c9a84c] to-[#e7d08b] transition duration-300 group-hover:scale-x-100" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="infrastructure" className="scroll-mt-20 bg-[#091625] py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#d2b66b]">A clear delivery process</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">How Keystone works</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/[0.58]">A straightforward technology process—from understanding the requirement to long-term technical support.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {workflow.map(([title, text], index) => (
                <div key={title} className="relative rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                  <span className="text-xs font-semibold text-[#d3b669]">0{index + 1}</span>
                  <h3 className="mt-8 font-semibold">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-white/[0.52]">{text}</p>
                  {index < workflow.length - 1 && <span className="absolute -right-2 top-1/2 z-10 hidden text-[#d0b15d] xl:block">›</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="platforms" className="scroll-mt-20 bg-[#f6f3ec] py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div className="relative mx-auto flex min-h-[360px] w-full max-w-[580px] items-end justify-center">
            <div className="absolute inset-x-[8%] bottom-5 top-[4%] rounded-2xl border-[10px] border-[#101b29] bg-[#081421] p-4 shadow-[0_35px_65px_rgba(8,20,33,.24)]">
              <div className="h-full rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(201,168,76,.06),transparent_46%),repeating-linear-gradient(0deg,transparent,transparent_38px,rgba(255,255,255,.045)_39px),repeating-linear-gradient(90deg,transparent,transparent_58px,rgba(255,255,255,.04)_59px)] p-7">
                <div className="flex h-full items-end gap-2">
                  {[42,58,35,72,54,82,66,91,76].map((height, index) => <span key={index} className="w-full rounded-t-sm bg-gradient-to-t from-[#48657f] to-[#d0b66c] opacity-80" style={{ height: `${height}%` }} />)}
                </div>
              </div>
            </div>
            <div className="relative ml-auto h-[220px] w-[138px] rounded-[24px] border-[8px] border-[#172334] bg-[#0a1726] p-3 shadow-[0_22px_45px_rgba(0,0,0,.3)]">
              <div className="h-full rounded-xl bg-[radial-gradient(circle_at_top,rgba(201,168,76,.12),transparent_50%)] pt-10 text-center text-[8px] uppercase tracking-[0.2em] text-white/50">Connected workflow</div>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#9b7a2e]">Platform connectivity</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#081426] sm:text-5xl">Professional tools, connected with care.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#526173]">We support approved third-party platform integrations and related technical workflows across desktop, web, and mobile environments.</p>
            <ul className="mt-8 grid gap-4 text-sm text-[#23364c] sm:grid-cols-2">
              {["Configuration support", "Multi-device workflows", "Integration assistance", "Ongoing maintenance"].map((item) => <li key={item} className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0c1e32] text-xs text-[#e1c878]">✓</span>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="company" className="scroll-mt-20 border-y border-[#c9a84c]/15 bg-[#0a1726] py-20 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-9 px-5 sm:px-8 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#d3b66a]">Keystone FX Ltd.</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">Software and technical support for professional operations.</h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/[0.58]">Our public information is currently being reviewed to ensure it accurately describes the company’s present services and status.</p>
          </div>
          <a href="mailto:info@keystone-fx.com" className="shrink-0 rounded-lg bg-gradient-to-b from-[#ead38a] to-[#c9a84c] px-7 py-4 text-sm font-bold text-[#07111f]">Contact Keystone FX</a>
        </div>
      </section>

      <footer className="bg-[#06101c] py-10 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-7 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3"><BrandMark small /><span className="font-semibold tracking-[0.08em]">KEYSTONE <span className="text-[#d3b66a]">FX</span></span></div>
            <a href="mailto:info@keystone-fx.com" className="text-sm text-white/[0.65] transition hover:text-white">info@keystone-fx.com</a>
          </div>
          <p className="mt-7 max-w-5xl text-xs leading-6 text-white/[0.42]">
            Keystone FX Ltd. currently presents itself as a provider of software solutions and technical support. It does not claim authorization by any financial regulator; it does not offer investment advice or regulated financial services; and it does not accept or hold client funds. References to third-party platforms describe technical compatibility only and do not imply endorsement, authorization, or regulatory status.
          </p>
          <p className="mt-6 text-xs text-white/[0.28]">© 2026 Keystone FX Ltd. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
