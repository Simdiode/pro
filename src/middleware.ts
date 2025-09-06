// Edge middleware that wires Clerk into Next.js routing.
// With clerkMiddleware, you can protect routes and read auth info at the edge.
import { clerkMiddleware } from '@clerk/nextjs/server';
import { createRouteMatcher } from '@clerk/nextjs/server';

// For now we just enable Clerk without custom protection logic here,
// because the pages themselves gate access using SignedIn/SignedOut.
export default clerkMiddleware();

// Example matcher for protected routes (not used directly in this file).
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/(.*)',
]);
