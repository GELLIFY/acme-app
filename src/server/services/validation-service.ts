import { z } from "zod";
import { logger } from "@/lib/logger";

export const validateResponse = <T>(data: T, schema: z.ZodType) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const cause = z.flattenError(result.error);

    logger.error(cause);

    return;
    // return {
    //   success: false,
    //   error: "Response validation failed",
    //   details: cause,
    //   data: null,
    // };
  }

  return result.data as T;
};
