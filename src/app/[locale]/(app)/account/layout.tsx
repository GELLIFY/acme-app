export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-md mx-auto">
      <main className="mt-8">{children}</main>
    </div>
  );
}
