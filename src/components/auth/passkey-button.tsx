"use client";

import { FingerprintIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/libs/better-auth/auth-client";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function PasskeyButton() {
  const router = useRouter();
  const { refetch } = authClient.useSession();
  const lastMethod = authClient.getLastUsedLoginMethod();

  useEffect(() => {
    let isActive = true;

    const maybeSignIn = async () => {
      if (typeof PublicKeyCredential === "undefined") return;
      if (
        typeof PublicKeyCredential.isConditionalMediationAvailable !==
        "function"
      ) {
        return;
      }

      const supported =
        await PublicKeyCredential.isConditionalMediationAvailable();
      if (!supported || !isActive) return;

      authClient.signIn.passkey(
        { autoFill: true },
        {
          onSuccess() {
            refetch();
            router.push("/");
          },
        },
      );
    };

    void maybeSignIn();

    return () => {
      isActive = false;
    };
  }, [router, refetch]);

  return (
    <Button
      variant="outline"
      className="w-full relative"
      onClick={() =>
        authClient.signIn.passkey(undefined, {
          onSuccess() {
            refetch();
            router.push("/");
          },
        })
      }
    >
      <FingerprintIcon />
      Use Passkey
      {lastMethod === "passkey" && (
        <Badge className="absolute right-2">Last</Badge>
      )}
    </Button>
  );
}
