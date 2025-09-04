// Small client helper that decides where to redirect after sign-in.
// If onboarding is complete, go to the target page; else go to /onboarding.
import { useRouter } from 'next/navigation'
import React from "react";
import { useUser } from "@clerk/nextjs";

const SignInEffect = ({ page = "/dashboard" }: { page?: string }) => {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  React.useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;
    // Two ways to consider onboarding "done":
    // 1) We explicitly stored a flag in unsafeMetadata
    // 2) The user already has both first and last name (e.g. provided by OAuth)
    const nameConfirmed = user?.unsafeMetadata?.["nameConfirmed"] === true;
    const hasFullName = Boolean(user?.firstName && user?.lastName);
    if (nameConfirmed || hasFullName) {
      router.push(page);
    } else {
      router.push('/onboarding');
    }
  }, [isLoaded, isSignedIn, user, page, router]);
  return null;
};

export default SignInEffect;
