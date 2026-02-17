import { describe, expect, it } from "bun:test";
import { buildInvitationUrl } from "./utils";

describe("organization utils", () => {
  it("builds shareable invitation urls", () => {
    expect(
      buildInvitationUrl("http://localhost:3000", "/en/organization", "inv_1"),
    ).toBe("http://localhost:3000/en/organization?invite=inv_1");
  });
});
