import { describe, it, expect } from "vitest";
import {
  createGoogleCalendarUrl,
  createGoogleCalendarUrls,
  MeetingValidationError,
} from "../src/index";

const meeting = {
  title: "Demo",
  start: "2026-06-28T10:00:00Z",
  end: "2026-06-28T11:00:00Z",
};

describe("createGoogleCalendarUrl", () => {
  it("returns a single template url", () => {
    const url = createGoogleCalendarUrl(meeting);
    expect(url).toContain("action=TEMPLATE");
    expect(new URL(url).searchParams.get("text")).toBe("Demo");
  });
  it("throws MeetingValidationError on invalid input", () => {
    expect(() => createGoogleCalendarUrl({ ...meeting, title: "" }))
      .toThrowError(MeetingValidationError);
  });
});

describe("createGoogleCalendarUrls", () => {
  it("returns one url per meeting", () => {
    const urls = createGoogleCalendarUrls([meeting, { ...meeting, title: "Demo 2" }]);
    expect(urls).toHaveLength(2);
    expect(new URL(urls[1]!).searchParams.get("text")).toBe("Demo 2");
  });
});
