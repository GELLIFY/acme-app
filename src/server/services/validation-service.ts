import { z } from "zod/v4";

export const validateResponse = <T>(data: T, schema: z.ZodType) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const cause = z.flattenError(result.error);

    console.error(cause);

    return {
      success: false,
      error: "Response validation failed",
      details: cause,
      data: null,
    };
  }

  return result.data as T;
};
