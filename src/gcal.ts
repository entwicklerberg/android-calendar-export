import { Meeting, GoogleCalendarOptions } from "./types";
import { validateMeeting } from "./validate";
import { googleMapsUrl } from "./location";
import { conferenceDescription } from "./conference";

const DEFAULT_BASE_URL = "https://calendar.google.com/calendar/render";

// Compact UTC, e.g. 20260628T100000Z — the format Google Calendar's `dates`
// parameter expects (RFC 5545 basic form, no separators).
export function formatUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

// Everything Google Calendar can't model with a dedicated field (the join link,
// a maps link, the canonical url) is folded into the free-text details, mirroring
// how the ICS export builds its DESCRIPTION.
function buildDetails(meeting: Meeting): string | undefined {
  const parts: string[] = [];
  if (meeting.description) parts.push(meeting.description);
  if (meeting.conference) parts.push(conferenceDescription(meeting.conference));
  if (meeting.url) parts.push(meeting.url);
  const mapsUrl = meeting.location ? googleMapsUrl(meeting.location) : undefined;
  if (mapsUrl && mapsUrl !== meeting.url) parts.push(mapsUrl);
  return parts.length ? parts.join("\n") : undefined;
}

/**
 * Build a single "Add to Google Calendar" URL. Opening it on Android hands the
 * prefilled event to the Google Calendar app (or the web UI) for one-tap saving.
 */
export function buildUrl(meeting: Meeting, opts: GoogleCalendarOptions = {}): string {
  const { start, end } = validateMeeting(meeting);

  // `dates` joins two compact-UTC stamps with a literal "/"; the stamps contain
  // no reserved characters, so they need no encoding. Every free-text value is
  // percent-encoded individually.
  const params: string[] = [
    "action=TEMPLATE",
    `text=${encodeURIComponent(meeting.title)}`,
    `dates=${formatUtc(start)}/${formatUtc(end)}`,
  ];

  const details = buildDetails(meeting);
  if (details) params.push(`details=${encodeURIComponent(details)}`);

  if (meeting.location?.address) {
    params.push(`location=${encodeURIComponent(meeting.location.address)}`);
  }

  if (opts.ctz) params.push(`ctz=${encodeURIComponent(opts.ctz)}`);

  const base = opts.baseUrl ?? DEFAULT_BASE_URL;
  return `${base}?${params.join("&")}`;
}
