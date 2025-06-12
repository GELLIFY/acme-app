import { NextResponse } from "next/server";

import { checkHealth } from "@/server/services/health-service";

export async function GET(_request: Request) {
  try {
    await checkHealth();
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    return NextResponse.json({ status: "error", error });
  }
}
