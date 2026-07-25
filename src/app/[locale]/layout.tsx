import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppFooter } from "@/features/common/components/layout/AppFooter";
import { AppHeader } from "@/features/common/components/layout/AppHeader";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";

type Params = Promise<{ locale: string }>;

export const generateStaticParams = (): { locale: string }[] =>
  routing.locales.map((locale) => ({ locale }));

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("title"), description: t("description") };
};

const RootLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>): Promise<React.JSX.Element> => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <NextIntlClientProvider>
          <AppHeader />
          <main className="flex-1">{children}</main>
          <AppFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
