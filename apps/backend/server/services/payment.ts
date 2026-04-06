import { getDb } from "../db";
import { subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: "monthly" | "semestral" | "annual";
  features: string[];
  description: string;
}

export interface PaymentIntent {
  id: string;
  userId: number;
  plan: "monthly" | "semestral" | "annual";
  amount: number;
  status: "pending" | "succeeded" | "failed";
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Planos de assinatura disponíveis
export const SUBSCRIPTION_PLANS: Record<"monthly" | "semestral" | "annual", PaymentPlan> = {
  monthly: {
    id: "plan_monthly",
    name: "Plano Mensal",
    price: 29.90,
    currency: "BRL",
    duration: "monthly",
    features: [
      "Acesso completo ao app",
      "Cálculos de lucro em tempo real",
      "Marketplace com 100+ ofertas",
      "Suporte por email",
    ],
    description: "Perfeito para motoristas que querem testar a plataforma",
  },
  semestral: {
    id: "plan_semestral",
    name: "Plano Semestral",
    price: 149.90,
    currency: "BRL",
    duration: "semestral",
    features: [
      "Tudo do plano mensal",
      "Desconto de 17%",
      "Prioridade no suporte",
      "Relatórios avançados",
      "Integração com mapas",
    ],
    description: "Melhor custo-benefício para motoristas regulares",
  },
  annual: {
    id: "plan_annual",
    name: "Plano Anual",
    price: 299.90,
    currency: "BRL",
    duration: "annual",
    features: [
      "Tudo do plano semestral",
      "Desconto de 33%",
      "Suporte prioritário 24/7",
      "Consultoria financeira",
      "API access",
      "Relatórios customizados",
    ],
    description: "Melhor valor para motoristas profissionais",
  },
};

/**
 * Cria intenção de pagamento
 * TODO: Integrar com Stripe API
 */
export async function createPaymentIntent(
  userId: number,
  plan: "monthly" | "semestral" | "annual"
): Promise<PaymentIntent> {
  const planDetails = SUBSCRIPTION_PLANS[plan];

  return {
    id: `pi_${Date.now()}`,
    userId,
    plan,
    amount: planDetails.price,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Processa webhook de pagamento bem-sucedido
 * TODO: Integrar com Stripe webhooks
 */
export async function processPaymentSuccess(
  userId: number,
  plan: "monthly" | "semestral" | "annual",
  stripePaymentIntentId: string
): Promise<boolean> {
  try {
    const database = await getDb();
    if (!database) return false;

    // Cancelar assinatura anterior se existir
    const existingSubscription = await database
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (existingSubscription.length > 0) {
      await database
        .update(subscriptions)
        .set({
          status: "cancelled",
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.userId, userId));
    }

    // Criar nova assinatura
    const startDate = new Date();
    const endDate = new Date(startDate);

    if (plan === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === "semestral") {
      endDate.setMonth(endDate.getMonth() + 6);
    } else if (plan === "annual") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    await database
      .insert(subscriptions)
      .values({
        userId,
        plan,
        status: "active",
        startDate,
        endDate,
        autoRenew: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    console.log(`Pagamento processado com sucesso para usuário ${userId}, plano ${plan}`);
    return true;
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return false;
  }
}

/**
 * Processa webhook de pagamento falhado
 * TODO: Integrar com Stripe webhooks
 */
export async function processPaymentFailure(
  userId: number,
  reason: string
): Promise<boolean> {
  try {
    console.log(`Pagamento falhou para usuário ${userId}: ${reason}`);
    // TODO: Enviar email ao usuário notificando falha
    return true;
  } catch (error) {
    console.error("Erro ao processar falha de pagamento:", error);
    return false;
  }
}

/**
 * Verifica status de assinatura
 */
export async function checkSubscriptionStatus(userId: number): Promise<{
  isActive: boolean;
  plan?: "monthly" | "semestral" | "annual";
  daysRemaining?: number;
  renewalDate?: Date;
}> {
  try {
    const database = await getDb();
    if (!database) return { isActive: false };

    const subscription = await database
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (subscription.length === 0 || subscription[0].status !== "active") {
      return { isActive: false };
    }

    const sub = subscription[0];
    const now = new Date();
    const daysRemaining = Math.ceil(
      (sub.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      isActive: daysRemaining > 0,
      plan: sub.plan as "monthly" | "semestral" | "annual",
      daysRemaining: Math.max(0, daysRemaining),
      renewalDate: sub.endDate,
    };
  } catch (error) {
    console.error("Erro ao verificar status de assinatura:", error);
    return { isActive: false };
  }
}

/**
 * Gera recibo de pagamento
 */
export function generateReceipt(
  userId: number,
  plan: "monthly" | "semestral" | "annual",
  paymentDate: Date
): string {
  const planDetails = SUBSCRIPTION_PLANS[plan];
  const receiptId = `REC-${Date.now()}`;

  return `
RECIBO DE PAGAMENTO - DRIVER FINANCE
=====================================
ID do Recibo: ${receiptId}
Data: ${paymentDate.toLocaleDateString("pt-BR")}
Usuário ID: ${userId}

PLANO: ${planDetails.name}
Valor: R$ ${planDetails.price.toFixed(2)}
Duração: ${
    plan === "monthly"
      ? "1 mês"
      : plan === "semestral"
        ? "6 meses"
        : "1 ano"
  }

Status: PAGO
Método: Stripe

Obrigado por sua assinatura!
=====================================
  `;
}

/**
 * Calcula desconto para plano anual
 */
export function calculateDiscount(plan: "monthly" | "semestral" | "annual"): number {
  const monthlyPrice = SUBSCRIPTION_PLANS.monthly.price;
  const planPrice = SUBSCRIPTION_PLANS[plan].price;

  let monthsIncluded = 1;
  if (plan === "semestral") monthsIncluded = 6;
  if (plan === "annual") monthsIncluded = 12;

  const normalPrice = monthlyPrice * monthsIncluded;
  const discount = ((normalPrice - planPrice) / normalPrice) * 100;

  return Math.round(discount);
}

/**
 * Retorna informações de preço formatadas
 */
export function getPricingInfo(): Array<{
  plan: "monthly" | "semestral" | "annual";
  name: string;
  price: number;
  pricePerMonth: number;
  discount: number;
  features: string[];
}> {
  return Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => {
    const planKey = key as "monthly" | "semestral" | "annual";
    let monthsIncluded = 1;
    if (planKey === "semestral") monthsIncluded = 6;
    if (planKey === "annual") monthsIncluded = 12;

    return {
      plan: planKey,
      name: plan.name,
      price: plan.price,
      pricePerMonth: plan.price / monthsIncluded,
      discount: calculateDiscount(planKey),
      features: plan.features,
    };
  });
}
