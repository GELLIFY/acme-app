import { Resend } from "resend";
import ChangeEmailConfirmationEmail from "@/emails/change-email-confirmation-email";
import DeleteAccountVerificationEmail from "@/emails/delete-account-verification-email";
import EmailVerificationEmail from "@/emails/email-verification-email";
import ResetPasswordEmail from "@/emails/reset-password-email";
import { env } from "@/env";
import { logger } from "@/lib/logger";

export const resend = new Resend(env.RESEND_API_KEY || "re_123");

type ResetPasswordEmailParams = {
  user: { email: string };
  url: string;
};

export const sendResetPasswordEmail = async ({
  user,
  url,
}: ResetPasswordEmailParams) => {
  logger.debug(`Click the link to reset your password: ${url}`);

  return await resend.emails.send({
    from: "Acme <noreply@acme.gellify.dev>",
    to: user.email,
    subject: "Reset password",
    react: ResetPasswordEmail({
      username: user.email,
      resetLink: url,
    }),
  });
};

type ChangeEmailConfirmationParams = {
  user: { email: string; name: string };
  url: string;
  newEmail: string;
};

export const sendChangeEmailConfirmationEmail = async ({
  newEmail,
  url,
  user,
}: ChangeEmailConfirmationParams) => {
  logger.debug(`Click the link to approve email change: ${url}`);

  await resend.emails.send({
    from: "Acme <noreply@acme.gellify.dev>",
    to: user.email,
    subject: "Confirm email change",
    react: ChangeEmailConfirmationEmail({
      user,
      newEmail,
      url,
    }),
  });
};

type EmailVerificationEmailParams = {
  user: { email: string; name: string };
  url: string;
};

export const sendEmailVerificationEmail = async ({
  url,
  user,
}: EmailVerificationEmailParams) => {
  logger.debug(`Click the link to verify your email: ${url}`);

  await resend.emails.send({
    from: "Acme <noreply@acme.gellify.dev>",
    to: user.email,
    subject: "Verify your email address",
    react: EmailVerificationEmail({
      user,
      url,
    }),
  });
};

type DeleteAccountVerificationParams = {
  user: { email: string; name: string };
  url: string;
};

export const sendDeleteAccountVerificationEmail = async ({
  user,
  url,
}: DeleteAccountVerificationParams) => {
  logger.debug(`Click the link to delete the account: ${url}`);

  await resend.emails.send({
    from: "Acme <noreply@acme.gellify.dev>",
    to: user.email,
    subject: "Delete account",
    react: DeleteAccountVerificationEmail({
      user,
      url,
    }),
  });
};
