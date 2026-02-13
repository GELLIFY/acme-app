# Auth

This template uses Better Auth with Next.js route handlers, Drizzle, and typed
client helpers. The configuration is centralized and already wired to the app
routes and UI.

## Quick map

- `src/shared/infrastructure/better-auth/auth.ts` - server config and plugins
- `src/shared/infrastructure/better-auth/auth-client.ts` - client helpers
- `src/app/api/auth/[...all]/route.ts` - Next.js handler for `/api/auth/*`
- `src/server/db/schema/auth-schema.ts` - auth tables (Drizzle)
- `src/shared/infrastructure/better-auth/permissions.ts` - access control/roles
- `src/server/services/email-service.ts` - email dispatch helpers
- `src/emails/*.tsx` - email templates
- `src/app/[locale]/(public)/(auth)/*` - sign-in/up/reset/2fa pages
- `src/app/[locale]/(app)/account/page.tsx` - account management
- `src/app/[locale]/(app)/admin/page.tsx` - admin user management

## Environment

- `BETTER_AUTH_SECRET` (required, min 32 chars)
- `BETTER_AUTH_URL` (base URL for callbacks/redirects)

If these are set, do not hardcode `baseURL`/`secret` in the config.

## Server-side usage

Use `auth.api.*` with request headers in Server Components or route handlers.

```ts
import { headers } from "next/headers";
import { auth } from "@/libs/better-auth/auth";

const headersList = await headers();
const session = await auth.api.getSession({ headers: headersList });
```

Admin checks and other server calls follow the same pattern. See:
`src/app/[locale]/(app)/admin/page.tsx`.

## Client-side usage

The client helper is created in `src/shared/infrastructure/better-auth/auth-client.ts`.

```ts
import { authClient } from "@/libs/better-auth/auth-client";

const { data, error } = await authClient.signIn.email({
  email,
  password,
  rememberMe,
});
```

Session hooks are also available:

```ts
const { data: session } = authClient.useSession();
```

## Enabled features and plugins

Configured in `src/shared/infrastructure/better-auth/auth.ts`:

- Email/password auth
- Email verification
- Change email and delete account flows
- Passkeys (`@better-auth/passkey`)
- Two factor (`better-auth/plugins/two-factor`)
- Admin + access control (`better-auth/plugins/admin`)
- API keys (`better-auth/plugins/api-key`)
- Last login method (`better-auth/plugins/last-login-method`)
- OpenAPI (`better-auth/plugins/open-api`)
- Next.js cookies integration (`better-auth/next-js`)

## Access control and roles

Access control is built with `createAccessControl` in
`src/shared/infrastructure/better-auth/permissions.ts`:

- `ac` defines statements (resources + actions)
- `userRole` and `adminRole` expand allowed actions
- `auth` plugin config wires roles into Better Auth

Use `auth.api.userHasPermission` on the server to guard admin pages.

## Email flows

Email handlers live in `src/server/services/email-service.ts` and templates in
`src/emails/*.tsx`. These handlers are called by Better Auth for:

- email verification
- password resets
- change email confirmation
- delete account verification

## Sessions

Server:

- `auth.api.listSessions`
- `auth.api.revokeSession`

Client:

- `authClient.revokeSession`
- `authClient.revokeSessions`

See `src/components/auth/account/session-managment.tsx`.

## API keys

Server:

- `auth.api.listApiKeys`
- `auth.api.createApiKey`
- `auth.api.deleteApiKey`

Client UI is in `src/components/auth/account/api-key-management.tsx`.

## Passkeys and 2FA

- Passkey management UI in
  `src/components/auth/account/passkey-management.tsx`
- TOTP verification in `src/components/auth/verify-totp-form.tsx`
- Passkey sign-in on the sign-in page via
  `src/components/auth/passkey-button.tsx`

## OpenAPI

The OpenAPI plugin is enabled with `disableDefaultReference: true`, so the
default docs UI is disabled. The schema endpoint is still available under
`/api/auth/open-api/generate-schema`.

## Database and migrations

Better Auth uses the Drizzle adapter (`src/shared/infrastructure/better-auth/auth.ts`)
and schema definitions in `src/server/db/schema/auth-schema.ts`.

When adding or changing plugins, re-run the Better Auth CLI to update schema:

```bash
pnpm auth:generate
```

This will create a new drizzle schema file in `src/server/db/schema/auth-schema-new.ts`. It is your responsibility to review and merge the changes into your existing schema file. After merging, run the migration script to update the database schema and remove the `auth-schema-new.ts`.

## AI notes (for automated changes)

- Keep plugin imports tree-shakeable (use per-plugin paths).
- Update both `auth.ts` and `auth-client.ts` when adding/removing plugins.
- Keep the Next.js handler at `src/app/api/auth/[...all]/route.ts`.
- Use `auth.api.*` on the server and `authClient.*` in client components.
