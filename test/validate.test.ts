import { describe, it, expect } from "vitest";
import { toUtcDate, validateMeeting } from "../src/validate";

const base = {
  title: "Sync",
  start: "2026-06-28T10:00:00Z",
  end: "2026-06-28T11:00:00Z",
};

describe("toUtcDate", () => {
  it("accepts a Date", () => {
    const d = new Date("2026-06-28T10:00:00Z");
    expect(toUtcDate(d, "start").getTime()).toBe(d.getTime());
  });
  it("accepts ISO with Z offset", () => {
    expect(toUtcDate("2026-06-28T10:00:00Z", "start").toISOString())
      .toBe("2026-06-28T10:00:00.000Z");
  });
  it("accepts ISO with numeric offset", () => {
    expect(toUtcDate("2026-06-28T12:00:00+02:00", "start").toISOString())
      .toBe("2026-06-28T10:00:00.000Z");
  });
  it("rejects ISO without offset", () => {
    expect(() => toUtcDate("2026-06-28T10:00:00", "start"))
      .toThrowError(expect.objectContaining({ code: "MISSING_TIMEZONE" }));
  });
  it("rejects garbage", () => {
    expect(() => toUtcDate("not-a-date", "start"))
      .toThrowError(expect.objectContaining({ code: "INVALID_DATE" }));
  });
});

describe("validateMeeting", () => {
  it("passes a valid meeting and returns normalized dates", () => {
    const { start, end } = validateMeeting({ ...base });
    expect(start.toISOString()).toBe("2026-06-28T10:00:00.000Z");
    expect(end.toISOString()).toBe("2026-06-28T11:00:00.000Z");
  });
  it("rejects empty title", () => {
    expect(() => validateMeeting({ ...base, title: "  " }))
      .toThrowError(expect.objectContaining({ code: "MISSING_TITLE" }));
  });
  it("rejects end before start", () => {
    expect(() => validateMeeting({ ...base, end: "2026-06-28T09:00:00Z" }))
      .toThrowError(expect.objectContaining({ code: "END_BEFORE_START" }));
  });
  it("rejects out-of-range coordinates", () => {
    expect(() =>
      validateMeeting({ ...base, location: { latitude: 200, longitude: 0 } }),
    ).toThrowError(expect.objectContaining({ code: "INVALID_COORDINATES" }));
  });
  it("rejects half-specified coordinates", () => {
    expect(() =>
      validateMeeting({ ...base, location: { latitude: 10 } }),
    ).toThrowError(expect.objectContaining({ code: "INVALID_COORDINATES" }));
  });
});
