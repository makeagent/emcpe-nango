import type { NangoAction, TwitterPostOutput, TwitterPostInput } from '../../models';

export default async function runAction(nango: NangoAction, input: TwitterPostInput): Promise<TwitterPostOutput> {
    const { text, reply_to, quote } = input;

    // Validate required fields
    if (!text || text.trim() === '') {
        throw new Error("Post text is required and cannot be empty");
    }

    // Check text length (Twitter's limit is 280 characters)
    if (text.length > 280) {
        throw new Error(`Post text exceeds the 280 character limit (current: ${text.length})`);
    }

    // Prepare the request payload
    const payload: Record<string, any> = {
        text
    };

    // Add reply_to if provided
    if (reply_to) {
        payload['reply'] = {
            in_reply_to_tweet_id: reply_to
        };
    }

    // Add quote if provided
    if (quote) {
        payload['quote_tweet_id'] = quote;
    }

    try {
        // Send the post using Twitter API v2
        const response = await nango.proxy({
            method: 'POST',
            endpoint: '/2/tweets',
            data: payload,
            retries: 3
        });

        console.log('Twitter API Response:', JSON.stringify(response.data, null, 2));

        // Handle the response format correctly
        const tweetData = response.data.data || {};
        
        // Return the created post details
        return {
            id: tweetData.id || 'unknown',
            text: tweetData.text || text,
            created_at: new Date().toISOString() // Twitter API doesn't return created_at in the response, so we use current time
        };
    } catch (error: any) {
        console.error('Twitter API Error:', error);
        // Handle errors
        throw new Error(`Failed to send Twitter post: ${error.message}`);
    }
}
