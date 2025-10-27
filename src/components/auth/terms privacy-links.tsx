import Link from "next/link";

export const TermsPrivacyLinks = () => {
  return (
    <div className="text-center">
      <p className="text-sm  text-muted-foreground">
        By signing in you agree to our{" "}
        <Link href="/terms" className="underline">
          Terms of service
        </Link>{" "}
        &{" "}
        <Link href="/policy" className="underline">
          Privacy policy
        </Link>
      </p>
    </div>
  );
};
