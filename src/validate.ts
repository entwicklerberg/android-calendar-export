import { Meeting, MeetingValidationError } from "./types";

const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

export function toUtcDate(value: Date | string, field: string): Date {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new MeetingValidationError("INVALID_DATE", `${field} is an invalid Date`);
    }
    return value;
  }
  if (!ISO_WITH_OFFSET.test(value)) {
    // Distinguish "looks like a date but no offset" from outright garbage.
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
      throw new MeetingValidationError(
        "MISSING_TIMEZONE",
        `${field} must include a timezone offset (e.g. Z or +02:00)`,
      );
    }
    throw new MeetingValidationError("INVALID_DATE", `${field} is not a valid ISO 8601 datetime`);
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new MeetingValidationError("INVALID_DATE", `${field} could not be parsed`);
  }
  return parsed;
}

export function validateMeeting(meeting: Meeting): { start: Date; end: Date } {
  if (!meeting.title || meeting.title.trim() === "") {
    throw new MeetingValidationError("MISSING_TITLE", "title is required");
  }
  const start = toUtcDate(meeting.start, "start");
  const end = toUtcDate(meeting.end, "end");
  if (end.getTime() <= start.getTime()) {
    throw new MeetingValidationError("END_BEFORE_START", "end must be after start");
  }

  const loc = meeting.location;
  if (loc && (loc.latitude !== undefined || loc.longitude !== undefined)) {
    const { latitude, longitude } = loc;
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new MeetingValidationError(
        "INVALID_COORDINATES",
        "latitude and longitude must both be valid numbers within range",
      );
    }
  }

  const conf = meeting.conference;
  if (conf) {
    if (conf.type !== "video" && conf.type !== "phone") {
      throw new MeetingValidationError(
        "INVALID_CONFERENCE",
        'conference.type must be "video" or "phone"',
      );
    }
    if (!conf.url || conf.url.trim() === "") {
      throw new MeetingValidationError("INVALID_CONFERENCE", "conference.url is required");
    }
  }

  return { start, end };
}
