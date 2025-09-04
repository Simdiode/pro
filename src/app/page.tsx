"use client";

// Home page. If signed in, it redirects using SignInEffect.
// If signed out, it shows a Sign In button that opens a modal.

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";
import SignInEffect from "./auth/pusher"; // Handles client-side redirect after sign-in

export default function Home() {
  // Render a minimal shell, Clerk will decide what to show.
    return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <SignedIn>
            {/* When signed in, decide where to go based on onboarding status */}
            <SignInEffect page="/important"/>
        </SignedIn >
        <SignedOut>
          {/* When signed out, sign-in returns to a neutral post-auth router */}
          <SignInButton mode="modal" forceRedirectUrl="/post-auth" />
        </SignedOut>
      </main>
    </div>
  );
}
