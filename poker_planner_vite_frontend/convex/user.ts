import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const token = globalThis.crypto.randomUUID();
    await ctx.db.insert("users", {
      username: args.name,
      user_token: token,
      created_at: Date.now(),
      last_active: undefined,
    });
    return token;
  },
});

export const getUserByToken = query({
  args: {
    token: v.string(),
  },
  returns: v.union(
    v.object({
      id: v.id("users"),
      username: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_token", (q) => q.eq("user_token", args.token))
      .unique();
    if (!user) {
      return null;
    }
    return {
      id: user._id,
      username: user.username,
    };
  },
});

export const updateUserLastActive = mutation({
  args: {
    token: v.string(),
  },
  returns: v.union(
    v.object({
      id: v.id("users"),
      username: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_token", (q) => q.eq("user_token", args.token))
      .unique();
    if (!user) {
      return null;
    }
    await ctx.db.patch(user._id, { last_active: Date.now() });
    return {
      id: user._id,
      username: user.username,
    };
  },
});
