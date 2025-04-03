import type {
  GmailReplyDraftInput,
  GmailReplyDraftOutput,
  NangoAction,
} from "../../models";

export default async function runAction(
  nango: NangoAction,
  input: GmailReplyDraftInput,
): Promise<GmailReplyDraftOutput> {
  const {
    sender,
    subject,
    body,
    threadId,
    messageId,
    references,
    date,
    replyBody,
  } = input;

  const to = sender;
  const replySubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;
  const decodedBody = Buffer.from(body, "base64").toString("utf8");
  const decodedReply = Buffer.from(replyBody, "base64").toString("utf8");

  // Detect if decodedBody is HTML (basic heuristic)
  const isHtml = decodedBody.trim().startsWith("<") &&
    decodedBody.includes("</");

  // HTML-formatted reply: use decodedBody as-is if HTML, else wrap plain text
  const htmlBody = `
  <html>
    <body>
      ${decodedReply}
      <br><br>
      <div style="color: #888888">
        <p>On ${new Date(date).toLocaleString()}, ${sender} wrote:</p>
        <blockquote style="margin-left: 1em; padding-left: 1em; border-left: 1px solid #ccc;">
          ${
    isHtml
      ? decodedBody
      : `<pre>${
        decodedBody.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(
          />/g,
          "&gt;",
        )
      }</pre>`
  }
        </blockquote>
      </div>
    </body>
  </html>
`;

  // Plain text version: quote decodedBody only if it exists
  const plainTextBody = [
    decodedReply,
    "",
    `On ${new Date(date).toLocaleString()}, ${sender} wrote:`,
    ...(isHtml
      ? ["> [HTML content]"]
      : decodedBody
      ? decodedBody.split("\n").map((line) => `> ${line}`)
      : []),
  ].filter((line) => line !== "").join("\n");

  // MIME formatted email (rest remains unchanged)
  const email = [
    `To: ${to}`,
    `In-Reply-To: ${messageId}`,
    `References: ${references ? `${references} ${messageId}` : messageId}`,
    `Subject: ${replySubject}`,
    "MIME-Version: 1.0",
    'Content-Type: multipart/alternative; boundary="boundary-string"',
    "",
    "--boundary-string",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    plainTextBody,
    "",
    "--boundary-string",
    "Content-Type: text/html; charset=UTF-8",
    "",
    htmlBody,
    "--boundary-string--",
  ].join("\n");

  const base64EncodedEmail = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const draftResponse = await nango.proxy({
    method: "POST",
    endpoint: "/gmail/v1/users/me/drafts",
    data: {
      message: {
        raw: base64EncodedEmail,
        threadId,
      },
    },
    retries: 10,
  });

  return {
    id: draftResponse.data.id,
    threadId: draftResponse.data.message?.threadId || null,
  };
}
