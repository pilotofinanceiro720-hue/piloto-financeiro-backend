/**
 * PILOTO FINANCEIRO — TIPOS TYPESCRIPT COMPLETOS
 * Definições de tipos para todas as entidades do sistema
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum PlanType {
  FREE = "free",
  BASICO = "basico",
  ESSENCIAL = "essencial",
  PREMIUM = "premium",
}

export enum PlanStatus {
  INACTIVE = "inactive",
  ACTIVE = "active",
  CANCELLED = "cancelled",
}

export enum RidePlatform {
  UBER = "uber",
  NINETYNINE = "99",
  LOGGI = "loggi",
  INDRIVER = "indriver",
  PARTICULAR = "particular",
}

export enum FuelType {
  GASOLINA = "gasolina",
  ETANOL = "etanol",
  FLEX = "flex",
  ELETRICO = "eletrico",
  HIBRIDO = "hibrido",
}

export enum ExpenseCategory {
  COMBUSTIVEL = "combustivel",
  ALIMENTACAO = "alimentacao",
  MANUTENCAO = "manutencao",
  ESTACIONAMENTO = "estacionamento",
  LIMPEZA = "limpeza",
  OUTROS = "outros",
}

export enum SubscriptionStatus {
  PENDING = "pending",
  ACTIVE = "active",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

export enum CommissionStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PAID = "paid",
}

export enum SessionStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  CLOSED = "closed",
}

export enum NotificationType {
  DEMAND_HIGH = "demand_high",
  OFFER = "offer",
  MAINTENANCE = "maintenance",
  PAYMENT = "payment",
  SYSTEM = "system",
}

export enum FraudType {
  MULTIPLE_ACCOUNTS = "multiple_accounts",
  FAKE_REFERRAL = "fake_referral",
  CHURN_ABUSE = "churn_abuse",
}

// ============================================================================
// TIPOS DE ENTIDADES
// ============================================================================

export interface User {
  id: number;
  name: string;
  email: string;
  googleId?: string;
  avatarUrl?: string;
  plan: PlanType;
  planStatus: PlanStatus;
  asaasCustomerId?: string;
  referralCode?: string;
  referredBy?: number;
  isAdmin: boolean;
  onboardingCompleted: boolean;
  lgpdConsent: boolean;
  lgpdConsentAt?: Date;
  notificationListenerConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: number;
  userId: number;
  brand?: string;
  model?: string;
  year?: number;
  fuelType?: FuelType;
  fuelConsumption?: number;
  fuelPrice?: number;
  monthlyPayment?: number;
  insuranceMonthly?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DriverGoals {
  id: number;
  userId: number;
  dailyGoal?: number;
  monthlyGoal?: number;
  minRatePerKm?: number;
  minRatePerHour?: number;
  workingDaysPerMonth: number;
  updatedAt: Date;
}

export interface Ride {
  id: number;
  userId: number;
  platform: RidePlatform;
  grossValue: number;
  netValue?: number;
  distanceKm?: number;
  durationMinutes?: number;
  ratePerKm?: number;
  ratePerHour?: number;
  multiplier: number;
  region?: string;
  city?: string;
  startedAt?: Date;
  endedAt?: Date;
  source: "manual" | "automatic";
  rawNotification?: string;
  belowGoal: boolean;
  createdAt: Date;
}

export interface Expense {
  id: number;
  userId: number;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  expenseDate: Date;
  createdAt: Date;
}

export interface DailySession {
  id: number;
  userId: number;
  sessionDate: Date;
  startedAt?: Date;
  endedAt?: Date;
  status: SessionStatus;
  pausedAt?: Date;
  totalRides: number;
  totalGross: number;
  totalNet: number;
  totalKm: number;
  totalExpenses: number;
  notes?: string;
}

export interface CityEvent {
  id: number;
  city: string;
  title: string;
  venue?: string;
  expectedAttendance?: number;
  tier: number;
  eventDate: Date;
  eventTime?: string;
  source?: string;
  createdAt: Date;
}

export interface Subscription {
  id: number;
  userId: number;
  asaasSubscriptionId?: string;
  plan: PlanType;
  billingCycle: "monthly" | "semiannual" | "annual";
  amount: number;
  status: SubscriptionStatus;
  startsAt?: Date;
  nextBillingAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
}

export interface ReferralCommission {
  id: number;
  referrerId?: number;
  referredId?: number;
  subscriptionId?: number;
  commissionRate?: number;
  amount?: number;
  status: CommissionStatus;
  confirmedAt?: Date;
  paidAt?: Date;
  createdAt: Date;
}

export interface Partner {
  id: number;
  name: string;
  category?: string;
  logoUrl?: string;
  websiteUrl?: string;
  affiliateUrl?: string;
  commissionType?: "fixed" | "percentage";
  commissionValue?: number;
  status: "active" | "inactive";
  createdAt: Date;
}

export interface Campaign {
  id: number;
  partnerId?: number;
  title: string;
  description?: string;
  targetPlan?: PlanType | "all";
  startsAt?: Date;
  endsAt?: Date;
  budget?: number;
  spent: number;
  status: "draft" | "active" | "ended";
  createdAt: Date;
}

export interface DriverScore {
  id: number;
  userId: number;
  month: Date;
  score?: number;
  ridesAboveGoalPct?: number;
  growthVsLastMonth?: number;
  consistencyPct?: number;
  goalReachedPct?: number;
  totalGross?: number;
  totalNet?: number;
  totalRides?: number;
  bestDay?: Date;
  bestRegion?: string;
  bestHour?: number;
  createdAt: Date;
}

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  body?: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
}

export interface FraudFlag {
  id: number;
  userId?: number;
  type?: FraudType;
  score: number;
  details?: Record<string, any>;
  resolved: boolean;
  createdAt: Date;
}

export interface FeatureFlag {
  id: number;
  name: string;
  enabled: boolean;
  tier: number;
  description?: string;
  createdAt: Date;
}

// ============================================================================
// TIPOS DE REQUEST/RESPONSE
// ============================================================================

export interface CreateRideRequest {
  platform: RidePlatform;
  grossValue: number;
  netValue?: number;
  distanceKm?: number;
  durationMinutes?: number;
  region?: string;
  city?: string;
}

export interface UpdateRideRequest {
  netValue?: number;
  distanceKm?: number;
  durationMinutes?: number;
}

export interface CreateExpenseRequest {
  category: ExpenseCategory;
  amount: number;
  description?: string;
  expenseDate: Date;
}

export interface UpdateExpenseRequest {
  category?: ExpenseCategory;
  amount?: number;
  description?: string;
}

export interface CreateSubscriptionRequest {
  plan: PlanType;
  billingCycle: "monthly" | "semiannual" | "annual";
}

export interface DashboardMetrics {
  todayEarnings: number;
  monthEarnings: number;
  totalRides: number;
  onlineTime: number; // minutos
  dailyGoalProgress: number; // percentual
  monthlyGoalProgress: number; // percentual
  averageRating?: number;
  bestRegion?: string;
}

export interface MonthlyReport {
  month: Date;
  totalGross: number;
  totalNet: number;
  totalExpenses: number;
  totalRides: number;
  averagePerRide: number;
  averagePerHour: number;
  bestDay: Date;
  bestRegion: string;
  insights: string[]; // Gerado pela IA
}

export interface RankingEntry {
  position: number;
  userId: number;
  userName: string;
  score: number;
  totalEarnings: number;
  totalRides: number;
}

// ============================================================================
// TIPOS DE CONFIGURAÇÃO
// ============================================================================

export interface PlanConfig {
  name: PlanType;
  price: number;
  features: string[];
  tier: number;
}

export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  [PlanType.FREE]: {
    name: PlanType.FREE,
    price: 0,
    features: ["Dashboard básico", "Histórico de corridas", "Suporte por email"],
    tier: 1,
  },
  [PlanType.BASICO]: {
    name: PlanType.BASICO,
    price: 29.9,
    features: [
      "Dashboard completo",
      "Análise de demanda",
      "Marketplace",
      "Suporte prioritário",
    ],
    tier: 2,
  },
  [PlanType.ESSENCIAL]: {
    name: PlanType.ESSENCIAL,
    price: 59.9,
    features: [
      "Tudo do Básico",
      "IA de otimização",
      "Relatórios mensais",
      "Eventos da cidade",
    ],
    tier: 3,
  },
  [PlanType.PREMIUM]: {
    name: PlanType.PREMIUM,
    price: 99.9,
    features: [
      "Tudo do Essencial",
      "Evidência visual",
      "Auditor avançado",
      "Suporte 24/7",
    ],
    tier: 4,
  },
};

// ============================================================================
// TIPOS DE ERRO
// ============================================================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  PAYMENT_ERROR: "PAYMENT_ERROR",
  FRAUD_DETECTED: "FRAUD_DETECTED",
} as const;
