import { Conference } from "./types";

// Google Calendar's "Add to Calendar" template URL has no dedicated conference
// field, so the join link is folded into the event details (`details` param).
// Returned text is plain; the caller URL-encodes the whole details string.
export function conferenceDescription(conf: Conference): string {
  const label = conf.label ?? (conf.type === "phone" ? "Call" : "Join");
  const parts = [`${label}: ${conf.url}`];
  if (conf.dialIn) parts.push(conf.dialIn);
  return parts.join("\n");
}
