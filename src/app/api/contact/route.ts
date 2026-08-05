import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!contactEmail) {
    return NextResponse.json(
      {
        error:
          "Contact form is not configured yet. Try again later or reach out on GitHub.",
      },
      { status: 503 },
    );
  }

  let body: { name?: string; email?: string; message?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(contactEmail)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `Portfolio message from ${name}`,
        _template: "table",
        _captcha: "false",
      }),
    },
  );

  let result: { success?: string; message?: string } = {};

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: result.message || "Failed to send message." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
