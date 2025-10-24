export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-md py-6">
      <main className="mt-8">{children}</main>
    </div>
  );
}
