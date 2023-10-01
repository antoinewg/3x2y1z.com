import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    username: v.string(),
    pictureUrl: v.string(),
  }).index("byUserName", ["username"]),
  chats: defineTable({
    authorId: v.id("users"),
    title: v.string(),
    path: v.optional(v.string()),
    sharePath: v.optional(v.string()),
  }).index("byAuthorId", ["authorId"]),
  messages: defineTable({
    authorId: v.id("users"),
    chatId: v.id("chats"),
    content: v.string(),
    role: v.union(
      v.literal("function"),
      v.literal("system"),
      v.literal("user"),
      v.literal("assistant"),
    ),
  }).index("byAuthorId", ["authorId"]),
  examples: defineTable({
    heading: v.string(),
    message: v.string(),
  }),
});
