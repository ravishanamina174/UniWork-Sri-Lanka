import { clerkMiddleware } from "@clerk/nextjs/server";

// Next.js 16 named proxy export configuration
export function proxy(request: any, event: any) {
  return clerkMiddleware()(request, event);
}

export const config = {
  matcher: [
    // Match application routes (exclude _next, static files and api paths)
    "/((?!api|_next|.*\\..*).*)",
  ],
};
