import { z } from "@hono/zod-openapi";

export const updateUserSchema = z.object({
  name: z.string().min(2).max(32).optional().openapi({
    description: "Name of the user. Must be between 2 and 32 characters",
    example: "John Doe",
  }),
  image: z.url().optional().openapi({
    description: "URL to the user's avatar image",
    example: "https://cdn.badget.ai/avatars/johndoe.png",
  }),
});

export const changeEmailSchema = z.object({
  email: z.email().openapi({
    description: "Email address of the user",
    example: "john.doe@example.com",
  }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string() // check if it is string type
      .min(8, { message: "Password must be at least 8 characters long" }) // checks for character length
      .max(20, { message: "Password must be at most 20 characters long" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(20, { message: "Password must be at most 20 characters long" }),
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Passwords cannot match",
    path: ["newPassword"],
  });
