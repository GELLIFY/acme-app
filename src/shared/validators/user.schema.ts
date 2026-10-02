import * as z from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2).max(32).optional().meta({
    description: "Name of the user. Must be between 2 and 32 characters",
    example: "John Doe",
  }),
  image: z.url().optional().meta({
    description: "URL to the user's avatar image",
    example: "https://cdn.badget.ai/avatars/johndoe.png",
  }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string() // check if it is string type
      .min(8, { message: "Password must be at least 8 characters long" }) // checks for character length
      .max(128, { message: "Password must be at most 128 characters long" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(128, { message: "Password must be at most 128 characters long" }),
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Passwords cannot match",
    path: ["newPassword"],
  });
