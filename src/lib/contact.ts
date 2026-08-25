export type ContactConfig = {
  contactEmail?: string;
  web3formsKey?: string;
};

export type ContactFields = {
  name: string;
  email: string;
  message: string;
  honey?: string;
};

export type ContactSubmitResult =
  | { ok: true }
  | { ok: false; error: string; needsActivation?: boolean };

type ProviderResponse = {
  success?: boolean | string;
  message?: string;
};

function isTruthySuccess(success: ProviderResponse["success"]) {
  return success === true || success === "true";
}

function isFalsySuccess(success: ProviderResponse["success"]) {
  return success === false || success === "false";
}

function looksLikeActivation(message: string) {
  return /activat/i.test(message);
}

async function parseProviderResponse(
  response: Response,
): Promise<ProviderResponse> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return (await response.json()) as ProviderResponse;
    } catch {
      return {};
    }
  }

  try {
    const text = await response.text();
    if (text.trim().startsWith("{")) {
      return JSON.parse(text) as ProviderResponse;
    }
  } catch {
    return {};
  }

  return {};
}

async function postJson(
  url: string,
  body: Record<string, string>,
  fetchImpl: typeof fetch,
) {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await parseProviderResponse(response);
  return { response, result };
}

function toSubmitResult(
  response: Response,
  result: ProviderResponse,
  fallback: string,
): ContactSubmitResult {
  const message = result.message?.trim() || fallback;

  if (looksLikeActivation(message)) {
    return {
      ok: false,
      needsActivation: true,
      error:
        "Please confirm the activation email from FormSubmit, then send your message again.",
    };
  }

  if (!response.ok || isFalsySuccess(result.success)) {
    return { ok: false, error: message };
  }

  if (isTruthySuccess(result.success) || response.ok) {
    return { ok: true };
  }

  return { ok: false, error: message };
}

export function isContactConfigured(config: ContactConfig) {
  return Boolean(config.web3formsKey?.trim() || config.contactEmail?.trim());
}

export async function submitContactMessage(
  config: ContactConfig,
  fields: ContactFields,
  fetchImpl: typeof fetch = fetch,
): Promise<ContactSubmitResult> {
  if (fields.honey?.trim()) {
    return { ok: true };
  }

  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Name, email, and message are required." };
  }

  const web3formsKey = config.web3formsKey?.trim();
  const contactEmail = config.contactEmail?.trim();

  if (web3formsKey) {
    const { response, result } = await postJson(
      "https://api.web3forms.com/submit",
      {
        access_key: web3formsKey,
        name,
        email,
        message,
        subject: `Portfolio message from ${name}`,
        from_name: name,
        replyto: email,
      },
      fetchImpl,
    );

    return toSubmitResult(
      response,
      result,
      "Failed to send message. Please try again.",
    );
  }

  if (contactEmail) {
    const { response, result } = await postJson(
      `https://formsubmit.co/ajax/${encodeURIComponent(contactEmail)}`,
      {
        name,
        email,
        message,
        _replyto: email,
        _subject: `Portfolio message from ${name}`,
        _template: "table",
        _captcha: "false",
      },
      fetchImpl,
    );

    return toSubmitResult(
      response,
      result,
      "Failed to send message. Please try again.",
    );
  }

  return {
    ok: false,
    error:
      "Contact form is not configured yet. Try again later or reach out on GitHub.",
  };
}
