"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";
import SignInEffect from "./auth/pusher";

export default function Home() {

    return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <SignedIn>
            <SignInEffect page="/dashboard"/>
        </SignedIn >
        <SignedOut>
          <SignInButton mode="modal" forceRedirectUrl="/dashboard" />
        </SignedOut>
      </main>
    </div>
  );
}
