"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Listings() {
  return (
    <div className="min-h-[60vh] flex items-start justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        <SignedIn>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Listings</h1>
            <p className="text-sm text-gray-500">Browse places that match your preferences.</p>
            <div className="border rounded-md p-6 text-sm text-gray-500">
              Listings page placeholder — wire up data here later.
            </div>
            <div>
              <Link href="/important" className="border rounded-md px-4 py-2">
                Back
              </Link>
            </div>
          </div>
        </SignedIn>
        <SignedOut>
          <div className="space-y-3">
            <p className="text-sm">You must be signed in to view this page.</p>
            <SignInButton mode="modal" forceRedirectUrl="/listings" />
          </div>
        </SignedOut>
      </div>
    </div>
  );
}

