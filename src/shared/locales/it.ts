export default {
  // home page
  "home.welcome": "Benvenuto {name}!",
  "home.doc": "Leggi la documentazione",

  // auth
  "auth.account": "Hai già un account?",
  "auth.no_account": "Non hai ancora un account?",
  "auth.signin.title": "Accedi",
  "auth.signin.subtitle": "Inserisci i dati per accedere al tuo account",
  "auth.signin.forgot": "Password dimenticata?",
  "auth.signin.submit": "Accedi",
  "auth.signup.title": "Registrati",
  "auth.signup.subtitle": "Inserisci le tue info per creare un account",
  "auth.signup.submit": "Registrati",
  "auth.forgot.title": "Password dimenticata",
  "auth.forgot.subtitle": "Inserisci la tua email per resettare la password",
  "auth.forgot.submit": "Invia link di reset",
  "auth.reset.title": "Reset password",
  "auth.reset.subtitle": "Crea e confera la tua nuova password",
  "auth.reset.submit": "Resetta password",
  "auth.reset.error": "Link invalido",
  "auth.reset.invalid": "Il link usato è invalido o scaduto",
  "auth.reset.back": "Torna al login",

  // account
  "account.profile": "Profilo",
  "account.security": "Sicurezza",
  "account.sessions": "Sessioni",
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
        title: "Autenticazione a due fattori",
        description:
          "Abilita o disabilita la 2FA per aggiungere un ulteriore livello di sicurezza.",
        enabled: "Abilitata",
        disabled: "Disabilitata",
        enable: "Abilita 2FA",
        disable: "Disabilita 2FA",
        code_fld: "Codice",
        code_msg:
          "Scansiona questo codice QR con la tua app di autenticazione e inserisci il codice qui sotto:",
        verify: "Verifica",
      },
    },
  },

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
