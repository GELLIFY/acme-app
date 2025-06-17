import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createI18nMiddleware } from "next-international/middleware";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "it"],
  defaultLocale: "it",
  urlMappingStrategy: "rewriteDefault",
});

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

  // avoid i18n middleware in /api routes
  if (req.nextUrl.pathname.startsWith("/api")) return NextResponse.next();

  return I18nMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
