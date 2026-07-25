import type { Metadata } from "next";
import { AppFooter } from "@/features/common/components/layout/AppFooter";
import { AppHeader } from "@/features/common/components/layout/AppHeader";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Tsugumi — 金継ぎデザインと工房をつなぐ",
  description:
    "壊れた品の物語から、金継ぎデザイン案・工房・概算費用・完成までの期間を提案します。",
};

const RootLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element => (
  <html lang="ja" className="h-full">
    <body className="flex min-h-full flex-col antialiased">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </body>
  </html>
);

export default RootLayout;
