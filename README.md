# Acme App

This is template for GELLIFY fullstack app. A [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app` and configured to use the best integrations for our standard projects.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please refer to the [Documentation](https://create.t3.gg/) and the [T3 Stack Tutorial](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available).

- [Next.js](https://nextjs.org)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)

## What's the architecture of this app?

In this stack we tried to follow all of the best practices of the different components that are used to enable the various features. In order to offer some default we pre-configured the following layers:

- ✅ App Layer, a standard [Next.js](https://nextjs.org) app
- ✅ Auth Layer, a [Clerk](https://clerk.com/) instance
- ✅ Data Layer, a Postgres instance managed by [Neon](https://neon.tech/) with [Drizzle](https://orm.drizzle.team)
- 😌 That's it!

Below you can find a diagram representing an high level overview of architecture we strived to implement. This fullstack template aims to reduce complexity, increase DX and reduce dependencies overhead.

![alt text](./docs/acme_app-charmender-architecture.png)

### Architecture - App Layer

The application is build following all of the latest Next.js 15 best practices and guidelines. Please refer to [Next.js](https://nextjs.org) official docs to get a better understanding of the available features.

The standard Next.js application layer features:

- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) -> `middleware.ts` single point of ingress into the app
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) -> `/app/api/**/route.ts` REST APIs
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) -> `/app/actions.ts` new way to handle data querying and mutation
- [RSC](https://nextjs.org/docs/app/building-your-application/rendering/server-components) (React Server Component) -> `/app/**/*.tsx` default or annotated with `use server`
- [RCC](https://nextjs.org/docs/app/building-your-application/rendering/client-components) (React Client Component) -> `/app/**/*.tsx` annotated with `use client`

All of the above are just the basic features of a modern Next.js application. You can and should make a deeper deep dive into the official docs to learn about other usefull features and guidelines on how to build with this stack.

### Architecture - Auth Layer

For authentication and authorization we choose Clerk for rapid development and easy of use. In this template Auth is configured out-of-the-box with some defaults that can be modified.

Documentation can be found [here](https://clerk.com/docs).

### Architecture - Data Layer

A [Neon](https://neon.tech/) Postrges Database is required, but local development can be done via a local instance through Docker.

[Drizzle](https://orm.drizzle.team) is the ORM used to manage the the DB and this is the case for several reasons:

- Can handle almost every relational databases, so switching can be done pretty easily.
- Easy way to handle schema push, migrations and seeding of the DB

**Why not Prisma?**

1. Prisma needs a generation step to be typesafe where Drizzle is 100% typescript
2. Prisma handle query under the hood, making impossible for the Developer to optimize or take control of a given query.

## How do I start developing with this?

### Requirements

- Docker or Podman
- Node Version Manager ([fnm](https://github.com/Schniz/fnm) **reccomended** to switch version automagically)

### Getting started

1. First you have to create a copy of the environment variables.

```sh
cp .env.example .env
```

2. Then start the localstack needed for development. We need a Postgres instace, and we should also push DB schema + seed. All of the above can be done with a pre-configured script

```sh
./start-localstack.sh
```

3. Run the actual Next.js development server

```sh
pnpm run dev
```

### Supported Features

This demo tries to showcase many different Next.js features.

- Image Optimization
- Streaming
- Talking to a Postgres database
- Caching
- Incremental Static Regeneration
- Reading environment variables
- Using Middleware
- Running code on server startup
- A cron that hits a Route Handler

View the demo at https://acme-hfnya4lj9-gellify.vercel.app/ to see further explanations.

## How do I deploy this? (WIP)

### VPS (self-host)

TBD

### Vercel (internal products)

Go to the Vercel dashboard add a project, connect your repository and deploy!

### Azure

Azure static web apps + GitHub Actions or Azure pipelines

### AWS

TBD

## Must read and watch

- [From 0 to Production - The Modern React Tutorial (RSCs, Next.js, Shadui, Drizzle, TS and more)](https://www.youtube.com/watch?v=d5x0JCZbAJs)
- [React Hook Form & React 19 Form Actions, The Right Way](https://www.youtube.com/watch?v=VLk45JBe8L8)
- [Self-Hosting Next.js](https://www.youtube.com/watch?v=sIVL4JMqRfc)
