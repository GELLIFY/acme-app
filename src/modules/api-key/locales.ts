/**
 * The messages of the API key module, merged into the app's by
 * `src/modules/locales.ts` at `account.api_keys`.
 */
export const apiKey = {
  id: "auth.apiKey",
  messages: {
    en: {
      account: {
        api_keys: {
          tab: "API Keys",

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
    },
    it: {
      account: {
        api_keys: {
          tab: "Chiavi API",

          title: "Chiavi API",
          description: "Gestisci le tue chiavi API per un accesso sicuro.",
          message:
            "Genera chiavi API per accedere programmativamente al tuo account.",
          dialog_title: "Chiave API",
          dialog_description:
            "Per favore inserisci un nome univoco per la tua chiave API per distinguerla dalle altre.",
          name_fld: "Nome",
          expires_fld: "Scade",
          create_btn: "Crea Chiave",
          key_lbl: "Chiave API",
          key_msg:
            "Per favore copia la tua chiave API e conservala in un luogo sicuro. Per motivi di sicurezza non potremo mostrarla di nuovo.",
          done_btn: "Fatto",

          created: "Creata il {date}",
          expires: "Scade {distance}",

          expirations: {
            NO_EXPIRATION: "Nessuna scadenza",
            ONE_DAY: "1 giorno",
            SEVEN_DAYS: "7 giorni",
            ONE_MONTH: "1 mese",
            TWO_MONTHS: "2 mesi",
            THREE_MONTHS: "3 mesi",
            SIX_MONTHS: "6 mesi",
            ONE_YEAR: "1 anno",
          },

          empty: {
            title: "Nessuna chiave API",
            description:
              "Non hai ancora creato nessuna api key. Inizia creando la tua prima api key.",
          },

          delete: {
            title: "Sei assolutamente sicuro?",
            description:
              "Questa azione non può essere annullata. Questo eliminerà definitivamente la tua chiave API.",
            cancel_btn: "Annulla",
            submit_btn: "Continua",
          },
        },
      },
    },
  },
} as const;
