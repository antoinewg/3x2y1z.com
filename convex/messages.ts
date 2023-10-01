import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const create = mutation({
  args: {
    content: v.string(),
    role: v.union(
      v.literal("function"),
      v.literal("system"),
      v.literal("user"),
      v.literal("assistant"),
    ),
    chatId: v.id("chats"),
    authorId: v.optional(v.id("users"))
  },
  handler: async (ctx, args) => {
    let authorId = args.authorId

    if (!authorId) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Called storeUser without authentication present");
      }
      const user = await getUser(ctx, identity.nickname!);
      authorId = user?._id
    }

    const messageId = await ctx.db.insert("messages", {
      content: args.content,
      role: args.role,
      chatId: args.chatId,
      authorId: authorId as Id<'users'>,
    })
    return await ctx.db.get(messageId);
  },
});
