import { organization as organizationPlugin } from "better-auth/plugins";
import { sendOrganizationInvitationEmail } from "./server/invitation-email";

export const organization = {
  id: "auth.organization",
  plugins: [
    organizationPlugin({
      organizationLimit: 5,
      cancelPendingInvitationsOnReInvite: true,
      async sendInvitationEmail(data) {
        const inviteLink = `https://example.com/accept-invitation/${data.id}`;
        sendOrganizationInvitationEmail({
          email: data.email,
          invitedByUsername: data.inviter.user.name,
          invitedByEmail: data.inviter.user.email,
          teamName: data.organization.name,
          inviteLink,
        });
      },
    }),
  ],
} as const;
