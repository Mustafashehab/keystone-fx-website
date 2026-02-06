import { Lang, t } from "@/lib/i18n";

export default function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="border-t bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-center text-sm text-slate-400 leading-relaxed">
          {t(lang, "footer.disclaimer")}
        </p>
      </div>
    </footer>
  );
}