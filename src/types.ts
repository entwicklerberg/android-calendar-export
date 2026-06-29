export interface MeetingLocation {
  address?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  placeId?: string;
}

export interface Conference {
  /** "video" for a meeting link (Zoom/Teams/Meet), "phone" for a dial-in. */
  type: "video" | "phone";
  /** Join URI: "https://zoom.us/j/123" for video, "tel:+493012345" for phone. */
  url: string;
  /** Display label, e.g. "Zoom". Falls back to "Join"/"Call". */
  label?: string;
  /** Optional human-readable dial-in details (number + PIN) shown in the notes. */
  dialIn?: string;
}

export interface Meeting {
  /** Accepted for API parity with the ICS export; Google Calendar's template
   *  URL has no uid parameter, so it is ignored when building the link. */
  uid?: string;
  title: string;
  start: Date | string;
  end: Date | string;
  description?: string;
  url?: string;
  location?: MeetingLocation;
  conference?: Conference;
  /** Reminder offsets in minutes. Accepted for API parity; Google Calendar's
   *  template URL cannot carry reminders, so they are not encoded in the link. */
  alarms?: number[];
}

export interface GoogleCalendarOptions {
  /** Override the calendar render endpoint (e.g. a Workspace domain). */
  baseUrl?: string;
  /** Display timezone (IANA name, e.g. "Europe/Berlin"). Times stay absolute
   *  (UTC); ctz only changes which timezone Google shows the event in. */
  ctz?: string;
}

export type MeetingErrorCode =
  | "MISSING_TITLE"
  | "INVALID_DATE"
  | "END_BEFORE_START"
  | "MISSING_TIMEZONE"
  | "INVALID_COORDINATES"
  | "INVALID_CONFERENCE";

export class MeetingValidationError extends Error {
  code: MeetingErrorCode;
  constructor(code: MeetingErrorCode, message: string) {
    super(message);
    this.name = "MeetingValidationError";
    this.code = code;
  }
}
