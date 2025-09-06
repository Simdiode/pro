"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Completed() {
  return (
    <div className="min-h-[60vh] flex items-start justify-center p-6">
      <div className="w-full max-w-md">
        <SignedIn>
          <div className="space-y-6 text-center">
            <h1 className="text-2xl font-bold">All set! 🎉</h1>
            <p className="text-sm text-gray-500">
              Thanks for sharing your preferences. You’re good to go.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/listings"
                className="bg-[#6c47ff] text-white rounded-md px-4 py-2"
              >
                See listings
              </Link>
            </div>
          </div>
        </SignedIn>
        <SignedOut>
          <div className="space-y-3">
            <p className="text-sm">You must be signed in to view this page.</p>
            <SignInButton mode="modal" forceRedirectUrl="/completed" />
          </div>
        </SignedOut>
      </div>
    </div>
  );
}

