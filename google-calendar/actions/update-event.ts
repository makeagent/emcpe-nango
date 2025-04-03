import type { NangoAction, GoogleCalendarEventOutput, GoogleCalendarEventUpdateInput } from '../../models';

export default async function runAction(nango: NangoAction, input: GoogleCalendarEventUpdateInput): Promise<GoogleCalendarEventOutput> {
    const { eventId, summary, description, location, start, end, attendees, timeZone, sendUpdates } = input;

    // Validate required fields
    if (!eventId) {
        throw new Error("Event ID is required");
    }

    // Prepare the event object with only the fields that are provided
    const event: Record<string, any> = {};

    if (summary !== undefined) {
        event['summary'] = summary;
    }

    if (description !== undefined) {
        event['description'] = description;
    }

    if (location !== undefined) {
        event['location'] = location;
    }

    // Format start time if provided
    if (start !== undefined) {
        event['start'] = {
            dateTime: start,
            timeZone: timeZone || 'UTC'
        };
    }

    // Format end time if provided
    if (end !== undefined) {
        event['end'] = {
            dateTime: end,
            timeZone: timeZone || 'UTC'
        };
    }

    // Add attendees if provided
    if (attendees !== undefined) {
        event['attendees'] = attendees.map(email => ({ email }));
    }

    try {
        // Update event via Google Calendar API
        const eventResponse = await nango.proxy({
            method: "PATCH",
            endpoint: `/calendar/v3/calendars/primary/events/${eventId}`,
            params: {
                sendUpdates: sendUpdates || 'none' // Control notifications: 'all', 'externalOnly', or 'none'
            },
            data: event,
            retries: 3,
        });

        return {
            id: eventResponse.data.id,
            htmlLink: eventResponse.data.htmlLink,
            status: eventResponse.data.status,
            created: eventResponse.data.created,
        };
    } catch (error: any) {
        throw new Error(`Failed to update calendar event: ${error.message}`);
    }
}
