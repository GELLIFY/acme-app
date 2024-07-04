import { redirect } from "next/navigation";

import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";
import federatedLogout from "~/server/auth/federated-logout";

export default async function SignoutPage() {
  const session = await auth();

  if (session) {
    return (
      <div>
        <div>Signout</div>
        <div>Are you sure you want to sign out?</div>
        <div>
          <Button
            size="lg"
            formAction={async () => {
              "use server";
              await federatedLogout();
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }
  return redirect("/api/auth/signin");
}
