export default {
  // home page
  "home.welcome": "Hello {name}!",
  "home.doc": "Read Documentation",

  // auth
  "auth.account": "Already have an account?",
  "auth.no_account": "Don't have an account?",
  "auth.signin.title": "Sign In",
  "auth.signin.subtitle": "Enter your email below to login to your account",
  "auth.signin.forgot": "Forgot your password?",
  "auth.signin.submit": "Login",
  "auth.signup.title": "Sign Up",
  "auth.signup.subtitle": "Enter your information to create an account",
  "auth.signup.submit": "Sign Up",
  "auth.forgot.title": "Forgot password",
  "auth.forgot.subtitle": "Enter your email to reset your password",
  "auth.forgot.submit": "Send reset link",
  "auth.reset.title": "Password reset",
  "auth.reset.subtitle": "Create and confirm your new password",
  "auth.reset.submit": "Reset password",
  "auth.reset.error": "Invalid reset link",
  "auth.reset.invalid": "The password reset link is invalid or expired",
  "auth.reset.back": "Back to login",

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

  // account security
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

      expires: {
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
