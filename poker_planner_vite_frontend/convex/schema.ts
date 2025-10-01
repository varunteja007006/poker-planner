import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    user_token: v.string(),
    is_active: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
    deleted_at: v.optional(v.number()),
    deleted_by: v.optional(v.id("users")),
    created_by: v.id("users"),
    updated_by: v.id("users"),
  }),

  rooms: defineTable({
    room_code: v.string(),
    is_active: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
    deleted_at: v.optional(v.number()),
    deleted_by: v.optional(v.id("users")),
    created_by: v.id("users"),
    updated_by: v.id("users"),
  }).index("by_room_code", ["room_code"]),

  teams: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    is_room_owner: v.boolean(),
    is_active: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
    deleted_at: v.optional(v.number()),
    is_online: v.boolean(),
    last_active: v.optional(v.number()),
    deleted_by: v.optional(v.id("users")),
    created_by: v.id("users"),
    updated_by: v.id("users"),
  }).index("by_room", ["roomId"]),

  stories: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    finalized_story_points: v.optional(v.number()),
    story_point_evaluation_status: v.union(
      v.literal("pending"),
      v.literal("in progress"),
      v.literal("completed")
    ),
    roomId: v.id("rooms"),
    is_active: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
    deleted_at: v.optional(v.number()),
    deleted_by: v.optional(v.id("users")),
    created_by: v.id("users"),
    updated_by: v.id("users"),
  }).index("by_room", ["roomId"]),

  storyPoints: defineTable({
    userId: v.id("users"),
    storyId: v.id("stories"),
    story_point: v.optional(v.number()),
    is_active: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
    deleted_at: v.optional(v.number()),
    deleted_by: v.optional(v.id("users")),
    created_by: v.id("users"),
    updated_by: v.id("users"),
  }).index("by_story", ["storyId"]).index("by_user", ["userId"]),
});