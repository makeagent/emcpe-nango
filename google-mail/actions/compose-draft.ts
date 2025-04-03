import type {
  GmailDraftInput,
  GmailDraftOutput,
  NangoAction,
} from "../../models";

export default async function runAction(
  nango: NangoAction,
  input: GmailDraftInput,
): Promise<GmailDraftOutput> {
  const { recipient, subject, body } = input;

  // Validate recipient
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    throw new Error("Invalid or missing recipient email address");
  }

  // Simple MIME email structure
  const email = [
    `To: ${recipient}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body || "",
  ].join("\n");

  const base64EncodedEmail = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  // Create draft via Gmail API
  const draftResponse = await nango.proxy({
    method: "POST",
    endpoint: "/gmail/v1/users/me/drafts",
    data: {
      message: {
        raw: base64EncodedEmail,
      },
    },
    retries: 10,
  });

  return {
    id: draftResponse.data.id,
    threadId: draftResponse.data.message?.threadId || null,
  };
}
