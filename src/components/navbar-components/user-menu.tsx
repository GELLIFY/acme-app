import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import { Button } from "../ui/button";

export default function UserMenu() {
  return (
    <>
      <SignedOut>
        <SignInButton>
          <Button size="sm" variant="ghost">
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
