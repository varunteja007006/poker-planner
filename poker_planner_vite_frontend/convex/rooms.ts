import { query, mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const checkRoomExists = query({
  args: {
    roomCode: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_room_code", (q) => q.eq("room_code", args.roomCode))
      .unique();

    if (room) {
      return {
        success: true,
        message: "Room exists",
      };
    } else {
      return {
        success: false,
        message: "Room not found",
      };
    }
  },
});

export const createRoom = mutation({
  args: {
    roomName: v.string(),
    userToken: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    roomId: v.optional(v.id("rooms")),
    roomCode: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Get user by token
    const userResult: {
      success: boolean;
      message: string;
      id?: Id<"users">;
    } = await ctx.runQuery(api.user.getUserByToken, {
      token: args.userToken,
    });

    if (!userResult.success) {
      return {
        success: false,
        message: userResult.message || "User not found",
      };
    }

    const ownerId = userResult.id;
    if (!ownerId) {
      return {
        success: false,
        message: "User ID not found",
      };
    }

    // Generate unique room code
    function generateCode() {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    let roomCode: string;
    let existing;
    do {
      roomCode = generateCode();
      existing = await ctx.db
        .query("rooms")
        .withIndex("by_room_code", (q) => q.eq("room_code", roomCode))
        .unique();
    } while (existing);

    // Create room
    const now = Date.now();
    const roomId = await ctx.db.insert("rooms", {
      room_name: args.roomName,
      room_code: roomCode,
      created_at: now,
      ownerId,
    });

    return {
      success: true,
      message: "Room created successfully",
      roomId,
      roomCode,
    };
  },
});

interface UserResult {
  success: boolean;
  message: string;
  id?: Id<"users">;
  username?: string;
}

export const getUserRooms = query({
  args: {
    userToken: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
    rooms: v.array(
      v.object({
        _id: v.id("rooms"),
        room_name: v.string(),
        room_code: v.string(),
        created_at: v.number(),
      })
    ),
  }),
  handler: async (ctx, args) => {
    // Get user by token
    const userResult: UserResult = await ctx.runQuery(api.user.getUserByToken, {
      token: args.userToken,
    });

    if (!userResult.success || !userResult.id) {
      return { success: false, message: "User not found", rooms: [] };
    }

    const rooms: Doc<"rooms">[] = await ctx.db
      .query("rooms")
      .withIndex("by_owner", (q) => q.eq("ownerId", userResult.id!))
      .collect();

    return {
      success: true,
      message: "Rooms found",
      rooms: rooms.map((item) => ({
        _id: item._id,
        room_name: item.room_name,
        room_code: item.room_code,
        created_at: item.created_at,
      })),
    };
  },
});
