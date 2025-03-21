import Link from "next/link";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tighter">
            Welcome to gellify-app
          </h1>
          <p className="text-muted-foreground">
            Get started by editing{" "}
            <code className="font-mono font-bold">app/[locale]/page.tsx</code>
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild>
              <Link href="https://www.gellify.dev/docs/usage/first-steps">
                Read Documentation
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
