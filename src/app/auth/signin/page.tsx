import { redirect } from "next/navigation";

import { Button } from "~/components/ui/button";
import { auth, signIn } from "~/server/auth";

const signinErrors: Record<string, string> = {
  // ...
};

interface SignInPageProp {
  params: object;
  searchParams: {
    callbackUrl: string;
    error: string;
  };
}

export default async function Signin({
  searchParams: { callbackUrl, error },
}: SignInPageProp) {
  const session = await auth();

  if (session) {
    redirect(callbackUrl || "/");
  }

  return (
    <div>
      {error && <div>{signinErrors[error.toLowerCase()]}</div>}
      <Button
        size="lg"
        formAction={async () => {
          "use server";
          await signIn("keycloak");
        }}
      >
        Sign in with Keycloak
      </Button>
    </div>
  );
}
