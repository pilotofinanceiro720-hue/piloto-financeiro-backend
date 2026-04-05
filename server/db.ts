import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from 'postgres';
import * as schema from "../drizzle/schema";
import { ENV } from "./_core/env";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });

export async function getDb() {
  return db;
}

export async function upsertUser(user: schema.InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: schema.InsertUser = {
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

    await db.insert(schema.users).values(values).onConflictDoUpdate({
      target: schema.users.openId,
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

  const result = await db.select().from(schema.users).where(eq(schema.users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== VEHICLES =====
export async function getUserVehicles(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.vehicles).where(eq(schema.vehicles.userId, userId));
}

export async function getActiveVehicle(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(schema.vehicles)
    .where(and(eq(schema.vehicles.userId, userId), eq(schema.vehicles.isActive, true)))
    .limit(1);
  return result[0] || null;
}

export async function createVehicle(data: schema.InsertVehicle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schema.vehicles).values(data).returning({ id: schema.vehicles.id });
  return result[0]?.id || 0;
}

export async function updateVehicle(id: number, data: Partial<schema.InsertVehicle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(schema.vehicles).set(data).where(eq(schema.vehicles.id, id));
}

// ===== RIDES =====
export async function getUserRides(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(schema.rides)
    .where(eq(schema.rides.userId, userId))
    .orderBy(desc(schema.rides.startedAt))
    .limit(limit);
}

export async function getRideById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(schema.rides).where(eq(schema.rides.id, id)).limit(1);
  return result[0] || null;
}

export async function getOngoingRide(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(schema.rides)
    .where(and(eq(schema.rides.userId, userId), eq(schema.rides.status, "ongoing")))
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
    .from(schema.rides)
    .where(and(eq(schema.rides.userId, userId), gte(schema.rides.startedAt, today)));
}

export async function createRide(data: schema.InsertRide) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schema.rides).values(data).returning({ id: schema.rides.id });
  return result[0]?.id || 0;
}

export async function updateRide(id: number, data: Partial<schema.InsertRide>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(schema.rides).set(data).where(eq(schema.rides.id, id));
}

export async function completeRide(id: number, completionData: Partial<schema.InsertRide>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(schema.rides)
    .set({
      ...completionData,
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(schema.rides.id, id));
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
    .from(schema.dailySummaries)
    .where(
      and(
        eq(schema.dailySummaries.userId, userId),
        gte(schema.dailySummaries.date, startOfDay),
        lte(schema.dailySummaries.date, endOfDay)
      )
    )
    .limit(1);
  return result[0] || null;
}

export async function createOrUpdateDailySummary(userId: number, date: Date, data: Partial<schema.InsertDailySummary>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getDailySummary(userId, date);
  if (existing) {
    await db
      .update(schema.dailySummaries)
      .set(data)
      .where(eq(schema.dailySummaries.id, existing.id));
    return existing.id;
  } else {
    const result = await db.insert(schema.dailySummaries).values({
      userId,
      date,
      ...data,
    } as schema.InsertDailySummary).returning({ id: schema.dailySummaries.id });
    return result[0]?.id || 0;
  }
}

// ===== MONTHLY GOALS =====
export async function getMonthlyGoal(userId: number, month: number, year: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(schema.monthlyGoals)
    .where(
      and(
        eq(schema.monthlyGoals.userId, userId),
        eq(schema.monthlyGoals.month, month),
        eq(schema.monthlyGoals.year, year)
      )
    )
    .limit(1);
  return result[0] || null;
}

export async function createOrUpdateMonthlyGoal(
  userId: number,
  month: number,
  year: number,
  data: Partial<schema.InsertMonthlyGoal>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getMonthlyGoal(userId, month, year);
  if (existing) {
    await db
      .update(schema.monthlyGoals)
      .set(data)
      .where(eq(schema.monthlyGoals.id, existing.id));
    return existing.id;
  } else {
    const result = await db.insert(schema.monthlyGoals).values({
      userId,
      month,
      year,
      ...data,
    } as schema.InsertMonthlyGoal).returning({ id: schema.monthlyGoals.id });
    return result[0]?.id || 0;
  }
}

// ===== OFFERS (MARKETPLACE) =====
export async function getActiveOffers(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(schema.offers)
    .where(and(eq(schema.offers.isActive, true), eq(schema.offers.isApproved, true)))
    .orderBy(desc(schema.offers.createdAt))
    .limit(limit);
}

export async function searchOffers(query: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(schema.offers)
    .where(
      and(
        eq(schema.offers.isActive, true),
        eq(schema.offers.isApproved, true),
        sql`${schema.offers.title} LIKE ${`%${query}%`}`
      )
    )
    .limit(limit);
}

export async function createOffer(data: schema.InsertOffer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schema.offers).values(data).returning({ id: schema.offers.id });
  return result[0]?.id || 0;
}

export async function updateOffer(id: number, data: Partial<schema.InsertOffer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(schema.offers).set(data).where(eq(schema.offers.id, id));
}

export async function approveOffer(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(schema.offers).set({ isApproved: true }).where(eq(schema.offers.id, id));
}

// ===== WISHLISTS =====
export async function getUserWishlist(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: schema.wishlists.id,
      offerId: schema.wishlists.offerId,
      alertOnPriceDrop: schema.wishlists.alertOnPriceDrop,
      alertOnCoupon: schema.wishlists.alertOnCoupon,
      createdAt: schema.wishlists.createdAt,
      offer: schema.offers,
    })
    .from(schema.wishlists)
    .leftJoin(schema.offers, eq(schema.wishlists.offerId, schema.offers.id))
    .where(eq(schema.wishlists.userId, userId));
}

export async function addToWishlist(data: schema.InsertWishlist) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schema.wishlists).values(data).returning({ id: schema.wishlists.id });
  return result[0]?.id || 0;
}

export async function removeFromWishlist(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(schema.wishlists).where(eq(schema.wishlists.id, id));
}

// ===== SUBSCRIPTIONS =====
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(schema.subscriptions)
    .where(and(eq(schema.subscriptions.userId, userId), eq(schema.subscriptions.status, "active")))
    .limit(1);
  return result[0] || null;
}

export async function createSubscription(data: schema.InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schema.subscriptions).values(data).returning({ id: schema.subscriptions.id });
  return result[0]?.id || 0;
}

// ===== DEMAND AREAS =====
export async function getActiveDemandAreas() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.demandAreas).where(eq(schema.demandAreas.isActive, true));
}

export async function createDemandArea(data: schema.InsertDemandArea) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schema.demandAreas).values(data).returning({ id: schema.demandAreas.id });
  return result[0]?.id || 0;
}

// ===== FUEL STATIONS =====
export async function getActiveFuelStations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schema.fuelStations).where(eq(schema.fuelStations.isActive, true));
}

export async function createFuelStation(data: schema.InsertFuelStation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schema.fuelStations).values(data).returning({ id: schema.fuelStations.id });
  return result[0]?.id || 0;
}

// ===== ADMIN LOGS =====
export async function createAdminLog(data: schema.InsertAdminLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(schema.adminLogs).values(data).returning({ id: schema.adminLogs.id });
  return result[0]?.id || 0;
}

export async function getAdminLogs(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(schema.adminLogs)
    .where(eq(schema.adminLogs.userId, userId))
    .orderBy(desc(schema.adminLogs.createdAt))
    .limit(limit);
}
