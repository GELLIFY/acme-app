export default {
  // home page
  "home.welcome": "Benvenuto {name}!",
  "home.doc": "Leggi la documentazione",

  // auth

  auth: {
    already_have_account: "Hai già un account?",
    no_account: "Non hai ancora un account?",

    signup: {
      title: "Registrati",
      subtitle: "Inserisci le tue info per creare un account",
      first_name_fld: "Nome",
      last_name_fld: "Cognome",
      email_fld: "Email",
      password_fld: "Password",
      password_confirmation_fld: "Conferma password",
      image_fld: "Immagine di profilo (opzionale)",
      submit_btn: "Registrati",
    },

    signin: {
      title: "Accedi",
      subtitle: "Inserisci i dati per accedere al tuo account",
      email_fld: "Email",
      password_fld: "Password",
      forgot_link: "Password dimenticata?",
      submit_btn: "Accedi",
    },

    forgot_password: {
      title: "Password dimenticata",
      subtitle: "Inserisci la tua email per resettare la password",
      back_btn: "Torna al login",
      email_fld: "Email",
      submit_btn: "Invia link di reset",
    },

    reset_password: {
      invalid_link_title: "Link invalido",
      invalid_link_description: "Il link usato è invalido o scaduto",
      title: "Reset password",
      subtitle: "Crea e confera la tua nuova password",
      back_btn: "Torna al login",
      password_fld: "Password",
      password_confirmation_fld: "Conferma password",
      submit_btn: "Resetta password",
    },
  },

  account: {
    security: {
      change_password: {
        title: "Cambia password",
        description: "Aggiorna la tua password per una maggiore sicurezza.",
        message: "La nuova password deve essere diversa",
        current_password_fld: "Password attuale",
        new_password_fld: "Nuova password",
        new_password_msg: "Deve essere lunga almeno 8 caratteri.",
        revoke_fld: "Disconnetti le altre sessioni",
        submit: "Salva",
      },

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

    api_keys: {
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

  // account
  "account.profile": "Profilo",
  "account.security": "Sicurezza",
  "account.api_keys": "Chiavi API",
  "account.danger": "Pericolo",

  // account profile
  "account.save": "Salva",
  "account.avatar": "Avatar",
  "account.avatar.description":
    "Clicca sull'avatar per caricarne uno personalizzato dai tuoi file.",
  "account.avatar.message": "Un avatar è opzionale ma fortemente consigliato.",
  "account.name": "Nome",
  "account.name.description":
    "Inserisci il tuo nome completo, oppure un nome visualizzato.",
  "account.name.message": "Utilizza un massimo di 32 caratteri.",
  "account.email": "Email",
  "account.email.description":
    "Inserisci l'indirizzo email che vuoi usare per accedere.",
  "account.email.message": "Per favore inserisci un indirizzo email valido.",
  "account.session": "Sessioni",
  "account.session.description":
    "Gestisci le tue sessioni attive e revoca l'accesso.",
  "account.session.current": "Session corrente",
  "account.session.revoke": "Revoca",
  "account.session.logout": "Esci",

  // account danger
  "account.delete": "Elimina account",
  "account.delete.description":
    "Rimuovi definitivamente il tuo account personale e tutti i suoi contenuti. Questa azione non è reversibile, quindi procedi con cautela.",
  "account.delete.confirm_title": "Sei assolutamente sicuro?",
  "account.delete.confirm_description":
    "Questa azione non può essere annullata. Questo eliminerà definitivamente il tuo account e rimuoverà i tuoi dati dai nostri server.",
  "account.delete.confirm_type": "Digita 'DELETE' per confermare.",
  "account.delete.confirm_cancel": "Annulla",
  "account.delete.confirm_continue": "Continua",

  // todo feature
  "todo.title": "List todo",
  "todo.subtitle": "Gestisci i tuoi task in modo efficiente",
  "todo.placeholder": "Aggiungi un nuovo task...",
  "todo.add": "Aggiungi",
  "todo.filter": "Mostra completati",
  "todo.items#zero": "Nessun todo",
  "todo.items#one": "Un todo",
  "todo.items#other": "{count} todo",
} as const;
