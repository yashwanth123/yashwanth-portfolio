import { connection } from "next/server";
import { resolveContactInbox } from "@/lib/contact";

export async function GET() {
  await connection();

  return Response.json(
    {
      contactEmail: resolveContactInbox(process.env.CONTACT_EMAIL),
      web3formsKey: process.env.WEB3FORMS_ACCESS_KEY || undefined,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
