import { query } from "./_generated/server";
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