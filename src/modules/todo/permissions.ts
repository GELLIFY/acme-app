/**
 * The `todo` resource of the access control, granted in full to both roles.
 * `apiKey` is what a new API key may do with it (`src/modules/api-key/auth.ts`).
 */
export const todo = {
  id: "example",
  statements: { todo: ["create", "list", "update", "delete"] },
  grants: {
    user: { todo: ["create", "list", "update", "delete"] },
    admin: { todo: ["create", "list", "update", "delete"] },
    apiKey: { todo: ["create"] },
  },
} as const;
