import { z } from "@hono/zod-openapi";

export const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(32).optional().openapi({
    description:
      "Name of the organization. Must be between 2 and 32 characters",
    example: "John Doe",
  }),
  logo: z.url().optional().openapi({
    description: "URL to the organization's logo image",
    example: "https://cdn.badget.ai/avatars/johndoe.png",
  }),
});
