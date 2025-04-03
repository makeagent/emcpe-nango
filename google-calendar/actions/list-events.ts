import type { NangoAction, GoogleCalendarEventsInput, GoogleCalendarEventList } from '../../models';

/**
 * Lists events from a specified calendar with optional filtering.
 * 
 * @param nango - The Nango SDK instance
 * @param input - Parameters for filtering events, including calendarId (required)
 * @returns A list of events and a nextPageToken if more results are available
 */
export default async function runAction(nango: NangoAction, input: GoogleCalendarEventsInput): Promise<GoogleCalendarEventList> {
  try {
    // Validate required input
    if (!input.calendarId) {
      throw new Error('calendarId is required');
    }

    // Set up the API request parameters
    const params: Record<string, string | number> = {};
    
    // Add optional parameters if provided
    if (input.timeMin) {
      params['timeMin'] = input.timeMin;
    } else {
      // Default to current time if not specified
      params['timeMin'] = new Date().toISOString();
    }
    
    if (input.timeMax) {
      params['timeMax'] = input.timeMax;
    }
    
    if (input.maxResults) {
      params['maxResults'] = input.maxResults;
    } else {
      params['maxResults'] = 100; // Default max results
    }
    
    if (input.pageToken) {
      params['pageToken'] = input.pageToken;
    }
    
    if (input.orderBy) {
      params['orderBy'] = input.orderBy;
    }
    
    if (input.q) {
      params['q'] = input.q;
    }
    
    if (input.singleEvents !== undefined) {
      // Convert boolean to string for the API
      params['singleEvents'] = input.singleEvents ? 'true' : 'false';
    } else {
      // Default to true to handle recurring events as individual instances
      params['singleEvents'] = 'true';
    }
    
    if (input.timeZone) {
      params['timeZone'] = input.timeZone;
    }
    
    // Make the API request
    const response = await nango.get({
      endpoint: `calendar/v3/calendars/${encodeURIComponent(input.calendarId)}/events`,
      params,
    });
    
    // Check for successful response
    if (response.status !== 200) {
      throw new Error(`Failed to list events: Status Code ${response.status}`);
    }
    
    // Format and return the response according to the model schema
    const events = (response.data.items || []).map((event: any) => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: {
        dateTime: event.start.dateTime,
        date: event.start.date,
        timeZone: event.start.timeZone
      },
      end: {
        dateTime: event.end.dateTime,
        date: event.end.date,
        timeZone: event.end.timeZone
      },
      status: event.status,
      creator: {
        id: event.creator.id,
        email: event.creator.email,
        displayName: event.creator.displayName,
        self: event.creator.self
      },
      organizer: {
        id: event.organizer.id,
        email: event.organizer.email,
        displayName: event.organizer.displayName,
        self: event.organizer.self
      },
      attendees: event.attendees ? event.attendees.map((attendee: any) => ({
        id: attendee.id,
        email: attendee.email,
        displayName: attendee.displayName,
        responseStatus: attendee.responseStatus,
        optional: attendee.optional,
        resource: attendee.resource,
        comment: attendee.comment
      })) : undefined,
      htmlLink: event.htmlLink,
      created: event.created,
      updated: event.updated,
      recurrence: event.recurrence
    }));
    
    return {
      events,
      nextPageToken: response.data.nextPageToken,
      timeZone: response.data.timeZone,
    };
  } catch (error) {
    console.error('Error listing Google Calendar events:', error);
    throw error;
  }
}
