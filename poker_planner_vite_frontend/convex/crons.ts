import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "clear staled stories",
  { minutes: 60 }, // every 60 minutes
  api.cleanup.deleteStaleStories,
);

export default crons