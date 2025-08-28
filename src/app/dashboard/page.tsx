'use client';

// Dashboard route. Shows content to signed-in users.
// A small gate below ensures users have completed onboarding.

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// The actual dashboard UI
function DashboardContent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Welcome to your dashboard!</p>
    </div>
  );
}

// What to show if the user is signed out
function SignInContent() {
  return (
    <div className="p-4 space-y-3">
      <p>You must be signed in to view this page.</p>
      <SignInButton mode="modal" forceRedirectUrl="/post-auth" />
    </div>
  );
}

// Main dashboard component
export default function Dashboard() {
  return (
    <>
      <SignedIn>
        {/* Only show dashboard to users who finished onboarding */}
        <DashboardGate>
          <DashboardContent />
        </DashboardGate>
      </SignedIn>
      <SignedOut>
        <SignInContent />
      </SignedOut>
    </>
  );
}

// Redirect users back to onboarding until they have a full name (or confirmation flag)
function DashboardGate({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!isLoaded) return;
    const nameConfirmed = user?.unsafeMetadata?.["nameConfirmed"] === true;
    const hasFullName = Boolean(user?.firstName && user?.lastName);
    if (!nameConfirmed && !hasFullName) {
      router.replace('/onboarding');
    }
  }, [isLoaded, user, router]);

  return <>{children}</>;
}
