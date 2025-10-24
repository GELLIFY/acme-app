import type z from "zod";
import { auth } from "@/shared/helpers/better-auth/auth";
import type { updateUserSchema } from "@/shared/validators/user.schema";

export async function updateUser(
  headers: Headers,
  params: z.infer<typeof updateUserSchema>,
) {
  const { email, ...userData } = params;

  // Update user data
  const data = await auth.api.updateUser({
    body: {
      ...userData,
    },
    // This endpoint requires session cookies.
    headers,
  });

  // Change email if needed
  if (email) {
    await auth.api.changeEmail({
      body: {
        newEmail: email,
        callbackURL: "/dashboard",
      },
      // This endpoint requires session cookies.
      headers,
    });
  }

  return data;
}

export async function deleteUser(headers: Headers) {
  // Delete user
  const data = await auth.api.deleteUser({
    body: {
      callbackURL: "/sign-in",
    },
    // This endpoint requires session cookies.
    headers,
  });

  return data;
}
