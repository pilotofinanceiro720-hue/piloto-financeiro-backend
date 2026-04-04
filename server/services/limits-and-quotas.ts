/**
 * Serviço de Limites e Quotas
 * Controla limites diários/mensais de saques, velocidade de referências e score de confiabilidade
 */

export interface UserLimits {
  userId: number;
  dailyWithdrawalLimit: number;
  monthlyWithdrawalLimit: number;
  maxWithdrawalsPerMonth: number;
  referralVelocityLimit: number; // máximo de referências por hora
  trustScore: number; // 0-100
  trustScoreStatus: "low" | "medium" | "high" | "verified";
}

export interface LimitStatus {
  userId: number;
  dailyWithdrawn: number;
  dailyRemaining: number;
  monthlyWithdrawn: number;
  monthlyRemaining: number;
  withdrawalsThisMonth: number;
  withdrawalsRemaining: number;
  referralsThisHour: number;
  referralLimitReached: boolean;
  trustScore: number;
  canWithdraw: boolean;
  canRefer: boolean;
}

export interface TrustScoreFactors {
  accountAge: number; // dias
  completedReferrals: number;
  cancelledReferrals: number;
  churnRate: number;
  paymentFailureRate: number;
  fraudAlerts: number;
  withdrawalHistory: number; // saques completados
  accountVerification: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
}

/**
 * Configurações padrão de limites
 */
export const DEFAULT_LIMITS = {
  dailyWithdrawalLimit: 5000, // R$ 5.000
  monthlyWithdrawalLimit: 50000, // R$ 50.000
  maxWithdrawalsPerMonth: 4,
  referralVelocityLimit: 10, // máximo de referências por hora
  minTrustScoreForWithdrawal: 20,
  minTrustScoreForReferral: 10,
};

/**
 * Obtém limites do usuário
 */
export async function getUserLimits(userId: number): Promise<UserLimits> {
  try {
    // TODO: Buscar do banco de dados
    // const limits = await database.select()
    //   .from(userLimits)
    //   .where(eq(userLimits.userId, userId))
    //   .limit(1);

    // if (limits.length === 0) {
    //   return getDefaultLimits(userId);
    // }

    // return limits[0];

    console.log(`Obtendo limites do usuário ${userId}`);
    return getDefaultLimits(userId);
  } catch (error) {
    console.error("Erro ao obter limites do usuário:", error);
    return getDefaultLimits(userId);
  }
}

/**
 * Obtém limites padrão
 */
export function getDefaultLimits(userId: number): UserLimits {
  return {
    userId,
    dailyWithdrawalLimit: DEFAULT_LIMITS.dailyWithdrawalLimit,
    monthlyWithdrawalLimit: DEFAULT_LIMITS.monthlyWithdrawalLimit,
    maxWithdrawalsPerMonth: DEFAULT_LIMITS.maxWithdrawalsPerMonth,
    referralVelocityLimit: DEFAULT_LIMITS.referralVelocityLimit,
    trustScore: 50,
    trustScoreStatus: "medium",
  };
}

/**
 * Obtém status de limites do usuário
 */
export async function getLimitStatus(userId: number): Promise<LimitStatus> {
  try {
    const limits = await getUserLimits(userId);
    const trustScore = await calculateTrustScore(userId);

    // TODO: Buscar dados de saque do mês
    // const monthStart = new Date();
    // monthStart.setDate(1);
    // const monthWithdrawals = await database.select()
    //   .from(withdrawalRequests)
    //   .where(
    //     and(
    //       eq(withdrawalRequests.userId, userId),
    //       gte(withdrawalRequests.createdAt, monthStart),
    //       eq(withdrawalRequests.status, 'completed')
    //     )
    //   );

    // const dailyStart = new Date();
    // dailyStart.setHours(0, 0, 0, 0);
    // const dailyWithdrawals = await database.select()
    //   .from(withdrawalRequests)
    //   .where(
    //     and(
    //       eq(withdrawalRequests.userId, userId),
    //       gte(withdrawalRequests.createdAt, dailyStart),
    //       eq(withdrawalRequests.status, 'completed')
    //     )
    //   );

    // const monthlyWithdrawn = monthWithdrawals.reduce((sum, w) => sum + w.netAmount, 0);
    // const dailyWithdrawn = dailyWithdrawals.reduce((sum, w) => sum + w.netAmount, 0);

    // TODO: Buscar referências da última hora
    // const hourStart = new Date();
    // hourStart.setHours(hourStart.getHours() - 1);
    // const referralsThisHour = await database.select()
    //   .from(referralConversions)
    //   .where(
    //     and(
    //       eq(referralConversions.referrerId, userId),
    //       gte(referralConversions.createdAt, hourStart)
    //     )
    //   );

    const dailyWithdrawn = 0;
    const monthlyWithdrawn = 0;
    const withdrawalsThisMonth = 0;
    const referralsThisHour = 0;

    const canWithdraw =
      dailyWithdrawn < limits.dailyWithdrawalLimit &&
      monthlyWithdrawn < limits.monthlyWithdrawalLimit &&
      withdrawalsThisMonth < limits.maxWithdrawalsPerMonth &&
      trustScore.score >= DEFAULT_LIMITS.minTrustScoreForWithdrawal;

    const canRefer =
      referralsThisHour < limits.referralVelocityLimit &&
      trustScore.score >= DEFAULT_LIMITS.minTrustScoreForReferral;

    console.log(`Obtendo status de limites para usuário ${userId}`);

    return {
      userId,
      dailyWithdrawn,
      dailyRemaining: Math.max(0, limits.dailyWithdrawalLimit - dailyWithdrawn),
      monthlyWithdrawn,
      monthlyRemaining: Math.max(0, limits.monthlyWithdrawalLimit - monthlyWithdrawn),
      withdrawalsThisMonth,
      withdrawalsRemaining: Math.max(0, limits.maxWithdrawalsPerMonth - withdrawalsThisMonth),
      referralsThisHour,
      referralLimitReached: referralsThisHour >= limits.referralVelocityLimit,
      trustScore: trustScore.score,
      canWithdraw,
      canRefer,
    };
  } catch (error) {
    console.error("Erro ao obter status de limites:", error);
    return {
      userId,
      dailyWithdrawn: 0,
      dailyRemaining: DEFAULT_LIMITS.dailyWithdrawalLimit,
      monthlyWithdrawn: 0,
      monthlyRemaining: DEFAULT_LIMITS.monthlyWithdrawalLimit,
      withdrawalsThisMonth: 0,
      withdrawalsRemaining: DEFAULT_LIMITS.maxWithdrawalsPerMonth,
      referralsThisHour: 0,
      referralLimitReached: false,
      trustScore: 50,
      canWithdraw: true,
      canRefer: true,
    };
  }
}

/**
 * Calcula score de confiabilidade do usuário
 */
export async function calculateTrustScore(
  userId: number
): Promise<{ score: number; status: "low" | "medium" | "high" | "verified" }> {
  try {
    const factors = await getTrustScoreFactors(userId);

    // Cálculo do score baseado em fatores
    let score = 50; // Score inicial

    // Fator: Idade da conta (0-15 pontos)
    const accountAgeDays = factors.accountAge;
    if (accountAgeDays >= 365) score += 15;
    else if (accountAgeDays >= 180) score += 10;
    else if (accountAgeDays >= 90) score += 5;

    // Fator: Referências completadas (0-20 pontos)
    const referralSuccessRate =
      factors.completedReferrals + factors.cancelledReferrals > 0
        ? factors.completedReferrals / (factors.completedReferrals + factors.cancelledReferrals)
        : 0;
    score += referralSuccessRate * 20;

    // Fator: Taxa de churn (0 a -20 pontos)
    score -= factors.churnRate * 20;

    // Fator: Taxa de falha de pagamento (0 a -15 pontos)
    score -= factors.paymentFailureRate * 15;

    // Fator: Alertas de fraude (0 a -25 pontos)
    score -= Math.min(factors.fraudAlerts * 5, 25);

    // Fator: Histórico de saques (0-10 pontos)
    if (factors.withdrawalHistory >= 5) score += 10;
    else if (factors.withdrawalHistory >= 3) score += 5;

    // Fator: Verificação de conta (0-10 pontos)
    if (factors.accountVerification) score += 5;
    if (factors.phoneVerified) score += 3;
    if (factors.emailVerified) score += 2;

    // Limitar score entre 0 e 100
    score = Math.max(0, Math.min(100, score));

    // Determinar status
    let status: "low" | "medium" | "high" | "verified" = "low";
    if (score >= 80) status = "verified";
    else if (score >= 60) status = "high";
    else if (score >= 40) status = "medium";

    console.log(`Score de confiabilidade calculado para usuário ${userId}: ${score}`);

    return { score, status };
  } catch (error) {
    console.error("Erro ao calcular score de confiabilidade:", error);
    return { score: 50, status: "medium" };
  }
}

/**
 * Obtém fatores de score de confiabilidade
 */
export async function getTrustScoreFactors(userId: number): Promise<TrustScoreFactors> {
  try {
    // TODO: Buscar dados do banco de dados
    // const user = await database.select()
    //   .from(users)
    //   .where(eq(users.id, userId))
    //   .limit(1);

    // const accountAgeDays = user.length > 0
    //   ? Math.floor((Date.now() - user[0].createdAt.getTime()) / (1000 * 60 * 60 * 24))
    //   : 0;

    // const referrals = await database.select()
    //   .from(referralConversions)
    //   .where(eq(referralConversions.referrerId, userId));

    // const completedReferrals = referrals.filter(r => r.status === 'completed').length;
    // const cancelledReferrals = referrals.filter(r => r.status === 'cancelled').length;
    // const churnRate = referrals.length > 0 ? cancelledReferrals / referrals.length : 0;

    // const failedPayments = referrals.filter(r => r.paymentStatus === 'failed').length;
    // const paymentFailureRate = referrals.length > 0 ? failedPayments / referrals.length : 0;

    // const fraudAlerts = await database.select()
    //   .from(fraudAlerts)
    //   .where(eq(fraudAlerts.userId, userId));

    // const withdrawals = await database.select()
    //   .from(withdrawalRequests)
    //   .where(
    //     and(
    //       eq(withdrawalRequests.userId, userId),
    //       eq(withdrawalRequests.status, 'completed')
    //     )
    //   );

    console.log(`Obtendo fatores de score de confiabilidade para usuário ${userId}`);

    return {
      accountAge: 0,
      completedReferrals: 0,
      cancelledReferrals: 0,
      churnRate: 0,
      paymentFailureRate: 0,
      fraudAlerts: 0,
      withdrawalHistory: 0,
      accountVerification: false,
      phoneVerified: false,
      emailVerified: false,
    };
  } catch (error) {
    console.error("Erro ao obter fatores de score:", error);
    return {
      accountAge: 0,
      completedReferrals: 0,
      cancelledReferrals: 0,
      churnRate: 0,
      paymentFailureRate: 0,
      fraudAlerts: 0,
      withdrawalHistory: 0,
      accountVerification: false,
      phoneVerified: false,
      emailVerified: false,
    };
  }
}

/**
 * Valida se usuário pode fazer saque
 */
export async function validateWithdrawalLimit(
  userId: number,
  amount: number
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const status = await getLimitStatus(userId);

    if (!status.canWithdraw) {
      return { allowed: false, reason: "Usuário não está autorizado a fazer saques" };
    }

    if (amount > status.dailyRemaining) {
      return { allowed: false, reason: `Limite diário excedido. Restante: R$ ${status.dailyRemaining.toFixed(2)}` };
    }

    if (amount > status.monthlyRemaining) {
      return { allowed: false, reason: `Limite mensal excedido. Restante: R$ ${status.monthlyRemaining.toFixed(2)}` };
    }

    if (status.withdrawalsRemaining <= 0) {
      return { allowed: false, reason: "Número máximo de saques mensais atingido" };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Erro ao validar limite de saque:", error);
    return { allowed: false, reason: "Erro ao validar limite" };
  }
}

/**
 * Valida se usuário pode fazer referência
 */
export async function validateReferralLimit(userId: number): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const status = await getLimitStatus(userId);

    if (!status.canRefer) {
      return { allowed: false, reason: "Usuário não está autorizado a fazer referências" };
    }

    if (status.referralLimitReached) {
      return { allowed: false, reason: "Limite de referências por hora atingido" };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Erro ao validar limite de referência:", error);
    return { allowed: false, reason: "Erro ao validar limite" };
  }
}

/**
 * Atualiza limites do usuário
 */
export async function updateUserLimits(
  userId: number,
  limits: Partial<UserLimits>
): Promise<boolean> {
  try {
    // TODO: Atualizar no banco de dados
    // await database.update(userLimits)
    //   .set(limits)
    //   .where(eq(userLimits.userId, userId));

    console.log(`Limites atualizados para usuário ${userId}`);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar limites do usuário:", error);
    return false;
  }
}

/**
 * Incrementa score de confiabilidade
 */
export async function incrementTrustScore(userId: number, points: number): Promise<boolean> {
  try {
    const limits = await getUserLimits(userId);
    const newScore = Math.min(100, limits.trustScore + points);

    await updateUserLimits(userId, { trustScore: newScore });

    console.log(`Score de confiabilidade incrementado para usuário ${userId}: +${points} pontos`);
    return true;
  } catch (error) {
    console.error("Erro ao incrementar score de confiabilidade:", error);
    return false;
  }
}

/**
 * Decrementa score de confiabilidade
 */
export async function decrementTrustScore(userId: number, points: number): Promise<boolean> {
  try {
    const limits = await getUserLimits(userId);
    const newScore = Math.max(0, limits.trustScore - points);

    await updateUserLimits(userId, { trustScore: newScore });

    console.log(`Score de confiabilidade decrementado para usuário ${userId}: -${points} pontos`);
    return true;
  } catch (error) {
    console.error("Erro ao decrementar score de confiabilidade:", error);
    return false;
  }
}
