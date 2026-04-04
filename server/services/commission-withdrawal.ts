/**
 * Serviço de Saque de Comissões
 * Gerencia solicitações de saque, validação e transferência de fundos
 */

export interface WithdrawalRequest {
  id: string;
  userId: number;
  amount: number;
  bankAccount: {
    bankCode: string;
    accountType: "checking" | "savings";
    accountNumber: string;
    accountHolder: string;
  };
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  stripeTransferId?: string;
  failureReason?: string;
  requestedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
}

export interface WithdrawalStats {
  userId: number;
  availableBalance: number;
  pendingWithdrawals: number;
  totalWithdrawn: number;
  lastWithdrawalDate?: Date;
  nextAvailableWithdrawalDate?: Date;
}

// Configurações de saque
export const WITHDRAWAL_CONFIG = {
  minimumAmount: 50.0, // Saque mínimo
  maximumAmount: 10000.0, // Saque máximo
  processingFee: 0.0, // Taxa de processamento (0% por enquanto)
  processingTimeHours: 24, // Tempo de processamento
  maxWithdrawalsPerMonth: 4, // Máximo de saques por mês
  cooldownHours: 7 * 24, // Espera entre saques (7 dias)
};

/**
 * Valida se usuário pode fazer saque
 */
export async function validateWithdrawalEligibility(
  userId: number,
  requestedAmount: number
): Promise<{ eligible: boolean; reason?: string }> {
  try {
    // Validação 1: Verificar valor mínimo
    if (requestedAmount < WITHDRAWAL_CONFIG.minimumAmount) {
      return {
        eligible: false,
        reason: `Valor mínimo para saque é R$ ${WITHDRAWAL_CONFIG.minimumAmount.toFixed(2)}`,
      };
    }

    // Validação 2: Verificar valor máximo
    if (requestedAmount > WITHDRAWAL_CONFIG.maximumAmount) {
      return {
        eligible: false,
        reason: `Valor máximo para saque é R$ ${WITHDRAWAL_CONFIG.maximumAmount.toFixed(2)}`,
      };
    }

    // TODO: Verificar saldo disponível
    // const balance = await getAvailableBalance(userId);
    // if (requestedAmount > balance) {
    //   return { eligible: false, reason: "Saldo insuficiente" };
    // }

    // TODO: Verificar limite de saques por mês
    // const withdrawalsThisMonth = await countWithdrawalsThisMonth(userId);
    // if (withdrawalsThisMonth >= WITHDRAWAL_CONFIG.maxWithdrawalsPerMonth) {
    //   return { eligible: false, reason: "Limite de saques por mês atingido" };
    // }

    // TODO: Verificar cooldown entre saques
    // const lastWithdrawal = await getLastWithdrawal(userId);
    // if (lastWithdrawal) {
    //   const hoursSinceLastWithdrawal = (Date.now() - lastWithdrawal.completedAt.getTime()) / (1000 * 60 * 60);
    //   if (hoursSinceLastWithdrawal < WITHDRAWAL_CONFIG.cooldownHours) {
    //     const hoursRemaining = WITHDRAWAL_CONFIG.cooldownHours - hoursSinceLastWithdrawal;
    //     return { eligible: false, reason: `Próximo saque disponível em ${Math.ceil(hoursRemaining)} horas` };
    //   }
    // }

    return { eligible: true };
  } catch (error) {
    console.error("Erro ao validar elegibilidade de saque:", error);
    return { eligible: false, reason: "Erro ao validar elegibilidade" };
  }
}

/**
 * Cria solicitação de saque
 */
export async function createWithdrawalRequest(
  userId: number,
  amount: number,
  bankAccount: WithdrawalRequest["bankAccount"]
): Promise<WithdrawalRequest | null> {
  try {
    // Validar elegibilidade
    const validation = await validateWithdrawalEligibility(userId, amount);
    if (!validation.eligible) {
      console.log(`Saque rejeitado: ${validation.reason}`);
      return null;
    }

    // Validar dados bancários
    if (!bankAccount.bankCode || !bankAccount.accountNumber || !bankAccount.accountHolder) {
      return null;
    }

    // TODO: Salvar no banco de dados
    // await database.insert(withdrawalRequests).values({
    //   userId,
    //   amount,
    //   bankAccount,
    //   status: 'pending',
    //   requestedAt: new Date()
    // });

    console.log(
      `Solicitação de saque criada: usuário ${userId}, valor R$ ${amount.toFixed(2)}`
    );

    return {
      id: `wd_${Date.now()}`,
      userId,
      amount,
      bankAccount,
      status: "pending",
      requestedAt: new Date(),
    };
  } catch (error) {
    console.error("Erro ao criar solicitação de saque:", error);
    return null;
  }
}

/**
 * Processa saque via Stripe Connect
 */
export async function processWithdrawalWithStripe(
  withdrawalId: string,
  userId: number,
  amount: number,
  stripeConnectAccountId: string
): Promise<{ success: boolean; transferId?: string; reason?: string }> {
  try {
    // TODO: Integrar com Stripe Connect
    // const transfer = await stripe.transfers.create({
    //   amount: Math.round(amount * 100), // Stripe usa centavos
    //   currency: 'brl',
    //   destination: stripeConnectAccountId,
    //   metadata: { withdrawalId, userId }
    // });

    console.log(
      `Processando saque via Stripe: usuário ${userId}, valor R$ ${amount.toFixed(2)}`
    );

    // TODO: Atualizar status no banco de dados
    // await database.update(withdrawalRequests)
    //   .set({ status: 'processing', stripeTransferId: transfer.id })
    //   .where(eq(withdrawalRequests.id, withdrawalId));

    return {
      success: true,
      transferId: `tr_${Date.now()}`,
    };
  } catch (error) {
    console.error("Erro ao processar saque com Stripe:", error);
    return {
      success: false,
      reason: "Erro ao processar saque",
    };
  }
}

/**
 * Confirma conclusão de saque
 */
export async function completeWithdrawal(
  withdrawalId: string,
  transferId: string
): Promise<boolean> {
  try {
    // TODO: Atualizar no banco de dados
    // await database.update(withdrawalRequests)
    //   .set({ status: 'completed', processedAt: new Date() })
    //   .where(eq(withdrawalRequests.id, withdrawalId));

    console.log(`Saque concluído: ${withdrawalId}, transferência ${transferId}`);
    return true;
  } catch (error) {
    console.error("Erro ao confirmar saque:", error);
    return false;
  }
}

/**
 * Rejeita saque
 */
export async function rejectWithdrawal(
  withdrawalId: string,
  reason: string
): Promise<boolean> {
  try {
    // TODO: Atualizar no banco de dados
    // await database.update(withdrawalRequests)
    //   .set({ status: 'failed', failureReason: reason })
    //   .where(eq(withdrawalRequests.id, withdrawalId));

    console.log(`Saque rejeitado: ${withdrawalId}, motivo: ${reason}`);
    return true;
  } catch (error) {
    console.error("Erro ao rejeitar saque:", error);
    return false;
  }
}

/**
 * Obtém estatísticas de saque do usuário
 */
export async function getWithdrawalStats(userId: number): Promise<WithdrawalStats> {
  try {
    // TODO: Buscar do banco de dados
    // const stats = await database.select({
    //   availableBalance: sum(referralConversions.commissionAmount),
    //   totalWithdrawn: sum(withdrawalRequests.amount)
    // })
    // .from(referralConversions)
    // .leftJoin(withdrawalRequests, eq(referralConversions.referrerId, withdrawalRequests.userId))
    // .where(eq(referralConversions.referrerId, userId));

    console.log(`Obtendo estatísticas de saque para usuário ${userId}`);

    return {
      userId,
      availableBalance: 450.0, // Mock
      pendingWithdrawals: 0,
      totalWithdrawn: 2890.75,
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas de saque:", error);
    return {
      userId,
      availableBalance: 0,
      pendingWithdrawals: 0,
      totalWithdrawn: 0,
    };
  }
}

/**
 * Obtém histórico de saques
 */
export async function getWithdrawalHistory(
  userId: number,
  limit: number = 20
): Promise<WithdrawalRequest[]> {
  try {
    // TODO: Buscar do banco de dados
    // const withdrawals = await database.select()
    //   .from(withdrawalRequests)
    //   .where(eq(withdrawalRequests.userId, userId))
    //   .orderBy(desc(withdrawalRequests.requestedAt))
    //   .limit(limit);

    console.log(`Obtendo histórico de saques para usuário ${userId}`);
    return [];
  } catch (error) {
    console.error("Erro ao obter histórico de saques:", error);
    return [];
  }
}

/**
 * Calcula taxa de processamento
 */
export function calculateWithdrawalFee(amount: number): number {
  return amount * WITHDRAWAL_CONFIG.processingFee;
}

/**
 * Calcula valor líquido após taxa
 */
export function calculateNetWithdrawalAmount(amount: number): number {
  const fee = calculateWithdrawalFee(amount);
  return amount - fee;
}

/**
 * Valida dados bancários
 */
export function validateBankAccount(bankAccount: WithdrawalRequest["bankAccount"]): {
  valid: boolean;
  reason?: string;
} {
  // Validação 1: Código do banco
  if (!bankAccount.bankCode || bankAccount.bankCode.length !== 3) {
    return { valid: false, reason: "Código do banco inválido" };
  }

  // Validação 2: Tipo de conta
  if (!["checking", "savings"].includes(bankAccount.accountType)) {
    return { valid: false, reason: "Tipo de conta inválido" };
  }

  // Validação 3: Número da conta
  if (!bankAccount.accountNumber || bankAccount.accountNumber.length < 5) {
    return { valid: false, reason: "Número da conta inválido" };
  }

  // Validação 4: Titular da conta
  if (!bankAccount.accountHolder || bankAccount.accountHolder.length < 3) {
    return { valid: false, reason: "Nome do titular inválido" };
  }

  return { valid: true };
}

/**
 * Obtém próxima data disponível para saque
 */
export async function getNextAvailableWithdrawalDate(userId: number): Promise<Date | null> {
  try {
    // TODO: Buscar último saque do banco de dados
    // const lastWithdrawal = await database.select()
    //   .from(withdrawalRequests)
    //   .where(and(
    //     eq(withdrawalRequests.userId, userId),
    //     eq(withdrawalRequests.status, 'completed')
    //   ))
    //   .orderBy(desc(withdrawalRequests.completedAt))
    //   .limit(1);

    // if (lastWithdrawal.length === 0) return null;

    // const nextDate = new Date(lastWithdrawal[0].completedAt);
    // nextDate.setHours(nextDate.getHours() + WITHDRAWAL_CONFIG.cooldownHours);
    // return nextDate;

    return null;
  } catch (error) {
    console.error("Erro ao obter próxima data de saque:", error);
    return null;
  }
}

/**
 * Webhook para confirmação de transferência Stripe
 */
export async function handleStripeTransferWebhook(
  transferId: string,
  status: "succeeded" | "failed"
): Promise<{ success: boolean; message: string }> {
  try {
    if (status === "succeeded") {
      // TODO: Atualizar status para completed
      console.log(`Transferência Stripe confirmada: ${transferId}`);
      return {
        success: true,
        message: "Saque concluído com sucesso",
      };
    } else {
      // TODO: Atualizar status para failed
      console.log(`Transferência Stripe falhou: ${transferId}`);
      return {
        success: false,
        message: "Falha na transferência",
      };
    }
  } catch (error) {
    console.error("Erro ao processar webhook de transferência:", error);
    return {
      success: false,
      message: "Erro ao processar webhook",
    };
  }
}
