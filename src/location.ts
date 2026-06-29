import { MeetingLocation } from "./types";

export function geoValue(location: MeetingLocation): string | undefined {
  const { latitude, longitude } = location;
  if (typeof latitude === "number" && typeof longitude === "number") {
    return `${latitude};${longitude}`;
  }
  return undefined;
}

export function googleMapsUrl(location: MeetingLocation): string | undefined {
  if (location.googleMapsUrl) return location.googleMapsUrl;

  const { latitude, longitude, placeId } = location;
  if (typeof latitude === "number" && typeof longitude === "number") {
    const query = encodeURIComponent(`${latitude},${longitude}`);
    const base = `https://www.google.com/maps/search/?api=1&query=${query}`;
    return placeId ? `${base}&query_place_id=${encodeURIComponent(placeId)}` : base;
  }
  return undefined;
}
