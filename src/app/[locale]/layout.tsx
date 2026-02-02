import "@/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ImpersonationIndicator } from "@/components/auth/admin/impersonation-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { WebVitals } from "@/components/web-vitals";
import { TRPCReactProvider } from "@/shared/infrastructure/trpc/client";
import { I18nProviderClient } from "@/shared/locales/client";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create GELLIFY App",
  description: "Bolierplate for GELLIFY App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) {
  const { locale } = await params;

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TRPCReactProvider>
          <I18nProviderClient locale={locale}>
            <NuqsAdapter>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster />
                <ImpersonationIndicator />

                {/* Track web vitals only in remote environments */}
                {process.env.NODE_ENV === "production" && <WebVitals />}
              </ThemeProvider>
            </NuqsAdapter>
          </I18nProviderClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
