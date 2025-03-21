import "@/globals.css";

import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/sonner";
import { I18nProviderClient } from "@/locales/client";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create GELLIFY App",
  description: "Bolierplate for GELLIFY App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const { locale } = await params;

  return (
    <ClerkProvider dynamic>
      <html lang="en" suppressHydrationWarning>
        <body className={`font-sans ${inter.variable}`}>
          <I18nProviderClient locale={locale}>
            {children}
            <Toaster />
          </I18nProviderClient>
        </body>
      </html>
    </ClerkProvider>
  );
}
