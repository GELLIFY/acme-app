export default {
  // home page
  "home.welcome": "Hello {name}!",
  "home.doc": "Read Documentation",

  auth: {
    already_have_account: "Already have an account?",
    no_account: "Don't have an account?",

    signup: {
      title: "Sign Up",
      subtitle: "Enter your information to create an account",
      first_name_fld: "First name",
      last_name_fld: "Last name",
      email_fld: "Email",
      password_fld: "Password",
      password_confirmation_fld: "Confirm password",
      image_fld: "Profile image (optional)",
      submit_btn: "Sign Up",
    },

    signin: {
      title: "Sign In",
      subtitle: "Enter your email below to login to your account",
      email_fld: "Email",
      password_fld: "Password",
      forgot_link: "Forgot your password?",
      submit_btn: "Sign In",
    },

    forgot_password: {
      title: "Forgot password",
      subtitle: "Enter your email to reset your password",
      back_btn: "Back to login",
      email_fld: "Email",
      submit_btn: "Send reset link",
    },

    reset_password: {
      title: "Password reset",
      subtitle: "Create and confirm your new password",
      back_btn: "Back to login",
      password_fld: "Password",
      password_confirmation_fld: "Confirm password",
      submit_btn: "Reset password",
      invalid_link_title: "Invalid reset link",
      invalid_link_description: "The password reset link is invalid or expired",
    },
  },

  account: {
    security: {
      change_password: {
        title: "Change Password",
        description: "Update your password for improved security.",
        message: "New password should be different",
        current_password_fld: "Current Password",
        new_password_fld: "New Password",
        new_password_msg: "Must be at least 8 characters long.",
        revoke_fld: "Log out other sessions",
        submit: "Save",
      },

      two_factor: {
        title: "Two-Factor Authentication",
        description:
          "Manage two-factor authentication to further protect your account.",
        info: "Learn more about 2FA",
        enable: "Enable 2FA",
        disable: "Disable 2FA",
        code_fld: "Code",
        code_msg:
          "Scan this QR code with your authenticator app and enter the code below",
        verify: "Verify",
        backup_msg:
          "Save these backup codes in a safe place. You can use them to access your account.",
        download: "Download",
        copy: "Dopy",
        done: "Done",
        status: {
          enabled_title: "Enabled",
          disabled_title: "Disabled",
          enabled_description:
            "Two-factor authentication is currently enabled for your account.",
          disabled_description:
            "Two-factor authentication is currently disabled for your account.",
        },
        access: {
          title: "Two-Factor Authentication",
          description:
            "Enter a 6-digit code from your authenticator app, or use a backup code if you cannot access your authenticator.",
          app_tab: "Autenticator App",
          backup_tab: "Backup Code",
        },
        backup_code_form: {
          code_fld: "Backup Code",
          submit_btn: "Verify",
          error: "Failed to verify code",
        },
      },

      passkey: {
        title: "Passkeys",
        description:
          "Manage your passkeys for secure, passwordless authentication.",
        info: "Learn more about passkeys",
        new_btn: "New Passkey",
        new_title: "Add New Passkey",
        new_description:
          "Create a new passkey for secure, passwordless authentication.",
        new_submit: "Add Passkey",
        created: "Created {value}",
        delete_title: "Are you absolutely sure?",
        delete_decription:
          "This action cannot be undone. This will permanently delete your passkey.",
        delete_cancel: "Cancel",
        delete_confirm: "Delete Passkey",

        empty: {
          title: "No Passkeys Yet",
          description:
            "You haven'&apos;'t created any passkeys yet. Get started by creating your first passkey.",
        },
      },
    },
    api_keys: {
      title: "API Keys",
      description: "Manage your API keys for secure access.",
      message: "Generate API keys to access your account programmatically.",
      dialog_title: "API Key",
      dialog_description:
        "Please enter a unique name for your API key to distinguish it from others.",
      name_fld: "Nome",
      expires_fld: "Scade",
      create_btn: "Create Key",
      key_lbl: "API Key",
      key_msg:
        "Please copy your API key and store it in a safe place. For security reasons we cannot show it again.",
      done_btn: "Done",

      created: "Created {date}",
      expires: "Expires {distance}",

      expirations: {
        NO_EXPIRATION: "No Expiration",
        ONE_DAY: "1 day",
        SEVEN_DAYS: "7 days",
        ONE_MONTH: "1 month",
        TWO_MONTHS: "2 months",
        THREE_MONTHS: "3 months",
        SIX_MONTHS: "6 months",
        ONE_YEAR: "1 year",
      },

      empty: {
        title: "No Api Key Yet",
        description:
          "You haven'&apos;'t created any api key yet. Get started by creating your first api key.",
      },

      delete: {
        title: "Are you absolutely sure?",
        description:
          "This action cannot be undone. This will permanently delete your API key.",
        cancel_btn: "Cancel",
        submit_btn: "Continue",
      },
    },
  },

  // account
  "account.profile": "Profile",
  "account.security": "Security",
  "account.api_keys": "API Keys",
  "account.danger": "Danger",

  // account profile
  "account.save": "Save",
  "account.avatar": "Avatar",
  "account.avatar.description":
    "Click on the avatar to upload a custom one from your files.",
  "account.avatar.message": "An avatar is optional but strongly recommended.",
  "account.name": "Name",
  "account.name.description": "Please enter your full name, or a display name.",
  "account.name.message": "Please use 32 characters at maximum.",
  "account.email": "Email",
  "account.email.description":
    "Enter the email address you want to use to log in.",
  "account.email.message": "Please enter a valid email address.",
  "account.session": "Sessions",
  "account.session.description":
    "Manage your active sessions and revoke access.",
  "account.session.current": "Current session",
  "account.session.revoke": "Revoke",
  "account.session.logout": "Sign Out",

  // account danger
  "account.delete": "Delete account",
  "account.delete.description":
    "Permanently remove your Personal Account and all of its contents. This action is not reversible, so please continue with caution.",
  "account.delete.confirm_title": "Are you absolutely sure?",
  "account.delete.confirm_description":
    "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  "account.delete.confirm_type": "Type 'DELETE' to confirm.",
  "account.delete.confirm_cancel": "Cancel",
  "account.delete.confirm_continue": "Continue",

  organization: {
    menu: "Organization",
    title: "Organization",
    description:
      "Manage organizations, members, and invitation links without affecting existing app flows.",
    no_active: {
      title: "No Active Organization",
      description:
        "Create your first organization or select one from the switcher to start collaborating.",
    },
    logo: {
      title: "Logo",
      description:
        "Upload a logo for your organization. Click to choose an image from your files.",
      upload: "Upload a logo",
      remove: "Remove logo",
      message: "A logo is optional but strongly recommended.",
    },
    name: {
      title: "Name",
      description:
        "Enter the full name of your organization, or a display name.",
      message: "Use a maximum of 32 characters.",
    },
    common: {
      save: "Save",
      cancel: "Cancel",
    },
    create: {
      title: "Create organization",
      description:
        "Create a new organization and automatically set it as active for your account.",
      open: "New Organization",
      name: "Name",
      slug: "Slug",
      logo: "Logo (optional)",
      logo_description: "Upload an organization logo.",
      logo_upload: "Upload logo",
      submit: "Create organization",
      hint: "Use lowercase slugs with dashes (for example: acme-inc).",
    },
    summary: {
      members: "{count} members",
    },
    switcher: {
      title: "Active organization",
      description:
        "Switch the active organization used by scoped organization APIs.",
      label: "Organization",
      placeholder: "Select an organization",
      submit: "Set active organization",
      current: "Current active organization selected.",
      none: "No active organization selected.",
      empty: {
        title: "No organizations yet",
        description:
          "Create your first organization to unlock member and invitation management.",
      },
    },
    members: {
      title: "Members",
      description: "Read-only list of members in the active organization.",
      me: "You",
      member: "Organization member",
      empty: {
        title: "No members",
        description: "This organization currently has no members.",
      },
    },
    invite: {
      title: "Invite members",
      description: "Invite users and share invitation links directly.",
      email: "Member email",
      role: "Role",
      role_member: "Member",
      role_admin: "Admin",
      submit: "Invite member",
      no_permission: "You can't invite members to this organization.",
      link_label: "Shareable invitation link",
      copy: "Copy link",
      pending: "Pending invitations",
      pending_empty: "No pending invitations.",
      cancel_title: "Cancel invitation?",
      cancel_description:
        "This will invalidate the invitation link for this user.",
      cancel_confirm: "Cancel invitation",
    },
    incoming: {
      title: "Incoming invitations",
      description:
        "Review and accept or reject invitations sent to your email.",
      from_link: "Invitation from URL",
      invalid_link:
        "The invitation in the URL is invalid, expired, or not addressed to your user.",
      accept: "Accept",
      reject: "Reject",
      empty: {
        title: "No invitations",
        description: "You have no pending organization invitations.",
      },
    },
    messages: {
      created: "Organization created.",
      active_set: "Active organization updated.",
      invited: "Invitation created successfully.",
      accepted: "Invitation accepted.",
      rejected: "Invitation rejected.",
      canceled: "Invitation canceled.",
      error: "Organization action failed.",
    },

    // delete
    delete: {
      title: "Delete Organization",
      description:
        "Remove your organization and all its contents permanently. This action cannot be reversed, so proceed with caution.",
      confirm_title: "Are you absolutely sure?",
      confirm_description:
        "This action cannot be undone. This will permanently delete your organization and remove your data from our servers.",
      confirm_type: "Type 'DELETE' to confirm.",
      confirm_cancel: "Cancel",
      confirm_continue: "Continue",
    },
  },

  // todo feature
  "todo.title": "Todo list",
  "todo.subtitle": "Manage your tasks efficiently",
  "todo.placeholder": "Add a new task...",
  "todo.add": "Add",
  "todo.filter": "Show completed",
  "todo.items#zero": "No todos",
  "todo.items#one": "One todo",
  "todo.items#other": "{count} todos",
} as const;
