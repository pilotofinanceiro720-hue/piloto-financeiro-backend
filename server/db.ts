import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  vehicles,
  rides,
  dailySummaries,
  monthlyGoals,
  offers,
  wishlists,
  priceHistory,
  subscriptions,
  affiliateConversions,
  demandAreas,
  fuelStations,
  adminLogs,
  type InsertVehicle,
  type InsertRide,
  type InsertDailySummary,
  type InsertMonthlyGoal,
  type InsertOffer,
  type InsertWishlist,
  type InsertPriceHistory,
  type InsertSubscription,
  type InsertAffiliateConversion,
  type InsertDemandArea,
  type InsertFuelStation,
  type InsertAdminLog,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== VEHICLES =====
export async function getUserVehicles(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vehicles).where(eq(vehicles.userId, userId));
}

export async function getActiveVehicle(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.userId, userId), eq(vehicles.isActive, 1)))
    .limit(1);
  return result[0] || null;
}

export async function createVehicle(data: InsertVehicle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(vehicles).values(data);
  return Number((result as any)[0]?.insertId || 0);
}

export async function updateVehicle(id: number, data: Partial<InsertVehicle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(vehicles).set(data).where(eq(vehicles.id, id));
}

// ===== RIDES =====
export async function getUserRides(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(rides)
    .where(eq(rides.userId, userId))
    .orderBy(desc(rides.startedAt))
    .limit(limit);
}

export async function getRideById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(rides).where(eq(rides.id, id)).limit(1);
  return result[0] || null;
}

export async function getOngoingRide(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(rides)
    .where(and(eq(rides.userId, userId), eq(rides.status, "ongoing")))
    .limit(1);
  return result[0] || null;
}

export async function getTodayRides(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return db
    .select()
    .from(rides)
    .where(and(eq(rides.userId, userId), gte(rides.startedAt, today)));
}

export async function createRide(data: InsertRide) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(rides).values(data);
  return Number((result as any)[0]?.insertId || 0);
}

export async function updateRide(id: number, data: Partial<InsertRide>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(rides).set(data).where(eq(rides.id, id));
}

export async function completeRide(id: number, completionData: Partial<InsertRide>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(rides)
    .set({
      ...completionData,
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(rides.id, id));
}

// ===== DAILY SUMMARIES =====
export async function getDailySummary(userId: number, date: Date) {
  const db = await getDb();
  if (!db) return null;
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await db
    .select()
    .from(dailySummaries)
    .where(
      and(
        eq(dailySummaries.userId, userId),
        gte(dailySummaries.date, startOfDay),
        lte(dailySummaries.date, endOfDay)
      )
    )
    .limit(1);
  return result[0] || null;
}

export async function createOrUpdateDailySummary(userId: number, date: Date, data: Partial<InsertDailySummary>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getDailySummary(userId, date);
  if (existing) {
    await db
      .update(dailySummaries)
      .set(data)
      .where(eq(dailySummaries.id, existing.id));
    return existing.id;
  } else {
    const result = await db.insert(dailySummaries).values({
      userId,
      date,
      ...data,
    } as InsertDailySummary);
    return Number((result as any)[0]?.insertId || 0);
  }
}

// ===== MONTHLY GOALS =====
export async function getMonthlyGoal(userId: number, month: number, year: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(monthlyGoals)
    .where(
      and(
        eq(monthlyGoals.userId, userId),
        eq(monthlyGoals.month, month),
        eq(monthlyGoals.year, year)
      )
    )
    .limit(1);
  return result[0] || null;
}

export async function createOrUpdateMonthlyGoal(
  userId: number,
  month: number,
  year: number,
  data: Partial<InsertMonthlyGoal>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getMonthlyGoal(userId, month, year);
  if (existing) {
    await db
      .update(monthlyGoals)
      .set(data)
      .where(eq(monthlyGoals.id, existing.id));
    return existing.id;
  } else {
    const result = await db.insert(monthlyGoals).values({
      userId,
      month,
      year,
      ...data,
    } as InsertMonthlyGoal);
    return Number((result as any)[0]?.insertId || 0);
  }
}

// ===== OFFERS (MARKETPLACE) =====
export async function getActiveOffers(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(offers)
    .where(and(eq(offers.isActive, 1), eq(offers.isApproved, 1)))
    .orderBy(desc(offers.createdAt))
    .limit(limit);
}

export async function searchOffers(query: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(offers)
    .where(
      and(
        eq(offers.isActive, 1),
        eq(offers.isApproved, 1),
        sql`${offers.title} LIKE ${`%${query}%`}`
      )
    )
    .limit(limit);
}

export async function createOffer(data: InsertOffer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(offers).values(data);
  return Number((result as any)[0]?.insertId || 0);
}

export async function updateOffer(id: number, data: Partial<InsertOffer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(offers).set(data).where(eq(offers.id, id));
}

export async function approveOffer(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(offers).set({ isApproved: 1 }).where(eq(offers.id, id));
}

// ===== WISHLISTS =====
export async function getUserWishlist(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: wishlists.id,
      offerId: wishlists.offerId,
      alertOnPriceDrop: wishlists.alertOnPriceDrop,
      alertOnCoupon: wishlists.alertOnCoupon,
      createdAt: wishlists.createdAt,
      offer: offers,
    })
    .from(wishlists)
    .leftJoin(offers, eq(wishlists.offerId, offers.id))
    .where(eq(wishlists.userId, userId));
}

export async function addToWishlist(data: InsertWishlist) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(wishlists).values(data);
  return Number((result as any)[0]?.insertId || 0);
}

export async function removeFromWishlist(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(wishlists).where(eq(wishlists.id, id));
}

// ===== SUBSCRIPTIONS =====
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")))
    .limit(1);
  return result[0] || null;
}

export async function createSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(subscriptions).values(data);
  return Number((result as any)[0]?.insertId || 0);
}

// ===== DEMAND AREAS =====
export async function getActiveDemandAreas() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(demandAreas).where(eq(demandAreas.isActive, 1));
}

export async function createDemandArea(data: InsertDemandArea) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(demandAreas).values(data);
  return Number((result as any)[0]?.insertId || 0);
}

// ===== FUEL STATIONS =====
export async function getActiveFuelStations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(fuelStations).where(eq(fuelStations.isActive, 1));
}

export async function createFuelStation(data: InsertFuelStation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(fuelStations).values(data);
  return Number((result as any)[0]?.insertId || 0);
}

// ===== ADMIN LOGS =====
export async function createAdminLog(data: InsertAdminLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(adminLogs).values(data);
  return Number((result as any)[0]?.insertId || 0);
}

export async function getAdminLogs(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(adminLogs)
    .orderBy(desc(adminLogs.createdAt))
    .limit(limit);
}
