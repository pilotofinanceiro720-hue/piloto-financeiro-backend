/**
 * Serviço de Validação de Comissões para Referências
 * REGRA CRÍTICA: Comissões SOMENTE são registradas para assinaturas PAGAS
 */

export interface CommissionValidation {
  isValid: boolean;
  reason?: string;
  commissionAmount?: number;
  paymentConfirmed: boolean;
}

/**
 * Valida se uma assinatura está paga e ativa
 * Retorna true APENAS se o pagamento foi bem-sucedido
 */
export async function isSubscriptionPaid(
  userId: number,
  subscriptionId?: string
): Promise<boolean> {
  try {
    // TODO: Buscar do banco de dados
    // const subscription = await database.select()
    //   .from(subscriptions)
    //   .where(and(
    //     eq(subscriptions.userId, userId),
    //     subscriptionId ? eq(subscriptions.id, subscriptionId) : undefined
    //   ))
    //   .limit(1);

    // if (subscription.length === 0) return false;
    // return subscription[0].paymentStatus === 'succeeded' && subscription[0].status === 'active';

    console.log(`Verificando se assinatura do usuário ${userId} está paga`);
    return false; // Mock
  } catch (error) {
    console.error("Erro ao verificar se assinatura está paga:", error);
    return false;
  }
}

/**
 * Valida elegibilidade para comissão com verificação de pagamento
 * IMPORTANTE: Comissão SOMENTE é válida se o pagamento foi bem-sucedido
 */
export async function validateCommissionEligibility(
  referrerId: number,
  referredUserId: number,
  paymentStatus: "pending" | "succeeded" | "failed"
): Promise<CommissionValidation> {
  try {
    // Validação 1: Verificar auto-referência
    if (referrerId === referredUserId) {
      return {
        isValid: false,
        reason: "Não é permitido auto-referência",
        paymentConfirmed: false,
      };
    }

    // Validação 2: Verificar status de pagamento (CRÍTICA)
    if (paymentStatus !== "succeeded") {
      return {
        isValid: false,
        reason: `Pagamento ainda não foi confirmado. Status: ${paymentStatus}. Comissão será registrada apenas após confirmação.`,
        paymentConfirmed: false,
      };
    }

    // Validação 3: Verificar se referido já tem assinatura paga
    const isReferredPaid = await isSubscriptionPaid(referredUserId);
    if (!isReferredPaid) {
      return {
        isValid: false,
        reason: "Assinatura do usuário referido não está paga",
        paymentConfirmed: false,
      };
    }

    // TODO: Verificar se referredUserId já foi referido por outro usuário
    // TODO: Verificar se referrerId tem assinatura ativa
    // TODO: Verificar fraude

    return {
      isValid: true,
      paymentConfirmed: true,
    };
  } catch (error) {
    console.error("Erro ao validar elegibilidade para comissão:", error);
    return {
      isValid: false,
      reason: "Erro ao validar elegibilidade",
      paymentConfirmed: false,
    };
  }
}

/**
 * Processa webhook de pagamento bem-sucedido e registra comissão
 * Esta é a ÚNICA forma de registrar comissão
 */
export async function processPaymentSuccessAndRegisterCommission(
  referrerId: number,
  referredUserId: number,
  plan: "monthly" | "semestral" | "annual",
  paymentIntentId: string
): Promise<{ success: boolean; commissionAmount?: number; reason?: string }> {
  try {
    // Validar elegibilidade com status de pagamento confirmado
    const validation = await validateCommissionEligibility(
      referrerId,
      referredUserId,
      "succeeded"
    );

    if (!validation.isValid) {
      console.log(`Comissão não registrada: ${validation.reason}`);
      return {
        success: false,
        reason: validation.reason,
      };
    }

    // Calcular comissão apenas se pagamento foi confirmado
    const commissionRates = {
      monthly: 0.2,
      semestral: 0.25,
      annual: 0.3,
    };

    const planPrices = {
      monthly: 29.9,
      semestral: 149.9,
      annual: 299.9,
    };

    const commissionRate = commissionRates[plan];
    const commissionAmount = planPrices[plan] * commissionRate;

    // TODO: Salvar no banco de dados
    // await database.insert(referralConversions).values({
    //   referrerId,
    //   referredUserId,
    //   plan,
    //   commissionRate,
    //   commissionAmount,
    //   status: 'approved',
    //   paymentIntentId,
    //   conversionDate: new Date()
    // });

    console.log(
      `✅ Comissão registrada com sucesso: ${referrerId} ← ${referredUserId} (${plan}) | Valor: R$ ${commissionAmount.toFixed(2)} | PaymentID: ${paymentIntentId}`
    );

    return {
      success: true,
      commissionAmount,
    };
  } catch (error) {
    console.error("Erro ao processar pagamento e registrar comissão:", error);
    return {
      success: false,
      reason: "Erro ao processar pagamento",
    };
  }
}

/**
 * Rejeita comissão se pagamento falhar
 */
export async function rejectCommissionOnPaymentFailure(
  referrerId: number,
  referredUserId: number,
  paymentIntentId: string,
  failureReason: string
): Promise<boolean> {
  try {
    console.log(
      `❌ Comissão rejeitada: ${referrerId} ← ${referredUserId} | Motivo: ${failureReason} | PaymentID: ${paymentIntentId}`
    );

    // TODO: Registrar no banco de dados que comissão foi rejeitada
    // await database.insert(rejectedCommissions).values({
    //   referrerId,
    //   referredUserId,
    //   paymentIntentId,
    //   reason: failureReason,
    //   rejectedAt: new Date()
    // });

    return true;
  } catch (error) {
    console.error("Erro ao rejeitar comissão:", error);
    return false;
  }
}

/**
 * Webhook handler para Stripe - processa confirmação de pagamento
 * ESTE É O PONTO DE ENTRADA PARA REGISTRAR COMISSÕES
 */
export async function handleStripePaymentSuccessWebhook(
  paymentIntentId: string,
  customerId: string,
  amount: number,
  metadata: {
    referrerId?: number;
    referredUserId?: number;
    plan?: "monthly" | "semestral" | "annual";
  }
): Promise<{ success: boolean; message: string }> {
  try {
    const { referrerId, referredUserId, plan } = metadata;

    // Validar que temos todos os dados necessários
    if (!referrerId || !referredUserId || !plan) {
      console.log("Pagamento bem-sucedido mas sem dados de referência");
      return {
        success: true,
        message: "Pagamento processado sem referência",
      };
    }

    // Registrar comissão APENAS aqui, após pagamento confirmado
    const result = await processPaymentSuccessAndRegisterCommission(
      referrerId,
      referredUserId,
      plan,
      paymentIntentId
    );

    return {
      success: result.success,
      message: result.success
        ? `Comissão de R$ ${result.commissionAmount?.toFixed(2)} registrada`
        : result.reason || "Erro ao registrar comissão",
    };
  } catch (error) {
    console.error("Erro ao processar webhook de pagamento:", error);
    return {
      success: false,
      message: "Erro ao processar webhook",
    };
  }
}

/**
 * Webhook handler para Stripe - processa falha de pagamento
 */
export async function handleStripePaymentFailureWebhook(
  paymentIntentId: string,
  customerId: string,
  failureReason: string,
  metadata: {
    referrerId?: number;
    referredUserId?: number;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    const { referrerId, referredUserId } = metadata;

    if (!referrerId || !referredUserId) {
      return {
        success: true,
        message: "Pagamento falhou sem dados de referência",
      };
    }

    // Rejeitar comissão se pagamento falhou
    await rejectCommissionOnPaymentFailure(
      referrerId,
      referredUserId,
      paymentIntentId,
      failureReason
    );

    return {
      success: true,
      message: "Comissão rejeitada devido a falha no pagamento",
    };
  } catch (error) {
    console.error("Erro ao processar webhook de falha:", error);
    return {
      success: false,
      message: "Erro ao processar webhook de falha",
    };
  }
}

/**
 * Obtém estatísticas de comissões APENAS para pagamentos confirmados
 */
export async function getConfirmedCommissionsStats(userId: number): Promise<{
  totalConfirmed: number;
  totalAmount: number;
  pendingPayment: number;
}> {
  try {
    // TODO: Buscar do banco de dados
    // const commissions = await database.select()
    //   .from(referralConversions)
    //   .where(and(
    //     eq(referralConversions.referrerId, userId),
    //     eq(referralConversions.status, 'approved')
    //   ));

    console.log(
      `Obtendo estatísticas de comissões confirmadas para usuário ${userId}`
    );

    return {
      totalConfirmed: 0,
      totalAmount: 0,
      pendingPayment: 0,
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas de comissões:", error);
    return {
      totalConfirmed: 0,
      totalAmount: 0,
      pendingPayment: 0,
    };
  }
}
