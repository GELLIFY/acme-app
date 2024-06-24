import { redirect } from "next/navigation";

import { env } from "~/env";
import { auth, signOut } from ".";

export default async function federatedLogout() {
  const session = await auth();
  const url = new URL(`${env.AUTH_URL}/api/auth/federated-logout`);
  const request: RequestInit = {
    method: "POST",
    body: JSON.stringify({ id_token: session?.id_token }),
  };

  const response = await fetch(url, request);
  const data = (await response.json()) as { url: string; error?: string };

  if (response.ok) {
    await signOut({ redirect: false });
    redirect(data.url);
  }

  console.error(data.error);
  await signOut({ redirect: false });
  redirect("/");
}
