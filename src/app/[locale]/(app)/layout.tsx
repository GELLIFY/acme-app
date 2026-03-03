import Navbar from "@/components/navbar-components/navbar";
import { getCachedSession } from "@/libs/better-auth/get-cached-session";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCachedSession();

  return (
    <div>
      <Navbar user={session?.user} />
      {children}
    </div>
  );
}
