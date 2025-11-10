import { z } from "@hono/zod-openapi";

export const getUserByIdSchema = z.object({
  id: z.guid().openapi({
    description: "Unique identifier of the user to retrieve",
    example: "550e8400-e29b-41d4-a716-446655440000",
  }),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(32).optional().openapi({
    description: "Name of the user. Must be between 2 and 32 characters",
    example: "John Doe",
  }),
  image: z.url().optional().openapi({
    description: "URL to the user's avatar image",
    example: "https://cdn.badget.ai/avatars/johndoe.png",
  }),
  email: z.email().optional().openapi({
    description: "Email address of the user",
    example: "john.doe@example.com",
  }),
});

export const getUserSchema = z.object({
  id: z.guid().openapi({
    description: "Unique identifier of the user",
    example: "550e8400-e29b-41d4-a716-446655440000",
  }),
  name: z.string().min(2).max(32).openapi({
    description: "Name of the user. Must be between 2 and 32 characters",
    example: "John Doe",
  }),
  email: z.email().openapi({
    description: "Email address of the user",
    example: "john.doe@example.com",
  }),
  emailVerified: z.boolean().openapi({
    description: "Indicates if the user's email has been verified",
    example: true,
  }),
  createdAt: z.string().openapi({
    description: "Timestamp when the user was created",
    example: "2023-10-05T14:48:00.000Z",
  }),
});

export type UserSchema = z.infer<typeof getUserSchema>;
