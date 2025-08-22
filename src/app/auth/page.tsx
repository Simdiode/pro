'use client';

import { SignedIn, SignedOut, SignInButton, UserButton, } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

// Helper component for dashboard content (logged in user view)
function DashboardContent() {
  return (
    <div className="p-4 , mask-origin-padding space-y-3">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Welcome to your dashboard!</p>
    </div>
  );
}

// Helper component for sign-in content (logged out user view)
function SignInContent() {
  return (
    <div className="p-4 space-y-3">
      <p>You must be signed in to view this page.</p>
      <SignInButton mode="modal" forceRedirectUrl="/dashboard" />
    </div>
  );
}

function FirstOnboard() {
  redirect('/onboarding'); 
  return null;
}


// Main dashboard component
export default function Dashboard() {
  return (
    <>
      <SignedIn>
        <DashboardContent />
        </SignedIn>
        <SignedOut>
        <SignInContent />
        </SignedOut>
    </>
  );
}