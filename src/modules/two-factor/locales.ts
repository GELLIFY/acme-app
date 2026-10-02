/**
 * The messages of the two-factor module, merged into the app's by
 * `src/modules/locales.ts` at `account.security.two_factor`.
 */
export const twoFactor = {
  id: "auth.twoFactor",
  messages: {
    en: {
      account: {
        security: {
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
        },
      },
    },
    it: {
      account: {
        security: {
          two_factor: {
            title: "Autenticazione a 2 fattori",
            description:
              "Gestisci l’autenticazione a due fattori per proteggere ulteriormente il tuo account.",
            info: "Scopri di più sulla 2FA",
            enable: "Abilita 2FA",
            disable: "Disabilita 2FA",
            code_fld: "Codice di verifica",
            qr_msg:
              "Scansiona questo codice QR con la tua app di autenticazione e inserisci il codice di verifica qui sotto",
            code_msg:
              "Inserisci il codice a 6 cifre dalla tua app di autenticazione.",
            verify: "Verifica",
            backup_msg:
              "Salva questi codici di backup in un luogo sicuro. Puoi usarli per accedere al tuo account.",
            download: "Scarica",
            copy: "Copia",
            done: "Fine",
            status: {
              enabled_title: "Abilitata",
              disabled_title: "Disabilitata",
              enabled_description:
                "L'autenticazione a due fattori è attualmente abilitata per il tuo account.",
              disabled_description:
                "L'autenticazione a due fattori è attualmente disabilitata per il tuo account.",
            },
            access: {
              title: "Autenticazione a 2 fattori",
              description:
                "Inserisci un codice a 6 cifre dalla tua app di autenticazione, oppure usa un codice di backup se non puoi accedere all'app.",
              app_tab: "App Autenticazione",
              backup_tab: "Codici di Backup",
            },
            backup_code_form: {
              code_fld: "Codici di Backup",
              submit_btn: "Verifica",
              error: "Verifica del codice non riuscita",
            },
          },
        },
      },
    },
  },
} as const;
