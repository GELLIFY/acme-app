"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export default function SessionGuard({ children }: { children: ReactNode }) {
  const { data } = useSession();
  useEffect(() => {
    if (data?.error === "RefreshAccessTokenError") {
      void signIn("keycloak");
    }
  }, [data]);

  return <>{children}</>;
}
