import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

interface UserResult {
  success: boolean;
  message: string;
  id?: Id<"users">;
  username?: string;
}

/**
 * Mutation to update or create presence for a user in a room (heartbeat).
 * This should be called periodically from the frontend when the user is active in the room.
 */
export const updatePresence = mutation({
  args: {
    userToken: v.string(),
    roomCode: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    presenceId: v.optional(v.id("presence")),
  }),
  handler: async (ctx, args) => {
    // Get user by token
    const userResult: UserResult = await ctx.runQuery(api.user.getUserByToken, {
      token: args.userToken,
    });

    if (!userResult.success || !userResult.id) {
      return {
        success: false,
        message: userResult.message || "User not found",
      };
    }

    const userId = userResult.id;

    // Get room by code
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_room_code", (q) => q.eq("room_code", args.roomCode))
      .unique();

    if (!room) {
      return {
        success: false,
        message: "Room not found",
      };
    }

    const roomId = room._id;

    // Check if user is in the room (via teams)
    const teams = await ctx.db
      .query("teams")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect();

    const isInRoom = teams.some((team) => team.userId === userId);
    if (!isInRoom) {
      return {
        success: false,
        message: "User not authorized in this room",
      };
    }

    const now = Date.now();

    // Upsert presence: first try to get existing, then patch or insert
    let presence = await ctx.db
      .query("presence")
      .withIndex("by_user_room", (q) => q.eq("userId", userId).eq("roomId", roomId))
      .unique();

    let presenceId: Id<"presence"> | undefined;

    if (presence) {
      await ctx.db.patch(presence._id, { lastSeen: now });
      presenceId = presence._id;
    } else {
      presenceId = await ctx.db.insert("presence", {
        roomId,
        userId,
        lastSeen: now,
      });
    }

    // Update user's global last_active
    await ctx.db.patch(userId, { last_active: now });

    return {
      success: true,
      message: "Presence updated successfully",
      presenceId,
    };
  },
});

/**
 * Query to get all users in a room with their presence status.
 * isActive is true if lastSeen is within the threshold (default 30 seconds).
 */
export const getActiveUsersInRoom = query({
  args: {
    userToken: v.string(),
    roomCode: v.string(),
    thresholdMs: v.optional(v.number()),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    users: v.array(
      v.object({
        id: v.id("users"),
        username: v.string(),
        isActive: v.boolean(),
        lastSeen: v.optional(v.number()),
      })
    ),
  }),
  handler: async (ctx, args) => {
    // Get user by token
    const userResult: UserResult = await ctx.runQuery(api.user.getUserByToken, {
      token: args.userToken,
    });

    if (!userResult.success || !userResult.id) {
      return {
        success: false,
        message: userResult.message || "User not found",
        users: [],
      };
    }

    const userId = userResult.id;

    // Get room by code
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_room_code", (q) => q.eq("room_code", args.roomCode))
      .unique();

    if (!room) {
      return {
        success: false,
        message: "Room not found",
        users: [],
      };
    }

    const roomId = room._id;

    // Check if user is in the room
    const teams = await ctx.db
      .query("teams")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect();

    const isInRoom = teams.some((team) => team.userId === userId);
    if (!isInRoom) {
      return {
        success: false,
        message: "User not authorized to view room presence",
        users: [],
      };
    }

    const threshold = args.thresholdMs || 30000; // 30 seconds default
    const now = Date.now();
    const cutoff = now - threshold;

    // Get all teams for the room to get all users
    const roomTeams = await ctx.db
      .query("teams")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect();

    const uniqueUserIds = [...new Set(roomTeams.map((t) => t.userId))];

    const users: {
      id: Id<"users">;
      username: string;
      isActive: boolean;
      lastSeen?: number;
    }[] = [];

    for (const uid of uniqueUserIds) {
      const user = await ctx.db.get(uid);
      if (!user) continue;

      // Get presence for this user in the room
      const presence = await ctx.db
        .query("presence")
        .withIndex("by_user_room", (q) => q.eq("userId", uid).eq("roomId", roomId))
        .unique();

      const lastSeen = presence ? presence.lastSeen : 0;
      const isActive = lastSeen > cutoff;

      users.push({
        id: user._id,
        username: user.username,
        isActive,
        lastSeen: lastSeen > 0 ? lastSeen : undefined,
      });
    }

    return {
      success: true,
      message: "Room users with presence retrieved successfully",
      users,
    };
  },
});

/**
 * Internal mutation to clean up stale presence records older than 5 minutes.
 * This should be called periodically via cron.
 */
export const deleteStalePresence = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx: any, _args: {}) => {
    const now = Date.now();
    const cutoff = now - 5 * 60 * 1000; // 5 minutes ago

    const stalePresences = await ctx.db
      .query("presence")
      .filter((q: any) => q.lt(q.field("lastSeen"), cutoff))
      .collect();

    for (const presence of stalePresences) {
      await ctx.db.delete(presence._id);
    }

    return null;
  },
});