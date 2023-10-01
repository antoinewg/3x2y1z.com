import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { map } from 'modern-async'

export const get = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.id);

    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), chat?._id))
      .order("asc")
      .take(20);

    return { ...chat, messages: messages.map(m => ({ ...m, id: m._id as string })) }
  },
});

export const getSharedChat = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.id);

    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), chat?._id))
      .order("asc")
      .take(20);

    return { ...chat, messages: messages.map(m => ({ ...m, id: m._id as string })) }
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    const user = await getUser(ctx, identity.nickname!);
    return await ctx.db.query("chats").filter((q) => q.eq(q.field("authorId"), user?._id)).collect();
  },
});

export const create = mutation({
  args: { title: v.string(), userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("no identity found");
    }
    const user = await getUser(ctx, identity.nickname!);
    const authorId = args.userId ?? user?._id
    if (!authorId) {
      throw new Error("no user id found");
    }
    const chatId = await ctx.db.insert("chats", {
      title: args.title,
      authorId,
    })
    return await ctx.db.get(chatId);
  },
});

export const update = mutation({
  args: { title: v.string(), id: v.id("chats") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { title: args.title })
    return await ctx.db.get(args.id);
  },
});

export const share = mutation({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    const user = await getUser(ctx, identity.nickname!);
    const chat = await ctx.db.get(args.id);

    if (!user?._id || user?._id !== chat?.authorId) {
      throw new Error("Unauthorized");
    }

    const sharePath = `/share/${args.id}`
    await ctx.db.patch(args.id, { sharePath });
    return sharePath
  },
});

export const remove = mutation({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    const user = await getUser(ctx, identity.nickname!);
    const chat = await ctx.db.get(args.id);

    if (!user?._id || user?._id !== chat?.authorId) {
      return {
        error: 'Unauthorized'
      }
    }

    await ctx.db.delete(args.id);
  },
});

export const removeAll = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    const user = await getUser(ctx, identity.nickname!);
    const chats = await ctx.db.query("chats").filter((q) => q.eq(q.field("authorId"), user?._id)).collect();
    await map(chats, (chat) => ctx.db.delete(chat._id))
  },
});
