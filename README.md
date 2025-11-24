# Acme App

The GELLIFY Stack is a modern web development stack designed for simplicity, modularity, and full-stack TypeScript safety. Created and refined by [Matteo Badini↗](https://x.com/badini_matteo) and the GELLIFY team, it brings together battle-tested technologies to help developers build scalable, maintainable, and performant applications with minimal friction. Please refer to the [official documentation↗](https://gellify.dev)

## Prerequisites

Before you begin, make sure you have the following:

- `docker` ➡️ localstack for local development
- `fnm` ➡️ node version manager
- `bun` ➡️ test runner

## Getting started

First you have to create a copy of the environment variables.

```sh
cp .env.example .env
```

Then follow the instruction below to fill the `.env` with the required pieces to get you started.

### Database

GELLIFY app will come with a `start-localstack.sh` bash script that can create a docker container with a database for local development.
If you already have a database, feel free to delete this file and put your database credentials in `.env`.

```sh
./start-localstack.sh
```

The `.env` file in your project directory already contains a valid DB url for local development via Docker. No initial setup on your part is needed.

## Editor Setup

We recommended using [Cursor↗](https://www.cursor.com/) a fork of VSCode with a deeper integration with different AI models. We also provide a `.cursorrules` file to give the AI the necessary context on technologies, patterns, conventions...
The following extensions are recommended for an optimal developer experience. The links below provide editor specific plugin support.

- [Tailwind CSS IntelliSense Extension↗](https://tailwindcss.com/docs/editor-setup)
- [Biome Extension↗](https://biomejs.dev/reference/vscode/)
- [Pretty TypeScript Errors↗](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)

## Next Steps

Have a look around the [docs↗](https://gellify.dev), as well as the docs of the packages that your app includes.

## Notes 2025-10-23

- [ ] resend email integration
- [ ] replace loading with startTransition
