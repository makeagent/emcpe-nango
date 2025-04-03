import type { NangoAction, GmailMessage, GmailGetMessageInput } from '../../models';

export default async function runAction(nango: NangoAction, input: GmailGetMessageInput): Promise<GmailMessage> {
  try {
    const { id, format = 'full' } = input;

    if (!id) {
      throw new Error('Message ID is required');
    }

    // Fetch the message details
    const response = await nango.proxy({
      method: 'GET',
      endpoint: `/gmail/v1/users/me/messages/${id}`,
      params: { format },
      retries: 3
    });

    const message = response.data;

    // Extract useful headers if available
    const headers = message.payload?.headers || [];
    
    // Try to decode the body content if it exists
    let bodyContent = '';
    if (message.payload?.body?.data) {
      try {
        bodyContent = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
      } catch (e) {
        console.warn('Could not decode message body:', e);
      }
    }
    
    // Extract MIME type and filename if available
    const mimeType = message.payload?.mimeType;
    const filename = message.payload?.filename;
    
    // Extract attachment information if available
    const attachments: Array<{
      filename: string;
      mimeType: string;
      size: number;
      attachmentId?: string;
    }> = [];
    const extractAttachments = (part: any) => {
      if (part.body?.attachmentId) {
        attachments.push({
          filename: part.filename || 'attachment',
          mimeType: part.mimeType || 'application/octet-stream',
          size: part.body.size || 0,
          attachmentId: part.body.attachmentId
        });
      }
      
      // Check for nested parts
      if (part.parts && Array.isArray(part.parts)) {
        part.parts.forEach(extractAttachments);
      }
    };
    
    // Start extraction from the payload
    if (message.payload) {
      extractAttachments(message.payload);
    }
    
    // Transform the response to match our model
    return {
      id: message.id,
      threadId: message.threadId,
      labelIds: message.labelIds || [],
      snippet: message.snippet || '',
      payload: message.payload, // Keep the raw payload
      sizeEstimate: message.sizeEstimate,
      historyId: message.historyId,
      internalDate: message.internalDate,
      headers: headers,
      body: bodyContent,
      mimeType: mimeType,
      filename: filename,
      attachments: attachments.length > 0 ? attachments : []
    };
  } catch (error: any) {
    console.error('Error fetching Gmail message:', error);
    throw new Error(`Failed to fetch Gmail message: ${error.message}`);
  }
}
