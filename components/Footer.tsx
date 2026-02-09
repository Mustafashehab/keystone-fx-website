import { Lang } from "@/lib/i18n";

export default function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="border-t bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-center text-sm text-slate-400 leading-relaxed">
          <strong>Important Notice:</strong> Keystone FX is a technology and
          infrastructure provider. We do not operate as a broker, do not accept
          or hold client funds, and do not provide regulated investment or
          advisory services. All services are provided on a non-custodial,
          professional-use basis only.
        </p>
      </div>
    </footer>
  );
}
