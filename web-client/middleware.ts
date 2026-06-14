// ...existing code...
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Match application routes (exclude _next, static files and api paths)
    "/((?!api|_next|.*\\..*).*)",
  ],
};
// ...existing code...