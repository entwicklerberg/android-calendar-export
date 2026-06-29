import { describe, it, expect } from "vitest";
import { buildUrl, formatUtc } from "../src/gcal";

const meeting = {
  title: "Project, Sync",
  start: "2026-06-28T10:00:00Z",
  end: "2026-06-28T11:00:00Z",
  description: "Discuss roadmap",
  location: {
    address: "Alexanderplatz 1, Berlin",
    latitude: 52.52,
    longitude: 13.405,
  },
  alarms: [15],
};

// Parse the query with the standard URL API so assertions read decoded values.
function params(url: string): URLSearchParams {
  return new URL(url).searchParams;
}

describe("formatUtc", () => {
  it("formats to compact UTC", () => {
    expect(formatUtc(new Date("2026-06-28T10:00:00Z"))).toBe("20260628T100000Z");
  });
});

describe("buildUrl", () => {
  it("targets the Google Calendar template endpoint", () => {
    const url = buildUrl(meeting);
    expect(url.startsWith("https://calendar.google.com/calendar/render?")).toBe(true);
    expect(params(url).get("action")).toBe("TEMPLATE");
  });
  it("encodes the title and the start/end window", () => {
    const p = params(buildUrl(meeting));
    expect(p.get("text")).toBe("Project, Sync");
    expect(p.get("dates")).toBe("20260628T100000Z/20260628T110000Z");
  });
  it("carries the address as the location param", () => {
    expect(params(buildUrl(meeting)).get("location")).toBe("Alexanderplatz 1, Berlin");
  });
  it("folds description and the Google Maps link into details", () => {
    const details = params(buildUrl(meeting)).get("details") ?? "";
    expect(details).toContain("Discuss roadmap");
    expect(details).toContain("https://www.google.com/maps/search/?api=1&query=52.52%2C13.405");
  });
  it("folds the conference join link into details", () => {
    const url = buildUrl({
      ...meeting,
      conference: { type: "video", url: "https://zoom.us/j/9", label: "Zoom" },
    });
    expect(params(url).get("details")).toContain("Zoom: https://zoom.us/j/9");
  });
  it("adds a ctz param when a display timezone is given", () => {
    expect(params(buildUrl(meeting, { ctz: "Europe/Berlin" })).get("ctz")).toBe("Europe/Berlin");
  });
  it("honors a custom base url", () => {
    const url = buildUrl(meeting, { baseUrl: "https://calendar.google.com/a/acme.com/render" });
    expect(url.startsWith("https://calendar.google.com/a/acme.com/render?")).toBe(true);
  });
  it("validates the meeting (throws on bad input)", () => {
    expect(() => buildUrl({ ...meeting, title: "" })).toThrow();
  });
  it("rejects a conference without a url", () => {
    expect(() =>
      buildUrl({ ...meeting, conference: { type: "video", url: "" } }),
    ).toThrow(/conference.url is required/);
  });
});
