import type z from "zod";
import { auth } from "@/infrastructure/better-auth/auth";
import type {
  changePasswordSchema,
  updateUserSchema,
} from "@/shared/validators/user.schema";

// Update user
export async function updateUserInformation(
  headers: Headers,
  params: z.infer<typeof updateUserSchema>,
) {
  const data = await auth.api.updateUser({
    headers,
    body: {
      ...params,
    },
  });

  return data;
}

export async function changePassword(
  headers: Headers,
  params: z.infer<typeof changePasswordSchema>,
) {
  const data = await auth.api.changePassword({
    headers,
    body: {
      ...params,
    },
  });

  return data;
}

// Delete user
export async function deleteUser(headers: Headers) {
  const data = await auth.api.deleteUser({
    headers,
    body: {
      callbackURL: "/sign-in",
    },
  });

  return data;
}
