# Acme App

The GELLIFY Stack is a modern web development stack designed for simplicity, modularity, and full-stack TypeScript safety. Created and refined by [Matteo Badini↗](https://x.com/badini_matteo) and the GELLIFY team, it brings together battle-tested technologies to help developers build scalable, maintainable, and performant applications with minimal friction. Please refer to the [official documentation↗](https://gellify.dev)

## Requirements

- Docker or Podman
- Node Version Manager (fnm recommended to switch version automagically)

## Getting started

First you have to create a copy of the environment variables.

```sh
cp .env.example .env
```

Then follow the instruction below to fill the `.env` with the required pieces to get you started.

### Setup your environment locally

This project uses [pnpm](https://pnpm.io) as its package manager. Install it if you haven't already:

```bash
npm install -g pnpm
```

Then, install the project's dependencies:

```bash
pnpm install
```

This project uses [bun](https://bun.com/) as test runner. If you haven't already installed it, make sure to do so:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Database

GELLIFY app will come with a `start-localstack.sh` bash script that can create a docker container with a database for local development.
If you already have a database, feel free to delete this file and put your database credentials in `.env`.

```sh
./start-localstack.sh
```

The `.env` file in your project directory already contains a valid DB url for local development via Docker.
Your app is already configured to talk to Neon and has a local Postgres via Docker for local development, we get you started. No initial setup on your part is needed.

Sooner or later you will have to create a remote instance to deploy to. Here the basic steps:

1. If you're already signed up or coming to Neon from Azure, you can skip ahead to Step 2.<br />
   If you haven't signed up yet, you can sign up for free here: [Create a Neon Account↗](https://console.neon.tech/signup)

2. Create a Neon project and get the necessary `DATABASE_URL`

Once everything is completed you can update the `.env` with Clerk variables to point to your remote DB instance.

```
DATABASE_URL=***
```

### Authentication

Your app includes Clerk, we get you started. This is one of the simplest providers, but it still requires a bit of initial setup on your part.
Of course, if you prefer to use a different auth provider, you can also opt-out of Clerk and use something link [NextAuth.js](https://next-auth.js.org/) instead.

You will need to:

1. Sign into Clerk
   [Create a Clerk account↗](https://dashboard.clerk.com/sign-up) or [sign into the Clerk Dashboard↗](https://dashboard.clerk.com/).

2. Create a Clerk application
   If you've just created an account for the first time, you'll be taken directly to the interactive authentication setup form.
   Otherwise, you'll be redirected to the [Clerk Dashboard↗](https://dashboard.clerk.com/). To create a new app, select the **Create application** card.
   You'll be redirected to the interactive authentication setup form.

3. Select identifiers and social providers
   Once you are in the interactive authentication setup form, you will be asked to build your authentication flow.
   Here, Clerk provides various options for setting up your sign-up and sign-in flows. You can choose to use email, phone, or username as [identifiers](https://clerk.com/docs/authentication/configuration/sign-up-sign-in-options#identifiers), and you can enable [social authentication providers](https://clerk.com/docs/authentication/social-connections/overview).
   Once the application is created, you can also customize your authentication flow by selecting different authentication strategies, verification methods, and more. [Learn more about sign-up and sign-in options](https://clerk.com/docs/authentication/configuration/sign-up-sign-in-options).

Once everything is completed update the `.env` with Clerk variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_***
CLERK_SECRET_KEY=sk_test_***
```

## Editor Setup

We recommended using [Cursor↗](https://www.cursor.com/) a fork of VSCode with a deeper integration with different AI models. We also provide a `.cursorrules` file to give the AI the necessary context on technologies, patterns, conventions...
The following extensions are recommended for an optimal developer experience. The links below provide editor specific plugin support.

- [Tailwind CSS IntelliSense Extension↗](https://tailwindcss.com/docs/editor-setup)
- [Prettier Extension↗](https://prettier.io/docs/en/editors.html)
- [Pretty TypeScript Errors↗](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)

## Next Steps

Have a look around the [docs↗](https://gellify.dev), as well as the docs of the packages that your app includes.

## Notes 2025-02-12

- [ ] fix clerk element login
- [ ] fix rest api auth middleware
