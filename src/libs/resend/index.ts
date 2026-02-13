import { instrumentResend } from "@kubiks/otel-resend";
import { Resend } from "resend";
import { env } from "@/env";

export const resend = instrumentResend(
  new Resend(env.RESEND_API_KEY || "re_123"),
);
