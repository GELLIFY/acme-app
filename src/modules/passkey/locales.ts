/**
 * The messages of the passkey module, merged into the app's by
 * `src/modules/locales.ts` at `account.security.passkey`.
 */
export const passkey = {
  id: "auth.passkey",
  messages: {
    en: {
      account: {
        security: {
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
      },
    },
    it: {
      account: {
        security: {
          passkey: {
            title: "Passkeys",
            description:
              "Gestisci le tue passkey per un'autenticazione sicura e senza password.",
            info: "Scopri di più sulle passkey",
            new_btn: "Nuova Passkey",
            new_title: "Aggiungi Nuova Passkey",
            new_description:
              "Crea una nuova passkey per un'autenticazione sicura e senza password.",
            new_submit: "Aggiungi Passkey",
            created: "Creata il {value}",
            delete_title: "Sei assolutamente sicuro?",
            delete_decription:
              "Questa azione non può essere annullata. Questo eliminerà definitivamente la tua passkey.",
            delete_cancel: "Annulla",
            delete_confirm: "Elimina Passkey",

            empty: {
              title: "Nessuna Passkey",
              description:
                "Non hai ancora creato nessuna passkey. Inizia creando la tua prima passkey.",
            },
          },
        },
      },
    },
  },
} as const;
