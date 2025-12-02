import * as z from "zod";

export const createErrorSchema = <T extends z.ZodSchema>(schema: T) => {
  const { error } = schema.safeParse(
    schema.def.type === "array"
      ? [
          (schema as unknown as z.ZodArray).unwrap()._zod.def.type === "string"
            ? 123
            : "invalid",
        ]
      : {},
  );

  const example = {
    name: error!.name,
    issues: error!.issues.map((issue: z.core.$ZodIssue) => ({
      code: issue.code,
      path: issue.path,
      message: issue.message,
    })),
  };

  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    error: z
      .object({
        issues: z.array(
          z.object({
            code: z.string(),
            path: z.array(z.union([z.string(), z.number()])),
            message: z.string().optional(),
          }),
        ),
        name: z.string(),
      })
      .openapi({
        example,
      }),
  });
};
