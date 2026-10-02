/**
 * The messages of the organization module, merged into the app's by
 * `src/modules/locales.ts` at `organization`.
 */
export const organization = {
  id: "auth.organization",
  messages: {
    en: {
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
          placeholder: "Acme Inc.",
          message: "Use a maximum of 32 characters.",
          updated: "Organization updated.",
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
          name_label: "Organization name",
          name_placeholder: "Acme Inc.",
          slug: "Slug",
          slug_label: "Organization slug",
          slug_placeholder: "acme-inc",
          slug_taken: "This slug is already in use. Choose another one.",
          logo: "Logo (optional)",
          logo_description: "Upload an organization logo.",
          logo_upload: "Upload logo",
          submit: "Create organization",
          hint: "Use at least 3 characters, lowercase letters, and dashes (for example: acme-inc).",
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
          table_member: "Member",
          table_role: "Role",
          open_menu: "Open menu",
          actions: "Actions",
          delete: "Delete",
          "description#zero": "No members yet. Start inviting your team.",
          "description#one":
            "You're the first person in this organization. Start inviting your team.",
          "description#other":
            "Read-only list of members in the active organization.",
          me: "You",
          member: "Organization member",
          role_placeholder: "Select role",
          removed: "Member removed.",
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
          pending_empty_description:
            "Invite your team to collaborate on this project.",
          pending_invite_btn: "Invite Members",
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
          btn: "Delete",
          confirm_title: "Are you absolutely sure?",
          confirm_description:
            "This action cannot be undone. This will permanently delete your organization and remove your data from our servers.",
          confirm_type: "Type 'DELETE' to confirm.",
          confirm_email:
            "A confirmation email has been sent to your address. Please check your inbox to confirm organization deletion.",
          confirm_cancel: "Cancel",
          confirm_continue: "Continue",
        },
      },
    },
    it: {
      organization: {
        menu: "Organizzazione",
        title: "Organizzazioni",
        description:
          "Creata una nuova organizzazione per collaborare con il tuo team.",
        no_active: {
          title: "Nessuna organizzazione attiva",
          description:
            "Crea la tua prima organizzazione o selezionane una dallo switcher.",
        },
        logo: {
          title: "Logo",
          description:
            "Carica un logo per l'organizzazione. Clicca per scegliere un immagine tra i tuoi file.",
          upload: "Carica logo",
          remove: "Rimuovi logo",
          message: "Un logo è opzionale ma fortemente consigliato.",
        },
        name: {
          title: "Nome",
          description:
            "Inserisci il nome completo dell'organizzazione, oppure un nome visualizzato.",
          placeholder: "Acme Inc.",
          message: "Utilizza un massimo di 32 caratteri.",
          updated: "Organizzazione aggiornata.",
        },
        common: {
          save: "Salva",
          cancel: "Annulla",
        },
        create: {
          title: "Crea organizzazione",
          description:
            "Crea una nuova organizzazione per collaborare con il tuo team.",
          open: "Nuova Organizzazione",
          name: "Nome",
          name_label: "Nome organizzazione",
          name_placeholder: "Acme Inc.",
          slug: "Slug",
          slug_label: "Slug organizzazione",
          slug_placeholder: "acme-inc",
          slug_taken: "Questo slug e' gia in uso. Scegline uno diverso.",
          logo: "Logo (opzionale)",
          logo_description: "Recommended size 1:1, up to 1MB.",
          logo_upload: "Carica logo",
          submit: "Crea organizzazione",
          hint: "Usa almeno 3 caratteri, minuscole e trattini (esempio: acme-inc).",
        },
        summary: {
          members: "{count} membri",
        },
        switcher: {
          title: "Organization attiva",
          description:
            "Cambia la organization attiva usata dalle API organization-scoped.",
          label: "Organizzazioni",
          placeholder: "Personal",
          submit: "Imposta organization attiva",
          current: "Organization attiva selezionata.",
          none: "Nessuna organization attiva selezionata.",
          empty: {
            title: "Nessuna organization",
            description:
              "Crea la tua prima organization per gestire membri e inviti.",
          },
        },
        members: {
          title: "Membri",
          table_member: "Membro",
          table_role: "Ruolo",
          open_menu: "Apri menu",
          actions: "Azioni",
          delete: "Elimina",
          "description#zero":
            "Nessun membro ancora. Inizia a invitare il tuo team.",
          "description#one":
            "Sei la prima persona in questa organizzazione. Inizia a invitare il tuo team.",
          "description#other":
            "Lista in sola lettura dei membri dell'organizzazione attiva.",
          me: "Tu",
          member: "Membro organizzazione",
          role_placeholder: "Seleziona ruolo",
          removed: "Membro rimosso.",
          empty: {
            title: "Nessun membro",
            description: "Questa organizzazione non ha ancora membri.",
          },
        },
        invite: {
          title: "Invita membri",
          description:
            "Invita utenti e condividi direttamente il link di invito.",
          email: "Email membro",
          role: "Ruolo",
          role_member: "Membro",
          role_admin: "Admin",
          submit: "Invita membro",
          no_permission: "Non puoi invitare membri in questa organizzazione.",
          link_label: "Link invito condivisibile",
          copy: "Copia link",
          pending: "Inviti in sospeso",
          pending_empty: "Nessun invito in sospeso.",
          pending_empty_description:
            "Invita il tuo team a collaborare su questo progetto.",
          pending_invite_btn: "Invita Membri",
          cancel_title: "Annullare l'invito?",
          cancel_description:
            "Questo invaliderà il link di invito per questo utente.",
          cancel_confirm: "Annulla invito",
        },
        incoming: {
          title: "Inviti ricevuti",
          description:
            "Controlla e accetta o rifiuta gli inviti ricevuti sulla tua email.",
          from_link: "Invito da URL",
          invalid_link:
            "L'invito nell'URL non è valido, è scaduto, o non è destinato al tuo utente.",
          accept: "Accetta",
          reject: "Rifiuta",
          empty: {
            title: "Nessun invito",
            description: "Non hai inviti organization pendenti.",
          },
        },
        messages: {
          created: "Organization creata.",
          active_set: "Organization attiva aggiornata.",
          invited: "Invito creato con successo.",
          accepted: "Invito accettato.",
          rejected: "Invito rifiutato.",
          canceled: "Invito annullato.",
          error: "Azione organization non riuscita.",
        },

        // delete
        delete: {
          title: "Elimina organizzazione",
          description:
            "Rimuovi definitivamente l'organizzazione e tutti i suoi contenuti. Questa azione non è reversibile, quindi procedi con cautela.",
          btn: "Elimina",
          confirm_title: "Sei assolutamente sicuro?",
          confirm_description:
            "Questa azione non può essere annullata. Questo eliminerà definitivamente l'organizzazione e rimuoverà i dati dai nostri server.",
          confirm_type: "Digita 'DELETE' per confermare.",
          confirm_email:
            "Un'email di conferma è stata inviata al tuo indirizzo. Controlla la tua casella di posta per confermare l'eliminazione dell'organizzazione.",
          confirm_cancel: "Annulla",
          confirm_continue: "Continua",
        },
      },
    },
  },
} as const;
