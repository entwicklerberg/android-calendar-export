import { Meeting, GoogleCalendarOptions } from "./types";
import { buildUrl } from "./gcal";

/** Build an "Add to Google Calendar" URL for a single meeting. */
export function createGoogleCalendarUrl(meeting: Meeting, opts?: GoogleCalendarOptions): string {
  return buildUrl(meeting, opts);
}

/**
 * Build one URL per meeting. Google Calendar's template endpoint takes a single
 * event per link, so a batch maps to an array of URLs (one tap each).
 */
export function createGoogleCalendarUrls(
  meetings: Meeting[],
  opts?: GoogleCalendarOptions,
): string[] {
  return meetings.map((m) => buildUrl(m, opts));
}

export type { Meeting, MeetingLocation, Conference, GoogleCalendarOptions, MeetingErrorCode } from "./types";
export { MeetingValidationError } from "./types";
export { openGoogleCalendar, googleCalendarLinkProps } from "./delivery";
