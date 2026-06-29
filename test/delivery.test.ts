import { describe, it, expect, vi } from "vitest";
import { googleCalendarLinkProps, openGoogleCalendar } from "../src/delivery";

describe("googleCalendarLinkProps", () => {
  it("returns safe anchor attributes", () => {
    expect(googleCalendarLinkProps("https://x")).toEqual({
      href: "https://x",
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });
});

describe("openGoogleCalendar", () => {
  it("delegates to a provided open callback (e.g. Linking.openURL)", () => {
    const open = vi.fn();
    openGoogleCalendar("https://x", open);
    expect(open).toHaveBeenCalledWith("https://x");
  });
  it("throws when there is no window and no callback", () => {
    expect(() => openGoogleCalendar("https://x")).toThrow(/browser window/);
  });
});
