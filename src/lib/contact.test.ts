import assert from "node:assert/strict";
import test from "node:test";
import {
  FALLBACK_CONTACT_EMAIL,
  isContactConfigured,
  loadRuntimeContactConfig,
  normalizeContactEmail,
  resolveContactInbox,
  submitContactMessage,
} from "./contact.ts";

test("resolveContactInbox repairs missing @ and falls back", () => {
  assert.equal(
    resolveContactInbox("yashwanthsi2011gmail.com"),
    "yashwanthsi2011@gmail.com",
  );
  assert.equal(resolveContactInbox("me@example.com"), "me@example.com");
  assert.equal(resolveContactInbox("not-an-email"), FALLBACK_CONTACT_EMAIL);
  assert.equal(resolveContactInbox(undefined), FALLBACK_CONTACT_EMAIL);
});

test("isContactConfigured is true when a fallback inbox exists", () => {
  assert.equal(isContactConfigured({}), true);
  assert.equal(isContactConfigured({ contactEmail: " " }), true);
  assert.equal(isContactConfigured({ web3formsKey: "abc" }), true);
});

test("normalizeContactEmail repairs inbox addresses missing @", () => {
  assert.equal(
    normalizeContactEmail("yashwanthsi2011gmail.com"),
    "yashwanthsi2011@gmail.com",
  );
  assert.equal(normalizeContactEmail("me@example.com"), "me@example.com");
  assert.equal(normalizeContactEmail("not-an-email"), undefined);
  assert.equal(normalizeContactEmail("gmail.com"), undefined);
});

test("loadRuntimeContactConfig uses the API payload when present", async () => {
  const result = await loadRuntimeContactConfig(async () =>
    Response.json({ contactEmail: "yashwanthsi2011gmail.com" }),
  );

  assert.deepEqual(result, {
    contactEmail: "yashwanthsi2011@gmail.com",
    web3formsKey: undefined,
  });
});

test("loadRuntimeContactConfig falls back when the API is down", async () => {
  const result = await loadRuntimeContactConfig(async () => {
    throw new Error("network");
  });

  assert.deepEqual(result, { contactEmail: FALLBACK_CONTACT_EMAIL });
});

test("submitContactMessage uses the fallback inbox when config is empty", async () => {
  let url = "";

  const result = await submitContactMessage(
    {},
    { name: "Ada", email: "ada@example.com", message: "Hello" },
    async (input) => {
      url = String(input);
      return Response.json({ success: "true" });
    },
  );

  assert.equal(
    url,
    `https://formsubmit.co/ajax/${encodeURIComponent(FALLBACK_CONTACT_EMAIL)}`,
  );
  assert.deepEqual(result, { ok: true });
});

test("honeypot submissions succeed without calling fetch", async () => {
  let called = false;
  const result = await submitContactMessage(
    { contactEmail: "me@example.com" },
    {
      name: "Ada",
      email: "ada@example.com",
      message: "Hello",
      honey: "bot",
    },
    async () => {
      called = true;
      return new Response("{}", { status: 200 });
    },
  );

  assert.deepEqual(result, { ok: true });
  assert.equal(called, false);
});

test("repairs a missing @ before posting to FormSubmit", async () => {
  let url = "";

  const result = await submitContactMessage(
    { contactEmail: "yashwanthsi2011gmail.com" },
    { name: "Ada", email: "ada@example.com", message: "Hello" },
    async (input) => {
      url = String(input);
      return Response.json({ success: "true" });
    },
  );

  assert.equal(
    url,
    "https://formsubmit.co/ajax/yashwanthsi2011%40gmail.com",
  );
  assert.deepEqual(result, { ok: true });
});

test("submits to FormSubmit from the provided inbox", async () => {
  let url = "";
  let body: Record<string, string> = {};

  const result = await submitContactMessage(
    { contactEmail: "me@example.com" },
    { name: "Ada", email: "ada@example.com", message: "Hello" },
    async (input, init) => {
      url = String(input);
      body = JSON.parse(String(init?.body));
      return Response.json({ success: "true" });
    },
  );

  assert.equal(url, "https://formsubmit.co/ajax/me%40example.com");
  assert.equal(body.name, "Ada");
  assert.equal(body._replyto, "ada@example.com");
  assert.deepEqual(result, { ok: true });
});

test("prefers Web3Forms when a key is present", async () => {
  let url = "";

  const result = await submitContactMessage(
    { contactEmail: "me@example.com", web3formsKey: "public-key" },
    { name: "Ada", email: "ada@example.com", message: "Hello" },
    async (input) => {
      url = String(input);
      return Response.json({ success: true });
    },
  );

  assert.equal(url, "https://api.web3forms.com/submit");
  assert.deepEqual(result, { ok: true });
});

test("surfaces FormSubmit activation as a dedicated failure", async () => {
  const result = await submitContactMessage(
    { contactEmail: "me@example.com" },
    { name: "Ada", email: "ada@example.com", message: "Hello" },
    async () =>
      Response.json({
        success: "false",
        message: "Make sure you activate your form first.",
      }),
  );

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.needsActivation, true);
    assert.match(result.error, /activation email/i);
  }
});

test("treats HTTP errors as send failures", async () => {
  const result = await submitContactMessage(
    { contactEmail: "me@example.com" },
    { name: "Ada", email: "ada@example.com", message: "Hello" },
    async () => new Response("<html>Just a moment...</html>", { status: 403 }),
  );

  assert.deepEqual(result, {
    ok: false,
    error: "Failed to send message. Please try again.",
  });
});

test("does not leak a malformed inbox in FormSubmit errors", async () => {
  const result = await submitContactMessage(
    { contactEmail: "me@example.com" },
    { name: "Ada", email: "ada@example.com", message: "Hello" },
    async () =>
      Response.json({
        success: "false",
        message: "Email address me@example.com is not formatted correctly.",
      }),
  );

  assert.deepEqual(result, {
    ok: false,
    error: "Failed to send message. Please try again.",
  });
});
