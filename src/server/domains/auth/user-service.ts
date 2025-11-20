import type z from "zod";
import { auth } from "@/shared/helpers/better-auth/auth";
import type {
  changeEmailSchema,
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

export async function changeEmail(
  headers: Headers,
  params: z.infer<typeof changeEmailSchema>,
) {
  // Change email if needed
  const data = await auth.api.changeEmail({
    headers,
    body: {
      newEmail: params.email,
    },
  });

  return data;
}

export async function changePassword(
  headers: Headers,
  params: z.infer<typeof changePasswordSchema>,
) {
  // Change email if needed
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
