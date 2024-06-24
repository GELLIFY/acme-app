import { NextResponse } from "next/server";

import { env } from "~/env";
import { auth } from "~/server/auth";

function logoutParams(idToken: string): Record<string, string> {
  return {
    id_token_hint: idToken,
    post_logout_redirect_uri: env.AUTH_URL,
  };
}

function handleEmptyToken() {
  const response = { error: "No session present" };
  const responseHeaders = { status: 400 };
  return NextResponse.json(response, responseHeaders);
}

function sendEndSessionEndpointToURL(idToken: string) {
  const endSessionEndPoint = new URL(
    `${env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`,
  );
  const params: Record<string, string> = logoutParams(idToken);
  const endSessionParams = new URLSearchParams(params);
  const response = {
    url: `${endSessionEndPoint.href}/?${endSessionParams.toString()}`,
  };
  return NextResponse.json(response);
}

export const POST = auth(async function POST(req) {
  try {
    const data = (await req.json()) as { id_token: string };

    if (data.id_token) {
      console.log(`Federated logout request for ${data.id_token}`);
      return sendEndSessionEndpointToURL(data.id_token);
    }
    return handleEmptyToken();
  } catch (error) {
    console.error(error);
    const response = {
      error: "Unable to logout from the session",
    };
    const responseHeaders = {
      status: 500,
    };
    return NextResponse.json(response, responseHeaders);
  }
});
