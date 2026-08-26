export const CONTACT_INBOX = "yashwanthsi2011@gmail.com";

export type ContactFields = {
  name: string;
  email: string;
  message: string;
  honey?: string;
};

export function buildMailto(fields: ContactFields) {
  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`,
  );
  return `mailto:${CONTACT_INBOX}?subject=${subject}&body=${body}`;
}
