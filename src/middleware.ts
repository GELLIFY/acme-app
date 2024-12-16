import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createI18nMiddleware } from "next-international/middleware";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "it"],
  defaultLocale: "it",
  urlMappingStrategy: "rewriteDefault",
});

const isProtectedRoute = createRouteMatcher(["/protected(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

  return I18nMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
