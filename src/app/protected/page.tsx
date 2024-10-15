"use client";

import { env } from "~/env";

export default function ProtectedPage() {
  const safeKey = env.NEXT_PUBLIC_CLIENTVAR;

  return (
    <section>
      <h1>This page is protected</h1>
      <p>Safe Key: {safeKey}</p>
      <p>
        This environment variable is made available to the browser with{" "}
        <code>NEXT_PUBLIC_</code>.
      </p>
    </section>
  );
}
