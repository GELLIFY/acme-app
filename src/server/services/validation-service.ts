import type { ZodSchema } from "zod";

export const validateResponse = (data: unknown, schema: ZodSchema) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const cause = result.error.flatten();

    console.error(cause);

    return {
      success: false,
      error: "Response validation failed",
      details: cause,
      data: null,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result.data;
};
