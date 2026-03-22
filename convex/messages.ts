import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const sendMessage = mutation({
  args: {
    bookingId: v.id("bookings"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("Booking not found");

    // Check user is part of this booking
    if (booking.hotelUserId !== userId && booking.masseurUserId !== userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("messages", {
      bookingId: args.bookingId,
      senderId: userId,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

export const getBookingMessages = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) return [];

    if (booking.hotelUserId !== userId && booking.masseurUserId !== userId) {
      return [];
    }

    return await ctx.db
      .query("messages")
      .withIndex("by_booking", (q) => q.eq("bookingId", args.bookingId))
      .order("asc")
      .collect();
  },
});
