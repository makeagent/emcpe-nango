// postTweet.js
// Nango Action to post a tweet via Twitter API v2 using nango.proxy()

/**
 * @param {NangoAction} nango - Nango instance provided to the action
 * @param {Object} input - Input object with tweet content
 * @param {string} input.text - The text content of the tweet (max 280 characters)
 * @returns {Promise<Object>} - Response with tweet ID and text
 */
async function execute(nango, input) {
  // Input validation
  if (!input?.text) {
    throw new nango.ActionError(
      'Missing required input: "text" field is required to post a tweet.',
    );
  }

  try {
    // Use nango.proxy() to make the POST request
    const response = await nango.proxy({
      method: "POST",
      endpoint: "https://api.twitter.com/v2/tweets",
      data: {
        text: input.text,
      },
      headers: {
        "Content-Type": "application/json",
      },
      // No need to manually set Authorization header; nango.proxy() uses the connection's access token
    });

    // Return success response with tweet details
    return {
      success: true,
      tweet_id: response.data.data.id,
      text: response.data.data.text,
    };
  } catch (error) {
    // Throw a structured ActionError for better error handling
    throw new nango.ActionError({
      message: "Failed to post tweet",
      details: error.response?.data?.detail || error.message,
    });
  }
}

module.exports = { execute };
