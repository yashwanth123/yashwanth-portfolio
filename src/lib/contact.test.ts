import assert from "node:assert/strict";
import test from "node:test";
import { buildMailto, CONTACT_INBOX } from "./contact.ts";

test("buildMailto uses the hardcoded inbox and encodes the message", () => {
  const href = buildMailto({
    name: "Ada",
    email: "ada@example.com",
    message: "Hello there",
  });

  assert.equal(href.startsWith(`mailto:${CONTACT_INBOX}?`), true);
  assert.equal(href.includes("subject="), true);
  assert.equal(decodeURIComponent(href).includes("Ada"), true);
  assert.equal(decodeURIComponent(href).includes("ada@example.com"), true);
  assert.equal(decodeURIComponent(href).includes("Hello there"), true);
});
