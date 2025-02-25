import { unstable_noStore } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { env } from "~/env";

async function getPokemon() {
  unstable_noStore();

  const apiKey = global.secrets?.apiKey ?? "None for demo";
  const randomNumber = Math.floor(Math.random() * 100) + 1;

  return await fetch(`https://api.vercel.app/pokemon/${randomNumber}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
}

export default async function Home() {
  const secretKey = env.SERVERVAR;
  const response = await getPokemon();
  const pokemon = (await response.json()) as {
    id: string;
    name: string;
    type: string[];
  };

  return (
    <main className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">GELLIFY Acme App Demo</h1>
        <p>
          This is a demo of a Next.js application. It also includes a Postgres
          database.{" "}
          <Link href="https://github.com/leerob/next-self-host">
            View the code
          </Link>
          .
        </p>
      </header>

      <section className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold">Data Fetching</h3>
        <p>Random Pokemon: {pokemon.name}</p>
        <p>
          This value was retrieved with{" "}
          <code className="rounded border border-slate-200 bg-slate-100 p-0.5 px-1">
            fetch
          </code>{" "}
          from an API. This page is served dynamically, fetching a random
          Pokemon on each request. Reload to see a new Pokemon.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold">Image Optimization</h3>
        <Image
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
          width={480 / 2}
          height={320 / 2}
          alt="Coding"
        />
        <p>
          Next.js supports image optimization out of the box with{" "}
          <code className="rounded border border-slate-200 bg-slate-100 p-0.5 px-1">
            next start
          </code>
          . The image above is using the default image optimization on the
          Next.js server.
        </p>
        <p>
          In Next.js 15, you no longer need to install{" "}
          <code className="rounded border border-slate-200 bg-slate-100 p-0.5 px-1">
            sharp
          </code>{" "}
          manually for image optimization, whether local or remote. You can also
          use a custom image loader for external optimization services.
        </p>
        <p>
          You can also bring your own custom image loader, if you would prefer
          to use a different service. You can view an example{" "}
          <Link
            className="underline"
            href="https://github.com/leerob/next-self-host/blob/main/image-loader.ts"
          >
            here
          </Link>
          , which you can enable through{" "}
          <Link
            className="underline"
            href="https://github.com/leerob/next-self-host/blob/main/next.config.ts"
          >
            <code className="rounded border border-slate-200 bg-slate-100 p-0.5 px-1">
              next.config.ts
            </code>
          </Link>
          .
        </p>
        <p>
          <Link
            className="underline"
            href="https://nextjs.org/docs/app/building-your-application/deploying#image-optimization"
          >
            Read the docs
          </Link>
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold">Postgres Database</h3>
        <p>
          This route reads and writes to our Postgres database, which is in its
          own Docker container. It uses Drizzle for the ORM.
        </p>
        <p>
          <Link className="underline" href="/todo">
            View the demo
          </Link>
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold">Middleware</h3>
        <p>
          The{" "}
          <code className="rounded border border-slate-200 bg-slate-100 p-0.5 px-1">
            /protected
          </code>{" "}
          route is protected by authentication. You will be redirected back to{" "}
          <code className="rounded border border-slate-200 bg-slate-100 p-0.5 px-1">
            /
          </code>
          . To view the route, you have to login.
        </p>
        <p>
          Middleware does not have access to all Node.js APIs. It is designed to
          run before all routes in your application. However, we are planning to
          allow support for using the entire Node.js runtime, which can be
          necessary when using some third-party libraries.
        </p>
        <p>
          It is not recommended to do checks like fetching user information from
          your database inside of Middleware. Instead, these checks should
          happen before queries or mutations. Checking for an auth cookie in
          Middleware in the{" "}
          <Link
            className="underline"
            href="https://nextjs.org/docs/app/building-your-application/authentication#protecting-routes-with-middleware"
          >
            preferred pattern
          </Link>
          .
        </p>
        <p>
          <Link className="underline" href="/protected">
            View the demo
          </Link>
        </p>
        <p>
          <Link
            className="underline"
            href="https://nextjs.org/docs/app/building-your-application/deploying#middleware"
          >
            Read the docs
          </Link>
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold">Server Startup</h3>
        <p>
          Next.js includes an{" "}
          <code className="rounded border border-slate-200 bg-slate-100 p-0.5 px-1">
            instrumentation
          </code>{" "}
          file that runs some code when the server starts.
        </p>
        <p>
          This instrumentation file will be stabilized in Next.js 15. A common
          use case is reading secrets from remote locations like Vault or
          1Password. You can try this by setting the appropriate variables in
          your{" "}
          <code className="rounded border border-slate-200 bg-slate-100 p-0.5 px-1">
            .env
          </code>{" "}
          file for Vault, though it&apos;s not required for the demo.
        </p>
        <p>
          <Link
            className="underline"
            href="https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation"
          >
            Read the docs
          </Link>
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold">Environment Variables</h3>
        <p>
          Next.js supports loading environment variables from{" "}
          <code className="rounded border border-slate-200 bg-slate-100 p-0.5 px-1">
            .env
          </code>{" "}
          files.
        </p>
        <p>
          When reading values from a Server Component, you can ensure that the
          env var is read dynamically every time. For container setups, a common
          use case here is to provide different env vars per environment, with
          the same Docker image.
        </p>
        <p>
          This value was read from{" "}
          <code className="rounded border border-slate-200 bg-slate-100 p-0.5 px-1">
            process.env
          </code>
          :{" "}
          <code className="rounded border border-slate-200 bg-slate-100 p-0.5 px-1">
            {secretKey}
          </code>
        </p>
        <p>
          <Link
            className="underline"
            href="https://nextjs.org/docs/app/building-your-application/deploying#environment-variables"
          >
            Read the docs
          </Link>
        </p>
      </section>
    </main>
  );
}
