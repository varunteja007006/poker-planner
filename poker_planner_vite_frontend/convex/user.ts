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
      last_active: Date.now(),
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
      success: v.boolean(),
      message: v.string(),
    }),
    v.object({
      success: v.boolean(),
      message: v.string(),
    })
  ),

  handler: async (ctx, args) => {
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
    return {
      success: true,
      id: user._id,
      username: user.username,
      message: "User found.",
    };
  },
});

export const updateUserLastActive = mutation({
  args: {
    token: v.string(),
  },
  returns: v.union(
    v.object({
      success: v.boolean(),
      message: v.string(),
      id: v.id("users"),
      username: v.string(),
    }),
    v.object({
      success: v.boolean(),
      message: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_token", (q) => q.eq("user_token", args.token))
      .unique();
    if (!user) {
      return {
        success: false,
        message: "Last active update failed.",
      };
    }
    await ctx.db.patch(user._id, { last_active: Date.now() });
    return {
      success: true,
      message: "Last active updated.",
      id: user._id,
      username: user.username,
    };
  },
});
