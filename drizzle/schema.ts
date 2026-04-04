import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ===== VEHICLES TABLE =====
export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: int("year").notNull(),
  mileage: varchar("mileage", { length: 20 }).default("0").notNull(),
  fuelConsumption: varchar("fuelConsumption", { length: 20 }).notNull(),
  wearCoefficient: varchar("wearCoefficient", { length: 20 }).default("0.15").notNull(),
  averageMaintenanceCost: varchar("averageMaintenanceCost", { length: 20 }).default("0").notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ===== RIDES TABLE =====
export const rides = mysqlTable("rides", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  vehicleId: int("vehicleId").notNull(),
  origin: text("origin"),
  destination: text("destination"),
  distance: varchar("distance", { length: 20 }).notNull(),
  duration: int("duration").notNull(),
  grossRevenue: varchar("grossRevenue", { length: 20 }).notNull(),
  tips: varchar("tips", { length: 20 }).default("0").notNull(),
  fuelCost: varchar("fuelCost", { length: 20 }).default("0").notNull(),
  tollCost: varchar("tollCost", { length: 20 }).default("0").notNull(),
  maintenanceCost: varchar("maintenanceCost", { length: 20 }).default("0").notNull(),
  netProfit: varchar("netProfit", { length: 20 }).notNull(),
  pricePerKm: varchar("pricePerKm", { length: 20 }),
  pricePerMinute: varchar("pricePerMinute", { length: 20 }),
  multiplier: varchar("multiplier", { length: 20 }).default("1").notNull(),
  rideType: mysqlEnum("rideType", ["app", "particular"]).default("app").notNull(),
  status: mysqlEnum("status", ["ongoing", "completed", "cancelled"]).default("ongoing").notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ===== DAILY SUMMARIES TABLE =====
export const dailySummaries = mysqlTable("dailySummaries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: timestamp("date").notNull(),
  totalRevenue: varchar("totalRevenue", { length: 20 }).default("0").notNull(),
  totalTips: varchar("totalTips", { length: 20 }).default("0").notNull(),
  totalExpenses: varchar("totalExpenses", { length: 20 }).default("0").notNull(),
  netProfit: varchar("netProfit", { length: 20 }).default("0").notNull(),
  totalRides: int("totalRides").default(0).notNull(),
  totalDistance: varchar("totalDistance", { length: 20 }).default("0").notNull(),
  totalDuration: int("totalDuration").default(0).notNull(),
  isClosed: int("isClosed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ===== MONTHLY GOALS TABLE =====
export const monthlyGoals = mysqlTable("monthlyGoals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  month: int("month").notNull(),
  year: int("year").notNull(),
  targetNetProfit: varchar("targetNetProfit", { length: 20 }).notNull(),
  monthlyExpenses: varchar("monthlyExpenses", { length: 20 }).default("0").notNull(),
  daysWorked: int("daysWorked").default(0).notNull(),
  currentProgress: varchar("currentProgress", { length: 20 }).default("0").notNull(),
  dailyTarget: varchar("dailyTarget", { length: 20 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ===== OFFERS TABLE (Marketplace) =====
export const offers = mysqlTable("offers", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  price: varchar("price", { length: 20 }).notNull(),
  originalPrice: varchar("originalPrice", { length: 20 }),
  storeName: varchar("storeName", { length: 255 }).notNull(),
  storeUrl: text("storeUrl").notNull(),
  affiliateUrl: text("affiliateUrl").notNull(),
  imageUrl: text("imageUrl"),
  couponCode: varchar("couponCode", { length: 100 }),
  category: varchar("category", { length: 100 }),
  trustScore: int("trustScore").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  isApproved: int("isApproved").default(0).notNull(),
  source: mysqlEnum("source", ["manual", "ai"]).default("manual").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ===== WISHLISTS TABLE =====
export const wishlists = mysqlTable("wishlists", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  offerId: int("offerId").notNull(),
  alertOnPriceDrop: int("alertOnPriceDrop").default(1).notNull(),
  alertOnCoupon: int("alertOnCoupon").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ===== PRICE HISTORY TABLE =====
export const priceHistory = mysqlTable("priceHistory", {
  id: int("id").autoincrement().primaryKey(),
  offerId: int("offerId").notNull(),
  price: varchar("price", { length: 20 }).notNull(),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

// ===== SUBSCRIPTIONS TABLE =====
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  plan: mysqlEnum("plan", ["monthly", "semestral", "annual"]).notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "expired"]).default("active").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate").notNull(),
  autoRenew: int("autoRenew").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ===== AFFILIATE CONVERSIONS TABLE =====
export const affiliateConversions = mysqlTable("affiliateConversions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  offerId: int("offerId").notNull(),
  commission: varchar("commission", { length: 20 }).default("0").notNull(),
  conversionDate: timestamp("conversionDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ===== DEMAND AREAS TABLE =====
export const demandAreas = mysqlTable("demandAreas", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  latitude: varchar("latitude", { length: 20 }).notNull(),
  longitude: varchar("longitude", { length: 20 }).notNull(),
  demandLevel: mysqlEnum("demandLevel", ["low", "medium", "high"]).default("medium").notNull(),
  eventType: varchar("eventType", { length: 100 }),
  description: text("description"),
  isActive: int("isActive").default(1).notNull(),
  startTime: timestamp("startTime"),
  endTime: timestamp("endTime"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ===== FUEL STATIONS TABLE =====
export const fuelStations = mysqlTable("fuelStations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  latitude: varchar("latitude", { length: 20 }).notNull(),
  longitude: varchar("longitude", { length: 20 }).notNull(),
  address: text("address"),
  fuelPrice: varchar("fuelPrice", { length: 20 }),
  hasElectricCharging: int("hasElectricCharging").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ===== REFRESH TOKENS TABLE =====
export const refreshTokens = mysqlTable("refreshTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tokenHash: varchar("tokenHash", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  revokedAt: timestamp("revokedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ===== ADMIN LOGS TABLE =====
export const adminLogs = mysqlTable("adminLogs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  targetType: varchar("targetType", { length: 100 }),
  targetId: int("targetId"),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ===== CSRF STATES TABLE =====
export const csrfStates = mysqlTable("csrfStates", {
  id: int("id").autoincrement().primaryKey(),
  state: varchar("state", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  used: int("used").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ===== TYPES EXPORT =====
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;

export type Ride = typeof rides.$inferSelect;
export type InsertRide = typeof rides.$inferInsert;

export type DailySummary = typeof dailySummaries.$inferSelect;
export type InsertDailySummary = typeof dailySummaries.$inferInsert;

export type MonthlyGoal = typeof monthlyGoals.$inferSelect;
export type InsertMonthlyGoal = typeof monthlyGoals.$inferInsert;

export type Offer = typeof offers.$inferSelect;
export type InsertOffer = typeof offers.$inferInsert;

export type Wishlist = typeof wishlists.$inferSelect;
export type InsertWishlist = typeof wishlists.$inferInsert;

export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = typeof priceHistory.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

export type AffiliateConversion = typeof affiliateConversions.$inferSelect;
export type InsertAffiliateConversion = typeof affiliateConversions.$inferInsert;

export type DemandArea = typeof demandAreas.$inferSelect;
export type InsertDemandArea = typeof demandAreas.$inferInsert;

export type FuelStation = typeof fuelStations.$inferSelect;
export type InsertFuelStation = typeof fuelStations.$inferInsert;

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type InsertRefreshToken = typeof refreshTokens.$inferInsert;

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = typeof adminLogs.$inferInsert;

export type CsrfState = typeof csrfStates.$inferSelect;
export type InsertCsrfState = typeof csrfStates.$inferInsert;
