import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return profile;
  },
});

export const createProfile = mutation({
  args: {
    role: v.union(v.literal("hotel"), v.literal("masseur")),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    hotelName: v.optional(v.string()),
    hotelAddress: v.optional(v.string()),
    hotelCity: v.optional(v.string()),
    bio: v.optional(v.string()),
    specialties: v.optional(v.array(v.string())),
    hourlyRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) throw new Error("Profile already exists");

    return await ctx.db.insert("profiles", {
      userId,
      role: args.role,
      name: args.name,
      email: args.email,
      phone: args.phone,
      hotelName: args.hotelName,
      hotelAddress: args.hotelAddress,
      hotelCity: args.hotelCity,
      bio: args.bio,
      specialties: args.specialties,
      hourlyRate: args.hourlyRate,
      available: args.role === "masseur" ? true : undefined,
      rating: args.role === "masseur" ? 5.0 : undefined,
      totalReviews: args.role === "masseur" ? 0 : undefined,
      createdAt: Date.now(),
    });
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    hotelName: v.optional(v.string()),
    hotelAddress: v.optional(v.string()),
    hotelCity: v.optional(v.string()),
    bio: v.optional(v.string()),
    specialties: v.optional(v.array(v.string())),
    hourlyRate: v.optional(v.number()),
    available: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.hotelName !== undefined) updates.hotelName = args.hotelName;
    if (args.hotelAddress !== undefined) updates.hotelAddress = args.hotelAddress;
    if (args.hotelCity !== undefined) updates.hotelCity = args.hotelCity;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.specialties !== undefined) updates.specialties = args.specialties;
    if (args.hourlyRate !== undefined) updates.hourlyRate = args.hourlyRate;
    if (args.available !== undefined) updates.available = args.available;

    await ctx.db.patch(profile._id, updates);
  },
});

export const listAvailableMasseurs = query({
  args: {},
  handler: async (ctx) => {
    const masseurs = await ctx.db
      .query("profiles")
      .withIndex("by_available_masseurs", (q) =>
        q.eq("role", "masseur").eq("available", true)
      )
      .collect();

    return masseurs;
  },
});

export const getMasseur = query({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
