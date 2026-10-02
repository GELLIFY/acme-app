import * as z from "zod";

export const twoFactorSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }) // checks for character length
    .max(128, { message: "Password must be at most 128 characters long" }),
});

export const verifyTotpSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
  trustDevice: z.boolean(),
});
