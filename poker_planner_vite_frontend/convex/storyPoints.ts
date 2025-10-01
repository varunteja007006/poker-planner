import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const captureStoryPoint = mutation({
  args: {
    storyId: v.id("stories"),
    storypoint: v.union(v.number(), v.string()),
    token: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    storyPointId: v.optional(v.id("storyPoints")),
  }),
  handler: async (ctx, args) => {
    // Validate user token
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_token", (q) => q.eq("user_token", args.token))
      .unique();
    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // Check if story exists
    const story = await ctx.db.get(args.storyId);
    if (!story) {
      return {
        success: false,
        message: "Story not found.",
      };
    }

    const existing = await ctx.db
      .query("storyPoints")
      .withIndex("by_story_and_user", (q) =>
        q.eq("storyId", args.storyId).eq("userId", user._id)
      )
      .unique();
    let storyPointId;
    if (existing) {
      storyPointId = existing._id;
      await ctx.db.patch(existing._id, { story_point: args.storypoint });
    } else {
      storyPointId = await ctx.db.insert("storyPoints", {
        userId: user._id,
        storyId: args.storyId,
        story_point: args.storypoint,
        created_at: Date.now(),
      });
    }

    return {
      success: true,
      message: "Story point captured successfully.",
      storyPointId,
    };
  },
});

export const getStoryPoints = query({
  args: {
    storyId: v.id("stories"),
    token: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    storyPoints: v.optional(
      v.array(
        v.object({
          userId: v.id("users"),
          username: v.string(),
          story_point: v.optional(v.union(v.number(), v.string())),
          isCurrentUser: v.boolean(),
        })
      )
    ),
  }),
  handler: async (ctx, args) => {
    // Validate user token
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_user_token", (q) => q.eq("user_token", args.token))
      .unique();
    if (!currentUser) {
      return {
        success: false,
        message: "User not found.",
        storyPoints: undefined,
      };
    }

    // Check if story exists
    const story = await ctx.db.get(args.storyId);
    if (!story) {
      return {
        success: false,
        message: "Story not found.",
        storyPoints: undefined,
      };
    }

    const storyPoints = await ctx.db
      .query("storyPoints")
      .withIndex("by_story", (q) => q.eq("storyId", args.storyId))
      .collect();

    const result = [];
    for (const sp of storyPoints) {
      const user = await ctx.db.get(sp.userId);
      if (user) {
        result.push({
          userId: sp.userId,
          username: user.username,
          story_point: sp.story_point,
          isCurrentUser: sp.userId === currentUser._id,
        });
      }
    }

    return {
      success: true,
      message: "Story points retrieved successfully.",
      storyPoints: result,
    };
  },
});
