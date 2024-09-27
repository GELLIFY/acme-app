import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { Toaster } from "~/components/ui/sonner";
import SessionGuard from "../components/session-guard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create GELLIFY App",
  description: "Bolierplate for GELLIFY App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <SessionProvider refetchInterval={4 * 60}>
          <SessionGuard>
            <>
              {children}
              <Toaster />
            </>
          </SessionGuard>
        </SessionProvider>
      </body>
    </html>
  );
}
