"use client";

// Section O questions page — asks for gender for now.
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";

export default function OSection() {
  return (
    <div className="min-h-[60vh] flex items-start justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Section O</h1>
        <SignedIn>
          <GenderForm sectionKey="O" />
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

function GenderForm({ sectionKey }: { sectionKey: "L" | "O" }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [gender, setGender] = React.useState<string>("
");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isLoaded || !user) return;
    const existing = ((user.unsafeMetadata as any)?.[sectionKey] as any)?.gender as string | undefined;
    if (existing && !gender) setGender(existing);
  }, [isLoaded, user, sectionKey, gender]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!gender) {
      setError("Please select a gender");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const meta = (user.unsafeMetadata as any) || {};
      const prevSection = (meta[sectionKey] as any) || {};
      const nextMeta = {
        ...meta,
        [sectionKey]: { ...prevSection, gender, updatedAt: new Date().toISOString() },
      };
      await user.update({ unsafeMetadata: nextMeta });
      router.replace("/important");
    } catch (err) {
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-gray-500">Please select your gender:</p>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="gender"
            value="male"
            checked={gender === "male"}
            onChange={() => setGender("male")}
          />
          <span>Male</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="gender"
            value="female"
            checked={gender === "female"}
            onChange={() => setGender("female")}
          />
          <span>Female</span>
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#6c47ff] text-white rounded-md px-4 py-2 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.replace("/important")}
          className="border rounded-md px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
