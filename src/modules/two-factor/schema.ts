import {
  twoFactorRelations,
  twoFactor as twoFactorTable,
  userTwoFactorRelations,
} from "./tables";

export const twoFactor = {
  id: "auth.twoFactor",
  tables: {
    twoFactor: twoFactorTable,
    twoFactorRelations,
    userTwoFactorRelations,
  },
} as const;
