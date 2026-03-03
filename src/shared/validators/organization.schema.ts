import { z } from "@hono/zod-openapi";

export const listMembersSchema = z.object({
  organizationId: z.uuid().optional(),
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
  organizationId: z.uuid().optional(),
});

export const listUserInvitationsSchema = z.object({
  email: z.email(),
});
