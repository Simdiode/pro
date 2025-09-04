"use client";

// Important hub page shown after onboarding.
// Lets the user choose between two sections: L and O.
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Important() {
  return (
    <div className="min-h-[60vh] flex items-start justify-center p-6">
      <div className="w-full max-w-md">
        <SignedIn>
          <ImportantGate>
            <Chooser />
          </ImportantGate>
        </SignedIn>
        <SignedOut>
          <div className="space-y-3">
            <p className="text-sm">You must be signed in to view this page.</p>
            <SignInButton mode="modal" forceRedirectUrl="/post-auth" />
          </div>
        </SignedOut>
      </div>
    </div>
  );
}

// Ensure the user completed onboarding before entering the hub
function ImportantGate({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const nameConfirmed = user?.unsafeMetadata?.["nameConfirmed"] === true;
    const hasAnyName = Boolean(user?.firstName || user?.lastName);
    if (!nameConfirmed && !hasAnyName) {
      router.replace("/onboarding");
    }
  }, [isLoaded, user, router]);

  return <>{children}</>;
}

function Chooser() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Choose a section</h1>
      <p className="text-sm text-gray-500">Pick where you want to go:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/L"
          className="block text-center rounded-md border px-4 py-6 hover:bg-neutral-900"
        >
          L
        </Link>
        <Link
          href="/O"
          className="block text-center rounded-md border px-4 py-6 hover:bg-neutral-900"
        >
          O
        </Link>
      </div>
    </div>
  );
}

