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

  // account
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

  // users feature
  "users.fallback": "Caricamento degli utenti...",
  "users.table.n_items": "Utenti per pagina:",
  "users.table.showing_range":
    "Stai visualizzando {start}-{end} di {max} utenti",
  "users.table.previous": "Precedente",
  "users.table.next": "Successivo",
  "users.filter_by_name_email": "Cerca per nome o email...",
  "users.table.avatar": "Avatar",
  "users.table.name": "Nome",
  "users.table.email": "Email",
  "users.table.verified": "Email Verificata",
  "users.table.created_at": "Creato il",
  "users.verified": "Verificato",
  "users.not_verified": "Non Verificato",

  // tasks feature
  "tasks.fallback": "Caricamento dei tasks...",
  "tasks.new_task": "Nuovo task",
  "tasks.filter_by_name": "Filtra tasks...",
  "tasks.filter_by_status": "Stato",
  "tasks.filter_by_priority": "Priorità",
  "tasks.add": "Aggiungi",
  "tasks.delete": "Elimina",
  "tasks.delete.success": "Task eliminato con successo.",
  "tasks.edit": "Modifica",
  "tasks.confirm_delete": "Sei sicuro di voler eliminare questo task?",
  "tasks.save": "Salva",
  "tasks.create": "Crea",
  "tasks.confirm": "Conferma",
  "tasks.cancel": "Annulla",
  "tasks.task_assigned_successfully": "Task assegnato con successo",
  "tasks.task_assignment_failed": "Assegnazione del task fallita",
  // tasks table feature
  "tasks.table.task": "Task",
  "tasks.table.title": "Titolo",
  "tasks.table.assigned_user": "Utente Assegnato",
  "tasks.table.planning_status": "Stato",
  "tasks.table.priority": "Priorità",
  "tasks.table.n_items": "Task per pagina",
  "tasks.table.showing_range":
    "Stai visualizzando {start}-{end} di {max} elementi",
  "tasks.table.previous": "Pagina precedente",
  "tasks.table.next": "Pagina successiva",
  // tasks form feature
  "tasks.form.create_task": "Crea Task",
  "tasks.form.edit_task": "Modifica Task",
  "tasks.form.edit_description": "Modifica i dettagli del task qui sotto.",
  "tasks.form.assignee": "Assegnato a",
  "tasks.form.placeholder_user": "Assegna a...",
  "tasks.form.no_user_assigned": "Nessun utente assegnato",
  "tasks.form.assign_user_description":
    "Assegna questo task a un utente esistente.",
  "tasks.form.title": "Titolo",
  "tasks.form.placeholder_title": "Titolo del task",
  "tasks.form.created_at": "Creato il: {date}",
  "tasks.form.updated_at": "Aggiornato il: {date}",
  "tasks.form.workflow_status": "Avanzamento",
  "tasks.form.planning_status": "Pianificazione",
  "tasks.form.priority": "Priorità",
} as const;
