import type { NangoAction, GmailListMessagesInput, GmailMessageList, GmailMessageMetadata } from '../../models';

export default async function runAction(
  nango: NangoAction,
  input: GmailListMessagesInput
): Promise<GmailMessageList> {
  try {
    const { maxResults = 10, labelIds, q, pageToken } = input;

    // Build query parameters
    const params: Record<string, any> = {
      maxResults
    };

    if (labelIds && labelIds.length > 0) {
      params['labelIds'] = labelIds.join(',');
    }

    if (q) {
      params['q'] = q;
    }

    if (pageToken) {
      params['pageToken'] = pageToken;
    }

    // Fetch messages list
    const response = await nango.proxy({
      method: 'GET',
      endpoint: '/gmail/v1/users/me/messages',
      params,
      retries: 3
    });

    // If no messages found, return empty array
    if (!response.data.messages) {
      return { messages: [] };
    }

    // Get message details for each message in the list
    const messages: GmailMessageMetadata[] = response.data.messages.map((msg: any) => ({
      id: msg.id,
      threadId: msg.threadId,
      labelIds: msg.labelIds || [],
      snippet: msg.snippet || ''
    }));

    return {
      messages,
      nextPageToken: response.data.nextPageToken
    };
  } catch (error: any) {
    console.error('Error listing Gmail messages:', error);git
    throw new Error(`Failed to list Gmail messages: ${error.message}`);
  }
}
