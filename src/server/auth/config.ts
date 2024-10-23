import type { DefaultSession, NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

import { env } from "~/env";

declare module "next-auth" {
  interface Session {
    id_token?: string;
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  // Extend token to hold the access_token before it gets put into session
  interface JWT {
    id_token?: string;
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
    error?: "RefreshAccessTokenError";
  }
}

export const authConfig = {
  providers: [
    KeycloakProvider({
      clientId: env.KEYCLOAK_CLIENT_ID,
      clientSecret: env.KEYCLOAK_CLIENT_SECRET,
      issuer: env.KEYCLOAK_ISSUER,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.id_token = account.id_token;
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = account.expires_at;
        return token;
      }

      // we take a buffer of one minute(60 * 1000 ms)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (Date.now() < token.expires_at! * 1000 - 60 * 1000) {
        return token;
      } else {
        try {
          const response = await fetch(
            `${env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                client_id: env.KEYCLOAK_CLIENT_ID,
                client_secret: env.KEYCLOAK_CLIENT_SECRET,
                grant_type: "refresh_token",
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                refresh_token: token.refresh_token!,
              }),
              method: "POST",
              cache: "no-store",
            },
          );

          const tokens = (await response.json()) as {
            id_token: string;
            access_token: string;
            refresh_token: string;
            expires_in?: number;
          };

          if (!response.ok) throw new Error(response.statusText);

          const updatedToken: JWT = {
            ...token, // Keep the previous token properties
            idToken: tokens.id_token,
            accessToken: tokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in!),
            refreshToken: tokens.refresh_token ?? token.refreshToken,
          };
          return updatedToken;
        } catch (error) {
          console.error("Error refreshing access token", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
    },
    session({ session, token }) {
      // console.log(`Auth Sess = ${JSON.stringify(session)}`);
      // console.log(`Auth Tok = ${JSON.stringify(token)}`);

      // Put the provider's access token in the session so that we can access it client-side and server-side with `auth()`
      session.id_token = token.id_token;
      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;
      session.expires_at = token.expires_at;
      session.user = {
        ...session.user,
        id: session.user.id,
      };
      return session;
    },
  },
} satisfies NextAuthConfig;
