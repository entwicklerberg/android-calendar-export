import { describe, it, expect, vi, afterEach } from "vitest";
import { openGoogleCalendar } from "../src/delivery";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("openGoogleCalendar (jsdom)", () => {
  it("opens the url in a new tab via window.open", () => {
    const open = vi.spyOn(globalThis, "open").mockReturnValue(null);

    openGoogleCalendar("https://calendar.google.com/calendar/render?action=TEMPLATE");

    expect(open).toHaveBeenCalledWith(
      "https://calendar.google.com/calendar/render?action=TEMPLATE",
      "_blank",
      "noopener",
    );
  });
});
