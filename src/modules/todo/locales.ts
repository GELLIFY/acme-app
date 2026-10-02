/**
 * The messages of the example module, merged into the app's by
 * `src/modules/locales.ts` at `todo`.
 */
export const todo = {
  id: "example",
  messages: {
    en: {
      todo: {
        title: "Todo list",
        subtitle: "Manage your tasks efficiently",
        placeholder: "Add a new task...",
        add: "Add",
        filter: "Show completed",
        "items#zero": "No todos",
        "items#one": "One todo",
        "items#other": "{count} todos",
      },
    },
    it: {
      todo: {
        title: "List todo",
        subtitle: "Gestisci i tuoi task in modo efficiente",
        placeholder: "Aggiungi un nuovo task...",
        add: "Aggiungi",
        filter: "Mostra completati",
        "items#zero": "Nessun todo",
        "items#one": "Un todo",
        "items#other": "{count} todo",
      },
    },
  },
} as const;
