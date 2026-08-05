import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { error: "Contact form is not configured yet." },
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

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      name,
      email,
      message,
      subject: `Portfolio message from ${name}`,
    }),
  });

  const result = (await response.json()) as { success?: boolean; message?: string };

  if (!response.ok || !result.success) {
    return NextResponse.json(
      { error: result.message || "Failed to send message." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
