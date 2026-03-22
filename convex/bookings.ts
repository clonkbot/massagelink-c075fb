import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createBooking = mutation({
  args: {
    masseurId: v.id("profiles"),
    date: v.string(),
    startTime: v.string(),
    duration: v.number(),
    guestName: v.optional(v.string()),
    roomNumber: v.optional(v.string()),
    massageType: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const hotelProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!hotelProfile || hotelProfile.role !== "hotel") {
      throw new Error("Only hotels can create bookings");
    }

    const masseur = await ctx.db.get(args.masseurId);
    if (!masseur || masseur.role !== "masseur") {
      throw new Error("Invalid masseur");
    }

    const hourlyRate = masseur.hourlyRate || 80;
    const totalPrice = (hourlyRate * args.duration) / 60;
    const platformFee = totalPrice * 0.15;
    const masseurEarnings = totalPrice - platformFee;

    return await ctx.db.insert("bookings", {
      hotelId: hotelProfile._id,
      masseurId: args.masseurId,
      hotelUserId: userId,
      masseurUserId: masseur.userId,
      date: args.date,
      startTime: args.startTime,
      duration: args.duration,
      guestName: args.guestName,
      roomNumber: args.roomNumber,
      massageType: args.massageType,
      totalPrice,
      platformFee,
      masseurEarnings,
      status: "pending",
      notes: args.notes,
      createdAt: Date.now(),
    });
  },
});

export const getMyBookings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) return [];

    let bookings;
    if (profile.role === "hotel") {
      bookings = await ctx.db
        .query("bookings")
        .withIndex("by_hotel_user", (q) => q.eq("hotelUserId", userId))
        .order("desc")
        .collect();
    } else {
      bookings = await ctx.db
        .query("bookings")
        .withIndex("by_masseur_user", (q) => q.eq("masseurUserId", userId))
        .order("desc")
        .collect();
    }

    // Enrich with profile data
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const hotel = await ctx.db.get(booking.hotelId);
        const masseur = await ctx.db.get(booking.masseurId);
        return {
          ...booking,
          hotel,
          masseur,
        };
      })
    );

    return enrichedBookings;
  },
});

export const updateBookingStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.union(
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("Booking not found");

    // Check authorization
    if (booking.hotelUserId !== userId && booking.masseurUserId !== userId) {
      throw new Error("Unauthorized");
    }

    // Masseurs can accept/decline, both can cancel, masseur marks complete
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    if (profile.role === "masseur") {
      if (!["accepted", "declined", "completed"].includes(args.status)) {
        throw new Error("Invalid status transition for masseur");
      }
    } else {
      if (args.status !== "cancelled") {
        throw new Error("Hotels can only cancel bookings");
      }
    }

    await ctx.db.patch(args.bookingId, { status: args.status });
  },
});

export const getBookingStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) return null;

    let bookings;
    if (profile.role === "hotel") {
      bookings = await ctx.db
        .query("bookings")
        .withIndex("by_hotel_user", (q) => q.eq("hotelUserId", userId))
        .collect();
    } else {
      bookings = await ctx.db
        .query("bookings")
        .withIndex("by_masseur_user", (q) => q.eq("masseurUserId", userId))
        .collect();
    }

    const pending = bookings.filter((b) => b.status === "pending").length;
    const accepted = bookings.filter((b) => b.status === "accepted").length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const totalEarnings = bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + (profile.role === "masseur" ? b.masseurEarnings : b.totalPrice), 0);

    return {
      pending,
      accepted,
      completed,
      total: bookings.length,
      totalEarnings,
    };
  },
});
