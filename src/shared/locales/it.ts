import { localeModules } from "@/modules/locales";
import { messagesWith } from "@/modules/registry";

const base = {
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
    },
  },

  // account
  "account.profile": "Profilo",
  "account.security": "Sicurezza",
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
} as const;

export default messagesWith(base, localeModules, "it");
