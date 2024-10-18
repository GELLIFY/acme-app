import { NextResponse } from "next/server";

import { auth } from "./server/auth";

export default auth((request) => {
  const session = request.auth;

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  // If you only want to secure certain pages
  matcher: ["/protected"],
};
