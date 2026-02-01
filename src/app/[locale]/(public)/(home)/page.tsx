"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/shared/infrastructure/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";

export default function Home() {
  const t = useScopedI18n("home");

  const trpc = useTRPC();
  const trpcHealthCheck = useQuery(trpc.health.queryOptions());

  const restHealthQuery = useQuery({
    queryKey: ["rest-health"],
    queryFn: async () => {
      const res = await fetch("/api/rest/health");
      return (await res.json()) as { status: "ok" | "error" };
    },
  });

  const routeHealthQuery = useQuery({
    queryKey: ["route-health"],
    queryFn: async () => {
      const res = await fetch("/api/health");
      return (await res.json()) as { status: "ok" | "error" };
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-65px)] flex-col">
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-4 md:p-8 lg:p-12">
        <h1 className="text-4xl font-bold tracking-tighter">
          {t("welcome", { name: "coder" })}
        </h1>
        <section className="w-xs rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${trpcHealthCheck.data ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-sm text-muted-foreground">
                tRPC{" "}
                {trpcHealthCheck.isLoading
                  ? "Checking..."
                  : trpcHealthCheck.data
                    ? "Connected"
                    : "Disconnected"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${restHealthQuery.data ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-sm text-muted-foreground">
                REST{" "}
                {restHealthQuery.isLoading
                  ? "Checking..."
                  : restHealthQuery.data
                    ? "Connected"
                    : "Disconnected"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${routeHealthQuery.data ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-sm text-muted-foreground">
                Route handlers{" "}
                {routeHealthQuery.isLoading
                  ? "Checking..."
                  : routeHealthQuery.data
                    ? "Connected"
                    : "Disconnected"}
              </span>
            </div>
          </div>
        </section>
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              render={
                <Link href="https://www.gellify.dev/docs/usage/first-steps">
                  {t("doc")}
                </Link>
              }
            ></Button>
            <Button
              variant="outline"
              render={
                <Link
                  href="https://github.com/GELLIFY/acme-app"
                  className="flex items-center gap-2"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>GitHub</title>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  GitHub
                </Link>
              }
            ></Button>
          </div>
        </div>
      </main>
      <footer className="py-6 md:py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GELLIFY. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
