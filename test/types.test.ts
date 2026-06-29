import { describe, it, expect } from "vitest";
import { MeetingValidationError } from "../src/types";

describe("MeetingValidationError", () => {
  it("carries a machine-readable code and is an Error", () => {
    const err = new MeetingValidationError("MISSING_TITLE", "title is required");
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe("MISSING_TITLE");
    expect(err.message).toBe("title is required");
    expect(err.name).toBe("MeetingValidationError");
  });
});
