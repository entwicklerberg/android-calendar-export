/**
 * Attributes for an <a> tag that opens the event in a new tab. Handy in React /
 * web views: `<a {...googleCalendarLinkProps(url)}>Add to Google Calendar</a>`.
 */
export function googleCalendarLinkProps(url: string): {
  href: string;
  target: string;
  rel: string;
} {
  return { href: url, target: "_blank", rel: "noopener noreferrer" };
}

/**
 * Open the calendar URL. In a browser / WebView on Android this launches the
 * Google Calendar app (via Android App Links) or the web UI. Pass a custom
 * `open` to plug in React Native's `Linking.openURL`.
 */
export function openGoogleCalendar(
  url: string,
  open?: (url: string) => void,
): void {
  if (open) {
    open(url);
    return;
  }
  const w = globalThis as { open?: (url: string, target?: string, features?: string) => unknown };
  if (typeof w.open !== "function") {
    throw new Error(
      "openGoogleCalendar needs a browser window; pass an `open` callback (e.g. Linking.openURL) in other environments",
    );
  }
  w.open(url, "_blank", "noopener");
}
