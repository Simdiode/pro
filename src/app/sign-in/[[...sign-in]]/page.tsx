"use client";

// Custom Sign In page with a skeleton while Clerk loads.
import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import React from "react";

export default function SignInPage() {
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <ClerkLoading>
        <AuthSkeleton />
      </ClerkLoading>
      <ClerkLoaded>
        <SignIn
          routing="path"
          path="/sign-in"
          afterSignInUrl="/post-auth"
          signUpUrl="/sign-up"
        />
      </ClerkLoaded>
    </div>
  );
}

function AuthSkeleton() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-neutral-800/40 bg-neutral-900/40 backdrop-blur-md p-6 shadow-lg">
      <div className="animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-neutral-700" />
          <div className="flex-1">
            <div className="h-3 w-32 bg-neutral-700 rounded mb-2" />
            <div className="h-3 w-20 bg-neutral-800 rounded" />
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="h-10 w-full rounded-md bg-neutral-800" />
          <div className="h-10 w-full rounded-md bg-neutral-800" />
        </div>
        <div className="space-y-2">
          <div className="h-10 w-full rounded-md bg-neutral-700" />
          <div className="h-10 w-full rounded-md bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

