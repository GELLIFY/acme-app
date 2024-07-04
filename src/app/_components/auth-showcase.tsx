import { Button } from "~/components/ui/button";
import { auth, signIn } from "~/server/auth";
import federatedLogout from "~/server/auth/federated-logout";

export async function AuthShowcase() {
  const session = await auth();

  if (!session) {
    return (
      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signIn("keycloak");
          }}
        >
          Sign in with Keycloak
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {session.user.name}</span>
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await federatedLogout();
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
