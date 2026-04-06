/**
 * Serviço de Planos
 * Define 3 planos (Básico, Top, Premium) com funcionalidades diferenciadas
 * Respeita períodos: mensal, semestral, anual
 */

export type PlanType = "basic" | "top" | "premium";
export type BillingPeriod = "monthly" | "semestral" | "annual";

export interface PlanFeatures {
  // Comissões
  referralCommissionRate: number; // 20%, 25%, 30%
  maxMonthlyCommissions: number; // Limite de comissões por mês
  
  // Marketplace
  aiOfferCuration: boolean; // Curadoria de ofertas com IA
  advancedSearch: boolean; // Busca avançada
  priceAlerts: boolean; // Alertas de preço
  couponAlerts: boolean; // Alertas de cupons
  wishlist: boolean; // Lista de desejos
  
  // Análise
  advancedAnalytics: boolean; // Analytics avançado
  customReports: boolean; // Relatórios personalizados
  exportData: boolean; // Exportar dados
  
  // Suporte
  prioritySupport: boolean; // Suporte prioritário
  dedicatedManager: boolean; // Gerente dedicado
  
  // Saques
  dailyWithdrawalLimit: number; // Limite diário de saque
  monthlyWithdrawalFee: number; // Taxa de saque mensal
  instantWithdrawal: boolean; // Saque instantâneo
  
  // Gamificação
  badges: boolean; // Badges e achievements
  leaderboard: boolean; // Leaderboard
  
  // Limites
  maxReferralsPerDay: number; // Máximo de referências por dia
  maxWithdrawalsPerMonth: number; // Máximo de saques por mês
}

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  features: PlanFeatures;
  pricing: {
    monthly: number;
    semestral: number;
    annual: number;
  };
  discounts: {
    semestral: number; // % de desconto
    annual: number; // % de desconto
  };
}

export const PLANS: Record<PlanType, Plan> = {
  basic: {
    id: "basic",
    name: "Básico",
    description: "Perfeito para começar",
    features: {
      referralCommissionRate: 0.2, // 20%
      maxMonthlyCommissions: 5000,
      
      aiOfferCuration: false,
      advancedSearch: false,
      priceAlerts: false,
      couponAlerts: false,
      wishlist: true,
      
      advancedAnalytics: false,
      customReports: false,
      exportData: false,
      
      prioritySupport: false,
      dedicatedManager: false,
      
      dailyWithdrawalLimit: 500,
      monthlyWithdrawalFee: 5,
      instantWithdrawal: false,
      
      badges: false,
      leaderboard: false,
      
      maxReferralsPerDay: 10,
      maxWithdrawalsPerMonth: 4,
    },
    pricing: {
      monthly: 29.99,
      semestral: 149.99,
      annual: 249.99,
    },
    discounts: {
      semestral: 0.17, // 17% de desconto
      annual: 0.33, // 33% de desconto
    },
  },

  top: {
    id: "top",
    name: "Top",
    description: "Para motoristas profissionais",
    features: {
      referralCommissionRate: 0.25, // 25%
      maxMonthlyCommissions: 15000,
      
      aiOfferCuration: true,
      advancedSearch: true,
      priceAlerts: true,
      couponAlerts: false,
      wishlist: true,
      
      advancedAnalytics: true,
      customReports: false,
      exportData: true,
      
      prioritySupport: true,
      dedicatedManager: false,
      
      dailyWithdrawalLimit: 2000,
      monthlyWithdrawalFee: 2,
      instantWithdrawal: false,
      
      badges: true,
      leaderboard: true,
      
      maxReferralsPerDay: 50,
      maxWithdrawalsPerMonth: 8,
    },
    pricing: {
      monthly: 79.99,
      semestral: 399.99,
      annual: 699.99,
    },
    discounts: {
      semestral: 0.17, // 17% de desconto
      annual: 0.33, // 33% de desconto
    },
  },

  premium: {
    id: "premium",
    name: "Premium",
    description: "Máximo de funcionalidades",
    features: {
      referralCommissionRate: 0.3, // 30%
      maxMonthlyCommissions: 50000,
      
      aiOfferCuration: true,
      advancedSearch: true,
      priceAlerts: true,
      couponAlerts: true,
      wishlist: true,
      
      advancedAnalytics: true,
      customReports: true,
      exportData: true,
      
      prioritySupport: true,
      dedicatedManager: true,
      
      dailyWithdrawalLimit: 10000,
      monthlyWithdrawalFee: 0,
      instantWithdrawal: true,
      
      badges: true,
      leaderboard: true,
      
      maxReferralsPerDay: 500,
      maxWithdrawalsPerMonth: 30,
    },
    pricing: {
      monthly: 199.99,
      semestral: 999.99,
      annual: 1799.99,
    },
    discounts: {
      semestral: 0.17, // 17% de desconto
      annual: 0.33, // 33% de desconto
    },
  },
};

/**
 * Obtém plano por ID
 */
export function getPlan(planId: PlanType): Plan {
  return PLANS[planId];
}

/**
 * Obtém preço com desconto
 */
export function getPriceWithDiscount(
  planId: PlanType,
  period: BillingPeriod
): { price: number; discount: number; originalPrice: number } {
  const plan = getPlan(planId);
  const basePrice = plan.pricing[period];

  let discount = 0;
  if (period === "semestral") {
    discount = plan.discounts.semestral;
  } else if (period === "annual") {
    discount = plan.discounts.annual;
  }

  const finalPrice = basePrice * (1 - discount);

  return {
    price: finalPrice,
    discount,
    originalPrice: basePrice,
  };
}

/**
 * Calcula comissão baseada no plano
 */
export function calculateCommissionByPlan(
  planId: PlanType,
  referralAmount: number
): number {
  const plan = getPlan(planId);
  return referralAmount * plan.features.referralCommissionRate;
}

/**
 * Verifica se recurso está disponível no plano
 */
export function isFeatureAvailable(
  planId: PlanType,
  feature: keyof PlanFeatures
): boolean {
  const plan = getPlan(planId);
  const value = plan.features[feature];
  
  // Se é booleano, retorna direto
  if (typeof value === "boolean") {
    return value;
  }
  
  // Se é número, retorna true se > 0
  return (value as number) > 0;
}

/**
 * Valida se operação é permitida no plano
 */
export function validatePlanLimit(
  planId: PlanType,
  limitType: "dailyWithdrawal" | "monthlyCommission" | "referralsPerDay" | "withdrawalsPerMonth",
  currentValue: number
): { allowed: boolean; limit: number; remaining: number } {
  const plan = getPlan(planId);

  let limit = 0;
  switch (limitType) {
    case "dailyWithdrawal":
      limit = plan.features.dailyWithdrawalLimit;
      break;
    case "monthlyCommission":
      limit = plan.features.maxMonthlyCommissions;
      break;
    case "referralsPerDay":
      limit = plan.features.maxReferralsPerDay;
      break;
    case "withdrawalsPerMonth":
      limit = plan.features.maxWithdrawalsPerMonth;
      break;
  }

  const allowed = currentValue < limit;
  const remaining = limit - currentValue;

  return { allowed, limit, remaining };
}

/**
 * Obtém todos os planos com preços
 */
export function getAllPlans(period: BillingPeriod): Array<Plan & { finalPrice: number; discount: number }> {
  return (Object.keys(PLANS) as PlanType[]).map((planId) => {
    const plan = getPlan(planId);
    const pricing = getPriceWithDiscount(planId, period);

    return {
      ...plan,
      finalPrice: pricing.price,
      discount: pricing.discount,
    };
  });
}

/**
 * Compara dois planos
 */
export function comparePlans(planId1: PlanType, planId2: PlanType): {
  plan1: Plan;
  plan2: Plan;
  differences: Array<{ feature: string; plan1Value: any; plan2Value: any }>;
} {
  const plan1 = getPlan(planId1);
  const plan2 = getPlan(planId2);
  const differences: Array<{ feature: string; plan1Value: any; plan2Value: any }> = [];

  const features = Object.keys(plan1.features) as Array<keyof PlanFeatures>;
  features.forEach((feature) => {
    if (plan1.features[feature] !== plan2.features[feature]) {
      differences.push({
        feature,
        plan1Value: plan1.features[feature],
        plan2Value: plan2.features[feature],
      });
    }
  });

  return { plan1, plan2, differences };
}

/**
 * Calcula economia ao fazer upgrade
 */
export function calculateUpgradeSavings(
  currentPlanId: PlanType,
  newPlanId: PlanType,
  period: BillingPeriod,
  monthsRemaining: number
): { savingsPerMonth: number; totalSavings: number; paybackPeriod: number } {
  const currentPrice = getPriceWithDiscount(currentPlanId, period).price;
  const newPrice = getPriceWithDiscount(newPlanId, period).price;

  const currentPlan = getPlan(currentPlanId);
  const newPlan = getPlan(newPlanId);

  // Economia em comissões por mês
  const commissionIncrease =
    (newPlan.features.referralCommissionRate - currentPlan.features.referralCommissionRate) * 1000; // Assumindo 1000 em referências

  const savingsPerMonth = commissionIncrease - (newPrice - currentPrice);
  const totalSavings = savingsPerMonth * monthsRemaining;
  const paybackPeriod = (newPrice - currentPrice) / (commissionIncrease || 1);

  return {
    savingsPerMonth: Math.max(0, savingsPerMonth),
    totalSavings: Math.max(0, totalSavings),
    paybackPeriod: Math.max(0, paybackPeriod),
  };
}
