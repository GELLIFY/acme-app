export function buildInvitationUrl(
  origin: string,
  pathname: string,
  invitationId: string,
) {
  const url = new URL(pathname, origin);
  url.searchParams.set("invite", invitationId);
  return url.toString();
}
