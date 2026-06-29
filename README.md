# android-calendar-export

Convert meeting data into an "Add to Google Calendar" URL and open it so a user
can add the meeting to their Google Calendar on Android. Isomorphic (browser /
Node / React Native), zero runtime dependencies, no network calls.

This is the Android/Google Calendar counterpart of `ios-calendar-export`: same
`Meeting` shape, same validation, but it emits a Google Calendar template link
instead of an `.ics` file.

## Install

```bash
npm install android-calendar-export
```

## Usage

```ts
import { createGoogleCalendarUrl, openGoogleCalendar } from "android-calendar-export";

const url = createGoogleCalendarUrl({
  title: "Design review",
  start: "2026-06-28T10:00:00Z", // ISO 8601 with offset, or a Date
  end: "2026-06-28T11:00:00Z",
  location: {
    address: "Alexanderplatz 1, Berlin",
    latitude: 52.52,
    longitude: 13.405, // from Google Maps; a maps link is added to the details
  },
});

// Browser / Android WebView: open it — Google Calendar shows a prefilled event
openGoogleCalendar(url);
```

The URL targets
`https://calendar.google.com/calendar/render?action=TEMPLATE&...`. On Android,
opening it hands the prefilled event to the Google Calendar app (via Android App
Links) or the web UI for one-tap saving.

### React Native

```ts
import { Linking } from "react-native";
import { createGoogleCalendarUrl, openGoogleCalendar } from "android-calendar-export";

const url = createGoogleCalendarUrl(meeting);
openGoogleCalendar(url, Linking.openURL); // pass the platform opener
```

### Web link (anchor)

```ts
import { createGoogleCalendarUrl, googleCalendarLinkProps } from "android-calendar-export";

const url = createGoogleCalendarUrl(meeting);
// <a {...googleCalendarLinkProps(url)}>Add to Google Calendar</a>
```

### Several meetings

Google Calendar's template endpoint takes one event per link, so a batch maps to
one URL each:

```ts
import { createGoogleCalendarUrls } from "android-calendar-export";

const urls = createGoogleCalendarUrls([meetingA, meetingB]); // string[]
```

### Online meetings (Zoom / phone)

Use the `conference` field for a join link or a dial-in. `type: "video"` is for
a meeting URL (Zoom, Teams, Meet); `type: "phone"` is for a `tel:` number. The
join link is folded into the event details, since Google Calendar's template URL
has no dedicated conference field.

```ts
// Video call
createGoogleCalendarUrl({
  title: "Standup",
  start: "2026-06-30T10:00:00+02:00",
  end: "2026-06-30T10:30:00+02:00",
  conference: {
    type: "video",
    url: "https://zoom.us/j/123456789?pwd=abc",
    label: "Zoom",
  },
});

// Phone call / dial-in
createGoogleCalendarUrl({
  title: "Client call",
  start: "2026-06-30T15:00:00+02:00",
  end: "2026-06-30T15:30:00+02:00",
  conference: {
    type: "phone",
    url: "tel:+4930123456",
    label: "Dial-in",
    dialIn: "Access code: 4242#", // optional, shown in the details
  },
});
```

### Display timezone

Times are always sent as absolute UTC. Pass `ctz` (an IANA timezone name) if you
want Google to render the event in a specific zone:

```ts
createGoogleCalendarUrl(meeting, { ctz: "Europe/Berlin" });
```

## Notes

- Datetimes must carry a timezone (ISO 8601 offset or a `Date`); emitted as UTC.
- The location link opens in Google Maps and is appended to the event details.
- Invalid input throws `MeetingValidationError` with a `code`.
- Google Calendar's template URL cannot carry **reminders** or a **uid**. Those
  fields (`alarms`, `uid`) are accepted for API parity with `ios-calendar-export`
  but are not encoded in the link.
