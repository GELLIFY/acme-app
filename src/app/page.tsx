import { AuthShowcase } from "./_components/auth-showcase";
import { BasePosts } from "./_components/base-posts";

// export const runtime = "edge";

export default function HomePage() {
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-primary">T3</span> App
        </h1>
        <AuthShowcase />

        <BasePosts />
      </div>
    </main>
  );
}
