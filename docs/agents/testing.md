# Testing

- Use `pnpm test` (runs `bun test`).
- Prefer TDD for feature work and bug fixes when the expected behavior is clear.
- When using TDD, load the `tdd` skill and follow Red-Green-Refactor in vertical
  slices: one failing behavior test, the smallest implementation to pass, then
  refactor after green.
- Unit tests use `bun:test`.
- Database integration tests import the app database normally and rely on
  `src/tests/testing-db.ts` to mock it with in-memory PGlite, apply migrations
  before each test, seed a fixed test user, and reset state after each test.
- UI unit tests use Happy DOM and Testing Library helpers from
  `src/tests/happydom.ts`, `src/tests/testing-library.ts`, and
  `src/tests/test-utils.tsx`.
- For UI/UX work, run the dev server and test the changed flows by navigating
  the app with `agent-browser`; use the URL printed by `pnpm dev`.
- Fix failing tests or type errors before merge.
- Add or update tests near changed code where practical.
- Prefer the smallest relevant test type for the change.
- Test observable behavior through public interfaces, not implementation details.
- Don't write tests for what the type system already guarantees.
- Keep TypeScript strict: avoid `any`; prefer concrete types. Use `unknown` only
  at trust boundaries and narrow it immediately.
