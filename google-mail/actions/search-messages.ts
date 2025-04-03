import type { NangoAction, GmailMessageList, GmailSearchMessagesInput, GmailMessageMetadata } from '../../models';

export default async function runAction(nango: NangoAction, input: GmailSearchMessagesInput): Promise<GmailMessageList> {
  try {
    const { q, maxResults = 10, labelIds, pageToken } = input;

    if (!q) {
      throw new Error('Search query is required');
    }

    // Build query parameters
    const params: Record<string, any> = {
      q,
      maxResults
    };

    if (labelIds && labelIds.length > 0) {
      params['labelIds'] = labelIds.join(',');
    }

    if (pageToken) {
      params['pageToken'] = pageToken;
    }

    // Search for messages
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

    // Get message metadata for each message in the search results
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
    console.error('Error searching Gmail messages:', error);
    throw new Error(`Failed to search Gmail messages: ${error.message}`);
  }
}
