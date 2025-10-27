import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Login | Acme.",
};

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen">
      {/* Main Layout */}
      <div className="flex h-full">
        <div className="relative w-full">
          <div className="relative z-10 flex h-full items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
