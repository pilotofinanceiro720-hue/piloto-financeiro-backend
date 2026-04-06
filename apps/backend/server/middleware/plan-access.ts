/**
 * Middleware de Controle de Acesso por Plano
 * Valida acesso a funcionalidades baseado no plano do usuário
 */

import { PlanType, isFeatureAvailable, validatePlanLimit } from "@/server/services/plans";

export interface UserSubscription {
  userId: number;
  planId: PlanType;
  billingPeriod: "monthly" | "semestral" | "annual";
  startDate: Date;
  endDate: Date;
  status: "active" | "expired" | "cancelled";
  autoRenew: boolean;
}

/**
 * Valida se usuário tem acesso a uma funcionalidade
 */
export function checkFeatureAccess(
  subscription: UserSubscription,
  feature: string
): { allowed: boolean; reason?: string } {
  // Verifica se assinatura está ativa
  if (subscription.status !== "active") {
    return {
      allowed: false,
      reason: "Assinatura expirada ou cancelada",
    };
  }

  // Verifica se data de expiração passou
  if (new Date() > subscription.endDate) {
    return {
      allowed: false,
      reason: "Assinatura expirada",
    };
  }

  // Verifica se feature está disponível no plano
  const features = [
    "aiOfferCuration",
    "advancedSearch",
    "priceAlerts",
    "couponAlerts",
    "advancedAnalytics",
    "customReports",
    "exportData",
    "prioritySupport",
    "dedicatedManager",
    "instantWithdrawal",
    "badges",
    "leaderboard",
  ];

  if (features.includes(feature)) {
    const available = isFeatureAvailable(subscription.planId, feature as any);
    if (!available) {
      return {
        allowed: false,
        reason: `Funcionalidade disponível apenas nos planos Top e Premium`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Valida limite de operação
 */
export function checkOperationLimit(
  subscription: UserSubscription,
  limitType: "dailyWithdrawal" | "monthlyCommission" | "referralsPerDay" | "withdrawalsPerMonth",
  currentValue: number
): { allowed: boolean; limit: number; remaining: number; reason?: string } {
  // Verifica se assinatura está ativa
  if (subscription.status !== "active") {
    return {
      allowed: false,
      limit: 0,
      remaining: 0,
      reason: "Assinatura expirada",
    };
  }

  const validation = validatePlanLimit(subscription.planId, limitType, currentValue);

  if (!validation.allowed) {
    return {
      allowed: false,
      limit: validation.limit,
      remaining: 0,
      reason: `Limite de ${limitType} atingido: ${validation.limit}`,
    };
  }

  return {
    allowed: true,
    limit: validation.limit,
    remaining: validation.remaining,
  };
}

/**
 * Middleware Express para validar acesso a rota
 */
export function requirePlanFeature(feature: string) {
  return async (req: any, res: any, next: any) => {
    try {
      // TODO: Obter subscription do usuário
      // const subscription = await getUserSubscription(req.user.id);

      // Mock para desenvolvimento
      const subscription: UserSubscription = {
        userId: req.user?.id || 1,
        planId: "premium",
        billingPeriod: "monthly",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "active",
        autoRenew: true,
      };

      const access = checkFeatureAccess(subscription, feature);

      if (!access.allowed) {
        return res.status(403).json({
          error: "Acesso negado",
          reason: access.reason,
          suggestion: "Faça upgrade para acessar esta funcionalidade",
        });
      }

      req.subscription = subscription;
      next();
    } catch (error) {
      console.error("Erro ao validar acesso:", error);
      res.status(500).json({ error: "Erro ao validar acesso" });
    }
  };
}

/**
 * Middleware Express para validar limite de operação
 */
export function validateOperationLimit(
  limitType: "dailyWithdrawal" | "monthlyCommission" | "referralsPerDay" | "withdrawalsPerMonth"
) {
  return async (req: any, res: any, next: any) => {
    try {
      // TODO: Obter subscription do usuário
      // const subscription = await getUserSubscription(req.user.id);

      // Mock para desenvolvimento
      const subscription: UserSubscription = {
        userId: req.user?.id || 1,
        planId: "premium",
        billingPeriod: "monthly",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "active",
        autoRenew: true,
      };

      const currentValue = req.body.value || 0;
      const validation = checkOperationLimit(subscription, limitType, currentValue);

      if (!validation.allowed) {
        return res.status(429).json({
          error: "Limite atingido",
          reason: validation.reason,
          limit: validation.limit,
          remaining: validation.remaining,
        });
      }

      req.subscription = subscription;
      req.operationLimit = validation;
      next();
    } catch (error) {
      console.error("Erro ao validar limite:", error);
      res.status(500).json({ error: "Erro ao validar limite" });
    }
  };
}

/**
 * Obtém informações de acesso do usuário
 */
export function getUserAccessInfo(subscription: UserSubscription): {
  planName: string;
  features: string[];
  limits: Record<string, number>;
  daysRemaining: number;
  canUpgrade: boolean;
} {
  const daysRemaining = Math.ceil(
    (subscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const featureMap: Record<string, string[]> = {
    basic: [
      "Comissão 20%",
      "Limite R$ 5.000/mês",
      "Saque 2x por mês",
      "Lista de desejos",
      "Suporte por email",
    ],
    top: [
      "Comissão 25%",
      "Limite R$ 15.000/mês",
      "Saque 2x por semana",
      "IA para ofertas",
      "Analytics avançado",
      "Suporte prioritário",
      "Badges e leaderboard",
    ],
    premium: [
      "Comissão 30%",
      "Limite R$ 50.000/mês",
      "Saque ilimitado",
      "IA para ofertas",
      "Analytics completo",
      "Gerente dedicado",
      "Saque instantâneo",
      "Relatórios personalizados",
    ],
  };

  const limitsMap: Record<string, Record<string, number>> = {
    basic: {
      dailyWithdrawal: 500,
      monthlyCommission: 5000,
      referralsPerDay: 10,
      withdrawalsPerMonth: 4,
    },
    top: {
      dailyWithdrawal: 2000,
      monthlyCommission: 15000,
      referralsPerDay: 50,
      withdrawalsPerMonth: 8,
    },
    premium: {
      dailyWithdrawal: 10000,
      monthlyCommission: 50000,
      referralsPerDay: 500,
      withdrawalsPerMonth: 30,
    },
  };

  return {
    planName: subscription.planId.charAt(0).toUpperCase() + subscription.planId.slice(1),
    features: featureMap[subscription.planId] || [],
    limits: limitsMap[subscription.planId] || {},
    daysRemaining,
    canUpgrade: subscription.planId !== "premium",
  };
}

/**
 * Valida se pode fazer downgrade
 */
export function canDowngrade(subscription: UserSubscription): {
  allowed: boolean;
  reason?: string;
} {
  // Não permite downgrade se há comissões pendentes
  // TODO: Verificar comissões pendentes
  // const pendingCommissions = await getPendingCommissions(subscription.userId);
  // if (pendingCommissions > 0) {
  //   return {
  //     allowed: false,
  //     reason: "Não é possível fazer downgrade com comissões pendentes",
  //   };
  // }

  return { allowed: true };
}

/**
 * Calcula economia ao fazer upgrade
 */
export function calculateUpgradeBenefit(
  currentPlan: PlanType,
  newPlan: PlanType,
  monthlyReferrals: number = 1000
): {
  monthlyIncrease: number;
  annualIncrease: number;
  paybackMonths: number;
} {
  const commissionRates: Record<PlanType, number> = {
    basic: 0.2,
    top: 0.25,
    premium: 0.3,
  };

  const prices: Record<PlanType, number> = {
    basic: 29.99,
    top: 79.99,
    premium: 199.99,
  };

  const currentCommission = monthlyReferrals * commissionRates[currentPlan];
  const newCommission = monthlyReferrals * commissionRates[newPlan];
  const commissionIncrease = newCommission - currentCommission;

  const priceIncrease = prices[newPlan] - prices[currentPlan];

  const monthlyIncrease = commissionIncrease - priceIncrease;
  const annualIncrease = monthlyIncrease * 12;
  const paybackMonths = priceIncrease > 0 ? Math.ceil(priceIncrease / commissionIncrease) : 0;

  return {
    monthlyIncrease: Math.max(0, monthlyIncrease),
    annualIncrease: Math.max(0, annualIncrease),
    paybackMonths: Math.max(0, paybackMonths),
  };
}
