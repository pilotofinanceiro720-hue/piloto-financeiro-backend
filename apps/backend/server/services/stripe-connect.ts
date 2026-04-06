/**
 * Serviço de Stripe Connect
 * Gerencia transferências automáticas de comissões para contas bancárias
 */

export interface StripeConnectAccount {
  userId: number;
  stripeConnectId: string;
  email: string;
  status: "pending" | "active" | "restricted" | "rejected";
  bankAccount?: {
    accountHolderName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TransferRequest {
  id: string;
  userId: number;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  stripeTransferId?: string;
  bankAccount: {
    accountHolderName: string;
    last4: string;
    bankName: string;
  };
  fee: number;
  netAmount: number;
  createdAt: Date;
  completedAt?: Date;
  failureReason?: string;
}

/**
 * Cria conta Stripe Connect para usuário
 */
export async function createStripeConnectAccount(
  userId: number,
  email: string,
  country: string = "BR"
): Promise<StripeConnectAccount> {
  try {
    // TODO: Integrar com Stripe API
    // const account = await stripe.accounts.create({
    //   type: 'express',
    //   country,
    //   email,
    //   capabilities: {
    //     transfers: { requested: true },
    //   },
    // });

    console.log(`Criando conta Stripe Connect para usuário ${userId}`);

    const account: StripeConnectAccount = {
      userId,
      stripeConnectId: `acct_${Date.now()}`,
      email,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Salvar no banco de dados
    // await database.insert(stripeConnectAccounts).values(account);

    return account;
  } catch (error) {
    console.error("Erro ao criar conta Stripe Connect:", error);
    throw error;
  }
}

/**
 * Obtém link de onboarding para Stripe Connect
 */
export async function getStripeConnectOnboardingLink(
  userId: number,
  stripeConnectId: string,
  returnUrl: string
): Promise<string> {
  try {
    // TODO: Integrar com Stripe API
    // const link = await stripe.accountLinks.create({
    //   account: stripeConnectId,
    //   type: 'account_onboarding',
    //   return_url: returnUrl,
    // });

    console.log(`Gerando link de onboarding para conta ${stripeConnectId}`);

    return `https://connect.stripe.com/onboarding/${stripeConnectId}`;
  } catch (error) {
    console.error("Erro ao gerar link de onboarding:", error);
    throw error;
  }
}

/**
 * Valida conta bancária
 */
export async function validateBankAccount(
  accountNumber: string,
  routingNumber: string,
  accountHolderName: string
): Promise<{ valid: boolean; reason?: string }> {
  try {
    // Validações básicas
    if (!accountNumber || accountNumber.length < 8) {
      return { valid: false, reason: "Número de conta inválido" };
    }

    if (!routingNumber || routingNumber.length < 8) {
      return { valid: false, reason: "Código de roteamento inválido" };
    }

    if (!accountHolderName || accountHolderName.length < 3) {
      return { valid: false, reason: "Nome do titular inválido" };
    }

    // TODO: Validar com Stripe Verification API
    // const verification = await stripe.verification.validateBankAccount({
    //   account_number: accountNumber,
    //   routing_number: routingNumber,
    // });

    console.log("Validando conta bancária");

    return { valid: true };
  } catch (error) {
    console.error("Erro ao validar conta bancária:", error);
    return { valid: false, reason: "Erro ao validar conta bancária" };
  }
}

/**
 * Cria solicitação de transferência
 */
export async function createTransferRequest(
  userId: number,
  amount: number,
  bankAccount: {
    accountHolderName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  }
): Promise<TransferRequest> {
  try {
    // Validar conta bancária
    const validation = await validateBankAccount(
      bankAccount.accountNumber,
      bankAccount.routingNumber,
      bankAccount.accountHolderName
    );

    if (!validation.valid) {
      throw new Error(validation.reason || "Conta bancária inválida");
    }

    // Calcular taxa (2% de taxa de transferência)
    const fee = amount * 0.02;
    const netAmount = amount - fee;

    const transfer: TransferRequest = {
      id: `trf_${Date.now()}`,
      userId,
      amount,
      status: "pending",
      bankAccount: {
        accountHolderName: bankAccount.accountHolderName,
        last4: bankAccount.accountNumber.slice(-4),
        bankName: bankAccount.bankName,
      },
      fee,
      netAmount,
      createdAt: new Date(),
    };

    // TODO: Salvar no banco de dados
    // await database.insert(transferRequests).values(transfer);

    console.log(`Solicitação de transferência criada: ${transfer.id}`);

    return transfer;
  } catch (error) {
    console.error("Erro ao criar solicitação de transferência:", error);
    throw error;
  }
}

/**
 * Processa transferência com Stripe
 */
export async function processTransfer(
  transferId: string,
  stripeConnectId: string,
  amount: number
): Promise<{ success: boolean; stripeTransferId?: string; error?: string }> {
  try {
    // TODO: Integrar com Stripe API
    // const transfer = await stripe.transfers.create({
    //   amount: Math.round(amount * 100), // Stripe usa centavos
    //   currency: 'brl',
    //   destination: stripeConnectId,
    // });

    console.log(`Processando transferência ${transferId} para ${stripeConnectId}`);

    const stripeTransferId = `tr_${Date.now()}`;

    // TODO: Atualizar status no banco de dados
    // await database.update(transferRequests)
    //   .set({
    //     status: 'processing',
    //     stripeTransferId,
    //     updatedAt: new Date(),
    //   })
    //   .where(eq(transferRequests.id, transferId));

    return {
      success: true,
      stripeTransferId,
    };
  } catch (error) {
    console.error("Erro ao processar transferência:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao processar transferência",
    };
  }
}

/**
 * Processa transferência automática de comissões
 */
export async function processAutomaticCommissionTransfer(
  userId: number,
  commissionAmount: number,
  stripeConnectId: string
): Promise<{ success: boolean; transferId?: string; message: string }> {
  try {
    // Validar valor mínimo (R$ 50)
    if (commissionAmount < 50) {
      return {
        success: false,
        message: "Valor mínimo para transferência é R$ 50,00",
      };
    }

    // Criar solicitação de transferência
    const transfer = await createTransferRequest(userId, commissionAmount, {
      accountHolderName: "Motorista Driver Finance",
      accountNumber: "123456789",
      routingNumber: "12345678",
      bankName: "Banco Exemplo",
    });

    // Processar transferência
    const result = await processTransfer(transfer.id, stripeConnectId, commissionAmount);

    if (!result.success) {
      return {
        success: false,
        message: result.error || "Erro ao processar transferência",
      };
    }

    console.log(`Transferência automática processada: ${result.stripeTransferId}`);

    return {
      success: true,
      transferId: transfer.id,
      message: `Transferência de R$ ${commissionAmount.toFixed(2)} iniciada com sucesso`,
    };
  } catch (error) {
    console.error("Erro ao processar transferência automática:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao processar transferência",
    };
  }
}

/**
 * Obtém histórico de transferências
 */
export async function getTransferHistory(
  userId: number,
  limit: number = 50
): Promise<TransferRequest[]> {
  try {
    // TODO: Buscar do banco de dados
    // const transfers = await database.select()
    //   .from(transferRequests)
    //   .where(eq(transferRequests.userId, userId))
    //   .orderBy(desc(transferRequests.createdAt))
    //   .limit(limit);

    console.log(`Obtendo histórico de transferências para usuário ${userId}`);

    return [];
  } catch (error) {
    console.error("Erro ao obter histórico de transferências:", error);
    return [];
  }
}

/**
 * Obtém status de transferência
 */
export async function getTransferStatus(transferId: string): Promise<TransferRequest | null> {
  try {
    // TODO: Buscar do banco de dados
    // const transfer = await database.select()
    //   .from(transferRequests)
    //   .where(eq(transferRequests.id, transferId));

    console.log(`Obtendo status de transferência: ${transferId}`);

    return null;
  } catch (error) {
    console.error("Erro ao obter status de transferência:", error);
    return null;
  }
}

/**
 * Webhook handler para eventos de Stripe
 */
export async function handleStripeWebhook(event: any): Promise<void> {
  try {
    switch (event.type) {
      case "transfer.created":
        console.log("Transferência criada:", event.data.object);
        break;

      case "transfer.updated":
        console.log("Transferência atualizada:", event.data.object);
        // TODO: Atualizar status no banco de dados
        break;

      case "transfer.paid":
        console.log("Transferência paga:", event.data.object);
        // TODO: Marcar como completa
        break;

      case "transfer.failed":
        console.log("Transferência falhou:", event.data.object);
        // TODO: Registrar falha e notificar usuário
        break;

      default:
        console.log("Evento desconhecido:", event.type);
    }
  } catch (error) {
    console.error("Erro ao processar webhook de Stripe:", error);
    throw error;
  }
}

/**
 * Calcula taxa de transferência
 */
export function calculateTransferFee(amount: number): {
  fee: number;
  netAmount: number;
  feePercentage: number;
} {
  const feePercentage = 0.02; // 2%
  const fee = amount * feePercentage;
  const netAmount = amount - fee;

  return {
    fee,
    netAmount,
    feePercentage,
  };
}

/**
 * Valida se pode fazer transferência
 */
export function canMakeTransfer(
  amount: number,
  dailyLimit: number,
  monthlyLimit: number,
  currentDailyUsed: number,
  currentMonthlyUsed: number
): { allowed: boolean; reason?: string } {
  // Validar valor mínimo
  if (amount < 50) {
    return {
      allowed: false,
      reason: "Valor mínimo para transferência é R$ 50,00",
    };
  }

  // Validar limite diário
  if (currentDailyUsed + amount > dailyLimit) {
    return {
      allowed: false,
      reason: `Limite diário de R$ ${dailyLimit.toFixed(2)} atingido`,
    };
  }

  // Validar limite mensal
  if (currentMonthlyUsed + amount > monthlyLimit) {
    return {
      allowed: false,
      reason: `Limite mensal de R$ ${monthlyLimit.toFixed(2)} atingido`,
    };
  }

  return { allowed: true };
}
