import { clerkMiddleware } from '@clerk/nextjs/server';
import { createRouteMatcher } from '@clerk/nextjs/server';
export default clerkMiddleware();

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/(.*)',
]);