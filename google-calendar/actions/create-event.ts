import type {
  GoogleCalendarEventInput,
  GoogleCalendarEventOutput,
  NangoAction,
} from "../../models";

export default async function runAction(
  nango: NangoAction,
  input: GoogleCalendarEventInput,
): Promise<GoogleCalendarEventOutput> {
  const { summary, description, location, start, end, attendees, timeZone } = input;

  // Validate required fields
  if (!summary) {
    throw new Error("Event summary (title) is required");
  }

  if (!start || !end) {
    throw new Error("Event start and end times are required");
  }

  // Format start and end times
  const startDateTime = { dateTime: start, timeZone: timeZone || 'UTC' };
  const endDateTime = { dateTime: end, timeZone: timeZone || 'UTC' };

  // Prepare the event object
  const event = {
    summary,
    description,
    location,
    start: startDateTime,
    end: endDateTime,
    attendees: attendees?.map(email => ({ email })),
  };

  // Create event via Google Calendar API
  const eventResponse = await nango.proxy({
    method: "POST",
    endpoint: "/calendar/v3/calendars/primary/events",
    data: event,
    retries: 3,
  });

  return {
    id: eventResponse.data.id,
    htmlLink: eventResponse.data.htmlLink,
    status: eventResponse.data.status,
    created: eventResponse.data.created,
  };
}
