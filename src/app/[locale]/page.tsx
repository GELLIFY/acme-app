"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/shared/helpers/trpc/client";
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
            <Button asChild>
              <Link href="https://www.gellify.dev/docs/usage/first-steps">
                {t("doc")}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href="https://github.com/GELLIFY/acme-app"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                GitHub
              </Link>
            </Button>
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
