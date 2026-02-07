import { Lang } from "@/lib/i18n";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <NavBar />
      {children}
      <Footer lang={lang as Lang} />
    </>
  );
}