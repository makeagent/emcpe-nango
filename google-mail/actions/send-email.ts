import type { NangoAction, GmailSendEmailOutput, GmailSendEmailInput } from '../../models';

export default async function runAction(nango: NangoAction, input: GmailSendEmailInput): Promise<GmailSendEmailOutput> {
  try {
    const { to, subject, body, from, cc, bcc, attachments } = input;

    // Validate recipient
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      throw new Error('Invalid or missing recipient email address');
    }

    // Build email headers
    const headers = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0'
    ];

    // Add optional headers
    if (from) headers.push(`From: ${from}`);
    if (cc) headers.push(`Cc: ${cc}`);
    if (bcc) headers.push(`Bcc: ${bcc}`);

    // Simple email without attachments
    if (!attachments || attachments.length === 0) {
      headers.push('Content-Type: text/plain; charset=UTF-8');
      
      const email = [
        ...headers,
        '',
        body || ''
      ].join('\n');

      const base64EncodedEmail = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send email via Gmail API
      const response = await nango.proxy({
        method: 'POST',
        endpoint: '/gmail/v1/users/me/messages/send',
        data: {
          raw: base64EncodedEmail
        },
        retries: 3
      });

      return {
        id: response.data.id,
        threadId: response.data.threadId,
        labelIds: response.data.labelIds || []
      };
    } else {
      // For emails with attachments, we would need to implement multipart MIME
      // This is a simplified version - in a real implementation, you'd need to handle
      // multipart MIME properly with boundaries
      throw new Error('Attachments are not supported in this implementation');
    }
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
