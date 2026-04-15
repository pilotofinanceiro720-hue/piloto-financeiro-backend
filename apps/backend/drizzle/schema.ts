import { pgEnum, pgTable, text, timestamp, varchar, integer, boolean, serial, doublePrecision, jsonb } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: text("role").default("user").notNull(), // PostgreSQL doesn't have native enums like MySQL without extra setup, using text for simplicity or pgEnum
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const roleEnum = pgEnum("role", ["user", "admin"]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ===== VEHICLES TABLE =====
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  mileage: text("mileage").default("0").notNull(),
  fuelConsumption: text("fuelConsumption").notNull(),
  wearCoefficient: text("wearCoefficient").default("0.15").notNull(),
  averageMaintenanceCost: text("averageMaintenanceCost").default("0").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ===== RIDES TABLE =====
export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  vehicleId: integer("vehicleId").notNull(),
  origin: text("origin"),
  destination: text("destination"),
  distance: text("distance").notNull(),
  duration: integer("duration").notNull(),
  grossRevenue: text("grossRevenue").notNull(),
  tips: text("tips").default("0").notNull(),
  fuelCost: text("fuelCost").default("0").notNull(),
  tollCost: text("tollCost").default("0").notNull(),
  maintenanceCost: text("maintenanceCost").default("0").notNull(),
  netProfit: text("netProfit").notNull(),
  pricePerKm: text("pricePerKm"),
  pricePerMinute: text("pricePerMinute"),
  multiplier: text("multiplier").default("1").notNull(),
  rideType: text("rideType").default("app").notNull(),
  status: text("status").default("ongoing").notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ===== DAILY SUMMARIES TABLE =====
export const dailySummaries = pgTable("dailySummaries", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  date: timestamp("date").notNull(),
  totalRevenue: text("totalRevenue").default("0").notNull(),
  totalTips: text("totalTips").default("0").notNull(),
  totalExpenses: text("totalExpenses").default("0").notNull(),
  netProfit: text("netProfit").default("0").notNull(),
  totalRides: integer("totalRides").default(0).notNull(),
  totalDistance: text("totalDistance").default("0").notNull(),
  totalDuration: integer("totalDuration").default(0).notNull(),
  isClosed: boolean("isClosed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ===== MONTHLY GOALS TABLE =====
export const monthlyGoals = pgTable("monthlyGoals", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  targetNetProfit: text("targetNetProfit").notNull(),
  monthlyExpenses: text("monthlyExpenses").default("0").notNull(),
  daysWorked: integer("daysWorked").default(0).notNull(),
  currentProgress: text("currentProgress").default("0").notNull(),
  dailyTarget: text("dailyTarget").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ===== OFFERS TABLE (Marketplace) =====
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  price: text("price").notNull(),
  originalPrice: text("originalPrice"),
  storeName: varchar("storeName", { length: 255 }).notNull(),
  storeUrl: text("storeUrl").notNull(),
  affiliateUrl: text("affiliateUrl").notNull(),
  imageUrl: text("imageUrl"),
  couponCode: varchar("couponCode", { length: 100 }),
  category: varchar("category", { length: 100 }),
  trustScore: integer("trustScore").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  isApproved: boolean("isApproved").default(false).notNull(),
  source: text("source").default("manual").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ===== WISHLISTS TABLE =====
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  offerId: integer("offerId").notNull(),
  alertOnPriceDrop: boolean("alertOnPriceDrop").default(true).notNull(),
  alertOnCoupon: boolean("alertOnCoupon").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ===== PRICE HISTORY TABLE =====
export const priceHistory = pgTable("priceHistory", {
  id: serial("id").primaryKey(),
  offerId: integer("offerId").notNull(),
  price: text("price").notNull(),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

// ===== SUBSCRIPTIONS TABLE =====
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  plan: text("plan").notNull(),
  status: text("status").default("active").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate").notNull(),
  autoRenew: boolean("autoRenew").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ===== AFFILIATE CONVERSIONS TABLE =====
export const affiliateConversions = pgTable("affiliateConversions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  offerId: integer("offerId").notNull(),
  commission: text("commission").default("0").notNull(),
  conversionDate: timestamp("conversionDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ===== DEMAND AREAS TABLE =====
export const demandAreas = pgTable("demandAreas", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  demandLevel: text("demandLevel").default("medium").notNull(),
  eventType: varchar("eventType", { length: 100 }),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  startTime: timestamp("startTime"),
  endTime: timestamp("endTime"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ===== FUEL STATIONS TABLE =====
export const fuelStations = pgTable("fuelStations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  address: text("address"),
  fuelPrice: text("fuelPrice"),
  hasElectricCharging: boolean("hasElectricCharging").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ===== REFRESH TOKENS TABLE =====
export const refreshTokens = pgTable("refreshTokens", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  tokenHash: varchar("tokenHash", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  revokedAt: timestamp("revokedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ===== ADMIN LOGS TABLE =====
export const adminLogs = pgTable("adminLogs", {
  id: serial("id").primaryKey(),
  adminId: integer("adminId").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  targetType: varchar("targetType", { length: 100 }),
  targetId: integer("targetId"),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ===== CSRF STATES TABLE =====
export const csrfStates = pgTable("csrfStates", {
  id: serial("id").primaryKey(),
  state: varchar("state", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ===== PILOTO FINANCEIRO SPECIFIC TABLES =====

export const corridas_piloto = pgTable("corridas_piloto", {
  id: serial("id").primaryKey(),
  usuario_id: varchar("usuario_id", { length: 64 }).notNull(),
  valor: doublePrecision("valor").notNull(),
  distancia: doublePrecision("distancia").notNull(),
  tempo: integer("tempo").notNull(),
  plataforma: varchar("plataforma", { length: 50 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const metricas_agregadas = pgTable("metricas_agregadas", {
  id: serial("id").primaryKey(),
  usuario_id: varchar("usuario_id", { length: 64 }).notNull().unique(),
  ganho_total: doublePrecision("ganho_total").default(0).notNull(),
  km_total: doublePrecision("km_total").default(0).notNull(),
  horas_total: doublePrecision("horas_total").default(0).notNull(),
  media_rspkm: doublePrecision("media_rspkm").default(0).notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const despesas = pgTable("despesas", {
  id: serial("id").primaryKey(),
  usuario_id: varchar("usuario_id", { length: 64 }).notNull(),
  tipo: varchar("tipo", { length: 50 }).notNull(), // combustivel, manutencao, etc
  valor: doublePrecision("valor").notNull(),
  data: timestamp("data").defaultNow().notNull(),
  descricao: text("descricao"),
});

export const jornadas_turno = pgTable("jornadas_turno", {
  id: serial("id").primaryKey(),
  usuario_id: varchar("usuario_id", { length: 64 }).notNull(),
  iniciado_em: timestamp("iniciado_em").defaultNow().notNull(),
  encerrado_em: timestamp("encerrado_em"),
  ganho_bruto: doublePrecision("ganho_bruto").default(0),
  corridas_aceitas: integer("corridas_aceitas").default(0),
  km_rodados: doublePrecision("km_rodados").default(0),
  plataforma: varchar("plataforma", { length: 50 }),
});

export const overlay_criterios = pgTable("overlay_criterios", {
  id: serial("id").primaryKey(),
  usuario_id: varchar("usuario_id", { length: 64 }).notNull().unique(),
  rspkm_minimo: doublePrecision("rspkm_minimo").default(1.30),
  rsphora_minimo: doublePrecision("rsphora_minimo").default(50),
  valor_minimo: doublePrecision("valor_minimo").default(10),
  km_maximo_busca: doublePrecision("km_maximo_busca").default(2.0),
  plataformas_ativas: jsonb("plataformas_ativas").default(['uber', '99']),
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
