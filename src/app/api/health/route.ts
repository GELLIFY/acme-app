import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { checkHealth } from "@/server/services/health-service";

export async function GET(_request: Request) {
  try {
    await checkHealth(db);
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    return NextResponse.json({ status: "error", error });
  }
}
