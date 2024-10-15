import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { AuthShowcase } from "~/components/auth-showcase";
import { ErrorFallback } from "~/components/error-fallback";
import { CreatePostForm } from "./_components/create-post-form";
import { PostListLoading } from "./_components/post-list.loading";
import { PostListServer } from "./_components/post-list.server";

export default function HomePage() {
  return (
    <main className="container h-screen space-y-6 py-16">
      <header className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-primary">GELLIFY</span> App
        </h1>
        <AuthShowcase />
      </header>
      <div className="flex flex-col items-center justify-center gap-4">
        <CreatePostForm />
        <div className="w-full max-w-2xl overflow-y-scroll">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<PostListLoading />}>
              <PostListServer />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
}
