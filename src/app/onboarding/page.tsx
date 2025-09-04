"use client";

// Onboarding page: asks for a single "Full name" after sign-up/sign-in.
// If the user already has first + last name (or a confirmation flag), it skips itself.

import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";

export default function Onboarding() {
  return (
    <div className="min-h-[60vh] flex items-start justify-center p-6">
      <div className="w-full max-w-md">
        <SignedIn>
          {/* Only signed-in users see the form */}
          <FullNameForm />
        </SignedIn>
        <SignedOut>
          <div className="space-y-4">
            <p className="text-sm">You need to sign in to continue.</p>
            <SignInButton mode="modal" forceRedirectUrl="/onboarding" />
          </div>
        </SignedOut>
      </div>
    </div>
  );
}

function FullNameForm() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [fullName, setFullName] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // On mount: if onboarding is already complete, skip to dashboard.
  React.useEffect(() => {
    if (!isLoaded || !user) return;
    const nameConfirmed = (user.unsafeMetadata as any)?.["nameConfirmed"] === true;
    const hasFullName = Boolean(user.firstName && user.lastName);
    // If already has full name or confirmed, skip onboarding
    if (nameConfirmed || hasFullName) {
      router.replace('/dashboard');
      return;
    }
    // Otherwise pre-fill from any existing first/last
    const existing = [user.firstName, user.lastName].filter(Boolean).join(" ");
    if (existing && !fullName) {
      setFullName(existing);
    }
  }, [isLoaded, user, router, fullName]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const name = fullName.trim();
    if (!name) {
      setError("Please enter your full name");
      return;
    }

    // Split full name into first and last parts
    const parts = name.split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ");

    setSaving(true);
    setError(null);
    try {
      // Save the user's name and mark onboarding as complete.
      // Note: public/private metadata cannot be written from the browser.
      await user.update({
        firstName,
        lastName,
        // Use unsafeMetadata on the client; you can mirror this server-side later.
        unsafeMetadata: {
          ...(user.unsafeMetadata as any),
          nameConfirmed: true,
        },
      });
      router.push("/important");
    } catch (err) {
      // Show a friendly error if saving fails.
      setError("Could not save your name. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Welcome! Let’s get your name</h1>
        <p className="text-sm text-gray-500">We’ll use this on your profile.</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-medium">
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Ada Lovelace"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="bg-[#6c47ff] text-white rounded-md px-4 py-2 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Continue"}
      </button>
    </form>
  );
}
