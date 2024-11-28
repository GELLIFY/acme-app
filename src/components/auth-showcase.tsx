import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export async function AuthShowcase() {
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
