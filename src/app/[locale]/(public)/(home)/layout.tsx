import Navbar from "@/components/navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Navbar />

      <div>{children}</div>
    </div>
  );
}
