import { describe, it, expect } from "vitest";
import { conferenceDescription } from "../src/conference";

describe("conferenceDescription", () => {
  it("renders a Join line for video and a Call line for phone", () => {
    expect(conferenceDescription({ type: "video", url: "https://zoom.us/j/1" })).toBe(
      "Join: https://zoom.us/j/1",
    );
    expect(conferenceDescription({ type: "phone", url: "tel:+1" })).toBe("Call: tel:+1");
  });
  it("uses a custom label when provided", () => {
    expect(conferenceDescription({ type: "video", url: "https://x", label: "Zoom" })).toBe(
      "Zoom: https://x",
    );
  });
  it("appends dial-in details when present", () => {
    const text = conferenceDescription({
      type: "phone",
      url: "tel:+1",
      label: "Dial-in",
      dialIn: "PIN 4242#",
    });
    expect(text).toBe("Dial-in: tel:+1\nPIN 4242#");
  });
});
