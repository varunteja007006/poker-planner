import { mutation } from "./_generated/server";

export const deleteStaleStories = mutation(async ({ db }) => {
  const now = Date.now();
  const cutoff = now - 60 * 60 * 1000; // 1 hour ago

  const stories = await db
    .query("stories")
    .withIndex("created_at")
    .collect();

  for (const story of stories) {
    if (story.status === "started" && story.created_at < cutoff) {
      await db.delete(story._id);
    }
  }
});
