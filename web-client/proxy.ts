import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)"]);

// Next.js 16 named proxy export configuration
export function proxy(request: NextRequest, event: NextFetchEvent) {
  return clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  })(request, event);
}

export const config = {
  matcher: [
    // Match application routes (exclude _next, static files and api paths)
    "/((?!api|_next|.*\\..*).*)",
  ],
};
