import type { NangoAction, GoogleCalendarList } from '../../models';

/**
 * Lists all calendars available to the authenticated user.
 * 
 * @param nango - The Nango SDK instance
 * @param input - Optional parameters for pagination
 * @returns A list of calendars and a nextPageToken if more results are available
 */
export default async function runAction(nango: NangoAction, input: any = {}): Promise<GoogleCalendarList> {
  try {
    // Set up the API request parameters
    const params: Record<string, string | number> = {};
    
    // Add optional parameters if provided
    if (input.pageToken) {
      params['pageToken'] = input.pageToken;
    }
    
    if (input.maxResults) {
      params['maxResults'] = input.maxResults;
    } else {
      params['maxResults'] = 100; // Default max results
    }
    
    if (input.showHidden !== undefined) {
      // Convert boolean to string for the API
      params['showHidden'] = input.showHidden ? 'true' : 'false';
    }
    
    if (input.minAccessRole) {
      params['minAccessRole'] = input.minAccessRole;
    }
    
    // Make the API request
    const response = await nango.get({
      endpoint: 'calendar/v3/users/me/calendarList',
      params,
    });
    
    // Check for successful response
    if (response.status !== 200) {
      throw new Error(`Failed to list calendars: Status Code ${response.status}`);
    }
    
    // Format and return the response according to the model schema
    const calendars = (response.data.items || []).map((calendar: any) => ({
      id: calendar.id,
      summary: calendar.summary,
      description: calendar.description,
      location: calendar.location,
      timeZone: calendar.timeZone,
      accessRole: calendar.accessRole,
      primary: !!calendar.primary,
      backgroundColor: calendar.backgroundColor,
      foregroundColor: calendar.foregroundColor
    }));
    
    return {
      calendars,
      nextPageToken: response.data.nextPageToken,
    };
  } catch (error) {
    console.error('Error listing Google Calendars:', error);
    throw error;
  }
}
