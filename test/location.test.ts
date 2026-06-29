import { describe, it, expect } from "vitest";
import { googleMapsUrl, geoValue } from "../src/location";

describe("googleMapsUrl", () => {
  it("prefers an explicit url", () => {
    expect(googleMapsUrl({ googleMapsUrl: "https://maps.app.goo.gl/abc" }))
      .toBe("https://maps.app.goo.gl/abc");
  });
  it("builds from coordinates", () => {
    expect(googleMapsUrl({ latitude: 52.52, longitude: 13.405 }))
      .toBe("https://www.google.com/maps/search/?api=1&query=52.52%2C13.405");
  });
  it("builds from placeId with coordinates", () => {
    expect(googleMapsUrl({ latitude: 52.52, longitude: 13.405, placeId: "XYZ" }))
      .toBe("https://www.google.com/maps/search/?api=1&query=52.52%2C13.405&query_place_id=XYZ");
  });
  it("returns undefined with no usable data", () => {
    expect(googleMapsUrl({ address: "Somewhere" })).toBeUndefined();
  });
});

describe("geoValue", () => {
  it("formats lat;lon", () => {
    expect(geoValue({ latitude: 52.52, longitude: 13.405 })).toBe("52.52;13.405");
  });
  it("returns undefined without both coordinates", () => {
    expect(geoValue({ latitude: 52.52 })).toBeUndefined();
  });
});
