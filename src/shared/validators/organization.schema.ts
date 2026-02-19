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

export const listMembersSchema = z.object({
  organizationId: z.uuid(),
  limit: z.number().optional(),
  offset: z.number().optional(),
  sortBy: z.string().optional().openapi({
    description: "Field to sort by",
    example: "createdAt",
  }),
  sortDirection: z.enum(["asc", "desc"]).optional().openapi({
    description: "Direction to sort by",
    example: "desc",
  }),
  filterField: z.string().optional().openapi({
    description: "Field to filter by",
    example: "createdAt",
  }),
  filterOperator: z
    .enum(["eq", "ne", "gt", "gte", "lt", "lte", "contains"])
    .optional()
    .openapi({
      description: "Operator to filter by",
      example: "eq",
    }),
  filterValue: z.string().optional().openapi({
    description: "Value to filter by",
    example: "value",
  }),
});

export const listInvitationsSchema = z.object({
  organizationId: z.uuid(),
});

export const listUserInvitationsSchema = z.object({
  email: z.email(),
});
