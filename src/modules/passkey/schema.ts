import {
  passkeyRelations,
  passkey as passkeyTable,
  userPasskeyRelations,
} from "./tables";

export const passkey = {
  id: "auth.passkey",
  tables: {
    passkey: passkeyTable,
    passkeyRelations,
    userPasskeyRelations,
  },
} as const;
