import { NextResponse } from "next/server";
import { serverLogger } from "@/libs/logger/pino-logger";
import { db } from "@/server/db";
import { checkHealth } from "@/server/services/health-service";

export async function GET(_request: Request) {
  try {
    await checkHealth(db);
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    serverLogger.error("Health check failed", error as Error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
