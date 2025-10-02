import { cronJobs } from "convex/server";
import { api, internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "clear staled stories",
  { minutes: 60 }, // every 60 minutes
  api.cleanup.deleteStaleStories,
);

crons.interval(
  "cleanup stale presence",
  { minutes: 1 }, // every minute
  internal.presence.deleteStalePresence,
  {},
);

export default crons