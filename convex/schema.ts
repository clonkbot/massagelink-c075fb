import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User profiles with role (hotel or masseur)
  profiles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("hotel"), v.literal("masseur")),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    // Hotel specific
    hotelName: v.optional(v.string()),
    hotelAddress: v.optional(v.string()),
    hotelCity: v.optional(v.string()),
    // Masseur specific
    bio: v.optional(v.string()),
    specialties: v.optional(v.array(v.string())),
    hourlyRate: v.optional(v.number()),
    available: v.optional(v.boolean()),
    rating: v.optional(v.number()),
    totalReviews: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_role", ["role"])
    .index("by_available_masseurs", ["role", "available"]),

  // Bookings between hotels and masseurs
  bookings: defineTable({
    hotelId: v.id("profiles"),
    masseurId: v.id("profiles"),
    hotelUserId: v.id("users"),
    masseurUserId: v.id("users"),
    date: v.string(),
    startTime: v.string(),
    duration: v.number(), // in minutes
    guestName: v.optional(v.string()),
    roomNumber: v.optional(v.string()),
    massageType: v.string(),
    totalPrice: v.number(),
    platformFee: v.number(), // 15% commission
    masseurEarnings: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_hotel", ["hotelId"])
    .index("by_masseur", ["masseurId"])
    .index("by_hotel_user", ["hotelUserId"])
    .index("by_masseur_user", ["masseurUserId"])
    .index("by_status", ["status"]),

  // Messages between hotels and masseurs
  messages: defineTable({
    bookingId: v.id("bookings"),
    senderId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_booking", ["bookingId"]),
});
