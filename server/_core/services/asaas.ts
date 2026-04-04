/**
 * ASAAS SERVICE — INTEGRAÇÃO COM API DE PAGAMENTOS
 * Gerencia assinaturas, pagamentos PIX, cartão e webhooks
 * TODO: Implementar retry logic para falhas de API
 * TODO: Implementar logging detalhado
 */

import axios from "axios";
import type { PlanType, SubscriptionStatus } from "@/shared/types/piloto";

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || "";
const ASAAS_SANDBOX = process.env.ASAAS_SANDBOX === "true";
const ASAAS_BASE_URL = ASAAS_SANDBOX
  ? "https://sandbox.asaas.com/api/v3"
  : "https://api.asaas.com/v3";

const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://api.pilotofinanceiro.com.br/webhooks/asaas";

// ============================================================================
// TIPOS
// ============================================================================

interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

interface AsaasSubscription {
  id: string;
  customerId: string;
  billingType: "PIX" | "CREDIT_CARD" | "DEBIT_CARD";
  value: number;
  nextDueDate: string;
  endDate?: string;
  status: "ACTIVE" | "INACTIVE" | "OVERDUE" | "CANCELLED";
}

interface AsaasPayment {
  id: string;
  customerId: string;
  value: number;
  status: "PENDING" | "RECEIVED" | "CONFIRMED" | "OVERDUE" | "REFUNDED" | "CANCELLED";
  billingType: "PIX" | "CREDIT_CARD" | "DEBIT_CARD";
  dueDate: string;
  pixQrCode?: string;
  pixCopiaeCola?: string;
}

interface CreateSubscriptionRequest {
  customerId: string;
  billingType: "PIX" | "CREDIT_CARD";
  value: number;
  nextDueDate: string;
  description: string;
}

// ============================================================================
// CLIENTE HTTP
// ============================================================================

const client = axios.create({
  baseURL: ASAAS_BASE_URL,
  headers: {
    "access_token": ASAAS_API_KEY,
    "Content-Type": "application/json",
  },
});

// ============================================================================
// CUSTOMERS (CLIENTES)
// ============================================================================

/**
 * Criar cliente no Asaas
 * TODO: Validar CPF antes de enviar
 */
export async function createCustomer(data: {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
}): Promise<AsaasCustomer> {
  try {
    const response = await client.post("/customers", {
      name: data.name,
      email: data.email,
      cpfCnpj: data.cpf.replace(/\D/g, ""),
      mobilePhone: data.phone?.replace(/\D/g, ""),
      notificationDisabled: false,
    });

    return response.data;
  } catch (error) {
    console.error("[Asaas] Erro ao criar cliente:", error);
    throw new Error("Falha ao criar cliente no Asaas");
  }
}

/**
 * Obter cliente do Asaas
 */
export async function getCustomer(customerId: string): Promise<AsaasCustomer> {
  try {
    const response = await client.get(`/customers/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("[Asaas] Erro ao obter cliente:", error);
    throw new Error("Cliente não encontrado");
  }
}

/**
 * Atualizar cliente
 */
export async function updateCustomer(
  customerId: string,
  data: Partial<AsaasCustomer>
): Promise<AsaasCustomer> {
  try {
    const response = await client.put(`/customers/${customerId}`, data);
    return response.data;
  } catch (error) {
    console.error("[Asaas] Erro ao atualizar cliente:", error);
    throw new Error("Falha ao atualizar cliente");
  }
}

// ============================================================================
// SUBSCRIPTIONS (ASSINATURAS)
// ============================================================================

/**
 * Criar assinatura recorrente
 * TODO: Implementar suporte a ciclos semestrais e anuais
 */
export async function createSubscription(
  customerId: string,
  plan: PlanType,
  billingCycle: "monthly" | "semiannual" | "annual"
): Promise<AsaasSubscription> {
  const planPrices: Record<PlanType, number> = {
    free: 0,
    basico: 29.9,
    essencial: 59.9,
    premium: 99.9,
  };

  const value = planPrices[plan];
  if (!value) {
    throw new Error("Plano inválido");
  }

  try {
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 1);

    const response = await client.post("/subscriptions", {
      customerId,
      billingType: "PIX",
      value,
      nextDueDate: nextDueDate.toISOString().split("T")[0],
      description: `Piloto Financeiro - Plano ${plan}`,
      cycle: billingCycle === "monthly" ? "MONTHLY" : billingCycle === "semiannual" ? "SEMIANNUAL" : "YEARLY",
      maxPayments: billingCycle === "monthly" ? 12 : billingCycle === "semiannual" ? 2 : 1,
      notificationDisabled: false,
    });

    return response.data;
  } catch (error) {
    console.error("[Asaas] Erro ao criar assinatura:", error);
    throw new Error("Falha ao criar assinatura");
  }
}

/**
 * Obter assinatura
 */
export async function getSubscription(
  subscriptionId: string
): Promise<AsaasSubscription> {
  try {
    const response = await client.get(`/subscriptions/${subscriptionId}`);
    return response.data;
  } catch (error) {
    console.error("[Asaas] Erro ao obter assinatura:", error);
    throw new Error("Assinatura não encontrada");
  }
}

/**
 * Cancelar assinatura
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<{ success: boolean }> {
  try {
    await client.delete(`/subscriptions/${subscriptionId}`);
    return { success: true };
  } catch (error) {
    console.error("[Asaas] Erro ao cancelar assinatura:", error);
    throw new Error("Falha ao cancelar assinatura");
  }
}

// ============================================================================
// PAYMENTS (PAGAMENTOS)
// ============================================================================

/**
 * Criar pagamento PIX
 * TODO: Implementar retry automático
 */
export async function createPixPayment(
  customerId: string,
  value: number,
  description: string
): Promise<AsaasPayment> {
  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    const response = await client.post("/payments", {
      customerId,
      billingType: "PIX",
      value,
      dueDate: dueDate.toISOString().split("T")[0],
      description,
      notificationDisabled: false,
    });

    return response.data;
  } catch (error) {
    console.error("[Asaas] Erro ao criar pagamento PIX:", error);
    throw new Error("Falha ao criar pagamento PIX");
  }
}

/**
 * Criar pagamento com cartão de crédito
 * TODO: Implementar tokenização de cartão
 */
export async function createCardPayment(
  customerId: string,
  value: number,
  cardToken: string,
  description: string
): Promise<AsaasPayment> {
  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    const response = await client.post("/payments", {
      customerId,
      billingType: "CREDIT_CARD",
      value,
      dueDate: dueDate.toISOString().split("T")[0],
      description,
      creditCard: {
        holderName: "Holder Name",
        number: cardToken,
        expiryMonth: "12",
        expiryYear: "2025",
        ccv: "123",
      },
      notificationDisabled: false,
    });

    return response.data;
  } catch (error) {
    console.error("[Asaas] Erro ao criar pagamento com cartão:", error);
    throw new Error("Falha ao processar pagamento com cartão");
  }
}

/**
 * Obter pagamento
 */
export async function getPayment(paymentId: string): Promise<AsaasPayment> {
  try {
    const response = await client.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error("[Asaas] Erro ao obter pagamento:", error);
    throw new Error("Pagamento não encontrado");
  }
}

/**
 * Listar pagamentos de um cliente
 */
export async function listPayments(
  customerId: string,
  limit: number = 20,
  offset: number = 0
): Promise<AsaasPayment[]> {
  try {
    const response = await client.get("/payments", {
      params: {
        customerId,
        limit,
        offset,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("[Asaas] Erro ao listar pagamentos:", error);
    throw new Error("Falha ao listar pagamentos");
  }
}

// ============================================================================
// WEBHOOKS
// ============================================================================

/**
 * Validar assinatura de webhook
 * TODO: Implementar validação de token
 */
export function validateWebhookSignature(
  payload: string,
  signature: string
): boolean {
  // TODO: Implementar validação usando HMAC-SHA256
  return true;
}

/**
 * Processar webhook de pagamento
 * TODO: Atualizar status de subscription no banco
 * TODO: Registrar comissões quando pagamento é confirmado
 */
export async function handlePaymentWebhook(data: any): Promise<void> {
  const { id, status, customerId, value } = data;

  console.log(`[Asaas Webhook] Pagamento ${id} - Status: ${status}`);

  // TODO: UPDATE subscriptions SET status = ? WHERE asaas_subscription_id = ?
  // TODO: Se status = RECEIVED, confirmar comissões referentes a este pagamento

  if (status === "RECEIVED" || status === "CONFIRMED") {
    console.log(`[Asaas] Pagamento confirmado: ${id}`);
    // TODO: Enviar notificação ao usuário
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Mapear status do Asaas para status interno
 */
export function mapAsaasStatus(asaasStatus: string): SubscriptionStatus {
  const mapping: Record<string, SubscriptionStatus> = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    OVERDUE: "overdue",
    CANCELLED: "cancelled",
  };

  return mapping[asaasStatus] || "inactive";
}

/**
 * Formatar CPF para Asaas
 */
export function formatCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

/**
 * Formatar telefone para Asaas
 */
export function formatPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}
