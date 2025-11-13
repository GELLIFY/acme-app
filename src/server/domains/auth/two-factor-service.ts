import type z from "zod";
import { auth } from "@/shared/helpers/better-auth/auth";
import type {
  twoFactorSchema,
  verifyToptSchema,
} from "@/shared/validators/user.schema";

export async function enableTwoFactor(
  headers: Headers,
  params: z.infer<typeof twoFactorSchema>,
) {
  const data = await auth.api.enableTwoFactor({
    headers,
    body: {
      password: params.password, // required
      issuer: "acme-name",
    },
  });

  return data;
}

export async function disableTwoFactor(
  headers: Headers,
  params: z.infer<typeof twoFactorSchema>,
) {
  const data = await auth.api.disableTwoFactor({
    headers,
    body: {
      password: params.password, // required
    },
  });

  return data;
}

export async function verifyTopt(
  headers: Headers,
  params: z.infer<typeof verifyToptSchema>,
) {
  const data = await auth.api.verifyTOTP({
    headers,
    body: {
      code: params.code, // required
      trustDevice: params.trustDevice,
    },
  });

  return data;
}
