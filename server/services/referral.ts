/**
 * Serviço de Referência e Programa de Afiliação
 * Gerencia convites, rastreamento de conversões e pagamentos de comissão
 */

export interface ReferralCode {
  id: string;
  userId: number;
  code: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface ReferralConversion {
  id: string;
  referrerId: number;
  referredUserId: number;
  plan: "monthly" | "semestral" | "annual";
  commissionRate: number; // percentual
  commissionAmount: number;
  status: "pending" | "approved" | "paid" | "rejected";
  conversionDate: Date;
  paidDate?: Date;
  createdAt: Date;
}

export interface ReferralStats {
  userId: number;
  totalReferrals: number;
  activeReferrals: number;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  conversionRate: number; // percentual
}

// Configurações de comissão por plano
export const COMMISSION_RATES = {
  monthly: 0.2, // 20%
  semestral: 0.25, // 25%
  annual: 0.3, // 30%
};

/**
 * Gera código de referência único
 */
export function generateReferralCode(userId: number): string {
  const timestamp = Date.now().toString(36);
  const userIdStr = userId.toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${userIdStr}${timestamp}${random}`.toUpperCase().substring(0, 8);
}

/**
 * Cria novo código de referência para usuário
 */
export async function createReferralCode(userId: number): Promise<ReferralCode | null> {
  try {
    const code = generateReferralCode(userId);

    // TODO: Salvar no banco de dados
    // await database.insert(referralCodes).values({
    //   userId,
    //   code,
    //   isActive: true,
    //   createdAt: new Date()
    // });

    console.log(`Código de referência criado para usuário ${userId}: ${code}`);

    return {
      id: `ref_${Date.now()}`,
      userId,
      code,
      isActive: true,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Erro ao criar código de referência:", error);
    return null;
  }
}

/**
 * Valida código de referência
 */
export async function validateReferralCode(code: string): Promise<{ valid: boolean; userId?: number }> {
  try {
    // TODO: Buscar no banco de dados
    // const referralCode = await database.select()
    //   .from(referralCodes)
    //   .where(eq(referralCodes.code, code))
    //   .limit(1);

    console.log(`Validando código de referência: ${code}`);

    // Mock data
    if (code && code.length === 8) {
      return {
        valid: true,
        userId: parseInt(code.substring(0, 2), 36),
      };
    }

    return { valid: false };
  } catch (error) {
    console.error("Erro ao validar código de referência:", error);
    return { valid: false };
  }
}

/**
 * Registra nova conversão de referência
 * IMPORTANTE: Comissão só é registrada se o pagamento for bem-sucedido
 */
export async function registerReferralConversion(
  referrerId: number,
  referredUserId: number,
  plan: "monthly" | "semestral" | "annual",
  paymentStatus: "pending" | "succeeded" | "failed" = "pending"
): Promise<ReferralConversion | null> {
  try {
    // Validar se pagamento foi bem-sucedido
    if (paymentStatus !== "succeeded") {
      console.log(
        `Conversão de referência não registrada: pagamento ${paymentStatus} para ${referredUserId}`
      );
      return null;
    }

    const commissionRate = COMMISSION_RATES[plan];
    
    // Calcular valor de comissão baseado no preço do plano
    const planPrices = {
      monthly: 29.9,
      semestral: 149.9,
      annual: 299.9,
    };

    const commissionAmount = planPrices[plan] * commissionRate;

    // TODO: Salvar no banco de dados
    // await database.insert(referralConversions).values({
    //   referrerId,
    //   referredUserId,
    //   plan,
    //   commissionRate,
    //   commissionAmount,
    //   status: 'approved',
    //   conversionDate: new Date()
    // });

    console.log(
      `Conversão de referência registrada com sucesso: ${referrerId} → ${referredUserId} (${plan}) - Comissão: R$ ${commissionAmount.toFixed(2)}`
    );

    return {
      id: `conv_${Date.now()}`,
      referrerId,
      referredUserId,
      plan,
      commissionRate,
      commissionAmount,
      status: "approved",
      conversionDate: new Date(),
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Erro ao registrar conversão de referência:", error);
    return null;
  }
}

/**
 * Obtém estatísticas de referência do usuário
 */
export async function getReferralStats(userId: number): Promise<ReferralStats> {
  try {
    // TODO: Buscar do banco de dados
    // const conversions = await database.select()
    //   .from(referralConversions)
    //   .where(eq(referralConversions.referrerId, userId));

    console.log(`Obtendo estatísticas de referência para usuário ${userId}`);

    return {
      userId,
      totalReferrals: 0,
      activeReferrals: 0,
      totalCommissions: 0,
      pendingCommissions: 0,
      paidCommissions: 0,
      conversionRate: 0,
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas de referência:", error);
    return {
      userId,
      totalReferrals: 0,
      activeReferrals: 0,
      totalCommissions: 0,
      pendingCommissions: 0,
      paidCommissions: 0,
      conversionRate: 0,
    };
  }
}

/**
 * Aprova conversão de referência
 */
export async function approveReferralConversion(conversionId: string): Promise<boolean> {
  try {
    // TODO: Atualizar no banco de dados
    // await database.update(referralConversions)
    //   .set({ status: 'approved' })
    //   .where(eq(referralConversions.id, conversionId));

    console.log(`Conversão de referência aprovada: ${conversionId}`);
    return true;
  } catch (error) {
    console.error("Erro ao aprovar conversão de referência:", error);
    return false;
  }
}

/**
 * Rejeita conversão de referência
 */
export async function rejectReferralConversion(conversionId: string, reason: string): Promise<boolean> {
  try {
    // TODO: Atualizar no banco de dados
    // await database.update(referralConversions)
    //   .set({ status: 'rejected' })
    //   .where(eq(referralConversions.id, conversionId));

    console.log(`Conversão de referência rejeitada: ${conversionId} (Motivo: ${reason})`);
    return true;
  } catch (error) {
    console.error("Erro ao rejeitar conversão de referência:", error);
    return false;
  }
}

/**
 * Processa pagamento de comissões pendentes
 */
export async function processPendingCommissions(userId: number): Promise<{ paid: number; failed: number }> {
  try {
    // TODO: Buscar conversões pendentes do banco de dados
    // const pendingConversions = await database.select()
    //   .from(referralConversions)
    //   .where(and(
    //     eq(referralConversions.referrerId, userId),
    //     eq(referralConversions.status, 'approved')
    //   ));

    console.log(`Processando comissões pendentes para usuário ${userId}`);

    // TODO: Integrar com Stripe para transferência de fundos
    // for (const conversion of pendingConversions) {
    //   const transfer = await stripe.transfers.create({
    //     amount: Math.round(conversion.commissionAmount * 100),
    //     currency: 'brl',
    //     destination: userStripeAccountId
    //   });
    //   
    //   await database.update(referralConversions)
    //     .set({ status: 'paid', paidDate: new Date() })
    //     .where(eq(referralConversions.id, conversion.id));
    // }

    return { paid: 0, failed: 0 };
  } catch (error) {
    console.error("Erro ao processar comissões pendentes:", error);
    return { paid: 0, failed: 0 };
  }
}

/**
 * Obtém histórico de conversões do usuário
 */
export async function getReferralHistory(userId: number, limit: number = 50): Promise<ReferralConversion[]> {
  try {
    // TODO: Buscar do banco de dados
    // const conversions = await database.select()
    //   .from(referralConversions)
    //   .where(eq(referralConversions.referrerId, userId))
    //   .orderBy(desc(referralConversions.conversionDate))
    //   .limit(limit);

    console.log(`Obtendo histórico de referências para usuário ${userId}`);
    return [];
  } catch (error) {
    console.error("Erro ao obter histórico de referências:", error);
    return [];
  }
}

/**
 * Calcula comissão total acumulada
 */
export async function calculateTotalCommissions(userId: number): Promise<number> {
  try {
    // TODO: Buscar do banco de dados
    // const result = await database.select({ total: sum(referralConversions.commissionAmount) })
    //   .from(referralConversions)
    //   .where(and(
    //     eq(referralConversions.referrerId, userId),
    //     eq(referralConversions.status, 'paid')
    //   ));

    console.log(`Calculando comissões totais para usuário ${userId}`);
    return 0;
  } catch (error) {
    console.error("Erro ao calcular comissões totais:", error);
    return 0;
  }
}

/**
 * Gera link de compartilhamento de referência
 */
export function generateReferralLink(code: string, baseUrl: string = "https://driverfinance.app"): string {
  return `${baseUrl}/ref/${code}`;
}

/**
 * Gera mensagem de compartilhamento
 */
export function generateShareMessage(userName: string, code: string): string {
  const link = generateReferralLink(code);
  return `Ei! Estou usando Driver Finance para gerenciar minhas finanças como motorista. Ganhe R$ 10 de bônus com meu código: ${code} ou clique aqui: ${link}`;
}

/**
 * Valida elegibilidade para comissão
 */
export async function validateCommissionEligibility(
  referrerId: number,
  referredUserId: number
): Promise<{ eligible: boolean; reason?: string }> {
  try {
    // Validações
    if (referrerId === referredUserId) {
      return { eligible: false, reason: "Não é permitido auto-referência" };
    }

    // TODO: Verificar se referredUserId já foi referido por outro usuário
    // TODO: Verificar se referrerId tem assinatura ativa
    // TODO: Verificar fraude

    return { eligible: true };
  } catch (error) {
    console.error("Erro ao validar elegibilidade para comissão:", error);
    return { eligible: false, reason: "Erro ao validar elegibilidade" };
  }
}

/**
 * Obtém top referrers (leaderboard)
 */
export async function getTopReferrers(limit: number = 10): Promise<Array<{
  userId: number;
  userName: string;
  totalCommissions: number;
  totalReferrals: number;
}>> {
  try {
    // TODO: Buscar do banco de dados com agregações
    console.log(`Obtendo top ${limit} referrers`);
    return [];
  } catch (error) {
    console.error("Erro ao obter top referrers:", error);
    return [];
  }
}
