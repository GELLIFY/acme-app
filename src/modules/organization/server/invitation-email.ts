import OrganizationInvitationEmail from "@/emails/organization-invitation-email";
import { logger } from "@/libs/logger/logger";
import { resend } from "@/libs/resend";

type OrganizationInvitationEmailParams = {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
};

export const sendOrganizationInvitationEmail = async ({
  inviteLink,
  email,
  invitedByUsername,
  invitedByEmail,
  teamName,
}: OrganizationInvitationEmailParams) => {
  logger.debug(`Click the link to accept invitation: ${inviteLink}`);

  await resend.emails.send({
    from: "Acme <noreply@acme.gellify.dev>",
    to: email,
    subject: `You're invited to join ${teamName} on Acme`,
    react: OrganizationInvitationEmail({
      inviteLink,
      invitedByUsername,
      invitedByEmail,
      teamName,
    }),
  });
};
