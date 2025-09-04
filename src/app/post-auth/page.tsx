"use client";

// Neutral post-auth page: quickly redirects to the right place
// without flashing onboarding or dashboard.
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";

export default function PostAuth() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace("/");
      return;
    }
    const nameConfirmed = user?.unsafeMetadata?.["nameConfirmed"] === true;
    const hasFullName = Boolean(user?.firstName && user?.lastName);
    if (nameConfirmed || hasFullName) {
      router.replace("/important");
    } else {
      router.replace("/onboarding");
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="min-h-screen grid place-items-center bg-transparent p-4">
      {/* Skeleton that resembles the Clerk sign-in modal */}
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800/40 bg-neutral-900/40 backdrop-blur-md p-6 shadow-lg">
        <div className="animate-pulse">
          {/* Header avatar + title lines */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-neutral-700" />
            <div className="flex-1">
              <div className="h-3 w-32 bg-neutral-700 rounded mb-2" />
              <div className="h-3 w-20 bg-neutral-800 rounded" />
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-3 mb-4">
            <div className="h-10 w-full rounded-md bg-neutral-800" />
            <div className="h-10 w-full rounded-md bg-neutral-800" />
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <div className="h-10 w-full rounded-md bg-neutral-700" />
            <div className="h-10 w-full rounded-md bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
