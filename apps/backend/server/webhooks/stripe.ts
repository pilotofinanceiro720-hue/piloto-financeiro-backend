/**
 * Webhooks de Stripe
 * Sincroniza eventos de pagamento em tempo real
 */

import express, { Request, Response } from "express";

// TODO: Importar do banco de dados
// import { database } from "@/server/db";

/**
 * Tipos de eventos Stripe tratados
 */
export type StripeEventType =
  | "payment_intent.succeeded"
  | "payment_intent.payment_failed"
  | "charge.succeeded"
  | "charge.failed"
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "invoice.paid"
  | "invoice.payment_failed"
  | "transfer.created"
  | "transfer.updated"
  | "transfer.paid"
  | "transfer.failed";

/**
 * Handler para webhook de pagamento bem-sucedido
 */
export async function handlePaymentIntentSucceeded(event: any): Promise<void> {
  try {
    const paymentIntent = event.data.object;

    console.log(`✅ Pagamento bem-sucedido: ${paymentIntent.id}`);
    console.log(`   Valor: R$ ${(paymentIntent.amount / 100).toFixed(2)}`);
    console.log(`   Cliente: ${paymentIntent.customer}`);
    console.log(`   Metadados:`, paymentIntent.metadata);

    // TODO: Buscar usuário pelo customer ID
    // const user = await database.select()
    //   .from(users)
    //   .where(eq(users.stripeCustomerId, paymentIntent.customer));

    // TODO: Atualizar status de assinatura
    // if (paymentIntent.metadata.subscriptionId) {
    //   await database.update(subscriptions)
    //     .set({
    //       status: 'active',
    //       lastPaymentDate: new Date(),
    //       nextBillingDate: calculateNextBillingDate(paymentIntent.metadata.billingPeriod),
    //     })
    //     .where(eq(subscriptions.id, paymentIntent.metadata.subscriptionId));
    // }

    // TODO: Registrar transação
    // await database.insert(transactions).values({
    //   userId: user.id,
    //   stripePaymentId: paymentIntent.id,
    //   amount: paymentIntent.amount / 100,
    //   status: 'completed',
    //   type: 'subscription',
    //   metadata: paymentIntent.metadata,
    //   createdAt: new Date(),
    // });

    // TODO: Desbloquear funcionalidades do plano
    // await unlockPlanFeatures(user.id, paymentIntent.metadata.planId);

    // TODO: Enviar notificação ao usuário
    // await sendNotification(user.id, {
    //   title: '✅ Pagamento Confirmado',
    //   body: `Sua assinatura foi ativada com sucesso!`,
    // });

    console.log(`✅ Assinatura ativada para cliente ${paymentIntent.customer}`);
  } catch (error) {
    console.error("Erro ao processar pagamento bem-sucedido:", error);
    throw error;
  }
}

/**
 * Handler para webhook de pagamento falhado
 */
export async function handlePaymentIntentFailed(event: any): Promise<void> {
  try {
    const paymentIntent = event.data.object;

    console.log(`❌ Pagamento falhou: ${paymentIntent.id}`);
    console.log(`   Motivo: ${paymentIntent.last_payment_error?.message}`);
    console.log(`   Cliente: ${paymentIntent.customer}`);

    // TODO: Buscar usuário
    // const user = await database.select()
    //   .from(users)
    //   .where(eq(users.stripeCustomerId, paymentIntent.customer));

    // TODO: Atualizar status de assinatura
    // if (paymentIntent.metadata.subscriptionId) {
    //   await database.update(subscriptions)
    //     .set({
    //       status: 'payment_failed',
    //       failureReason: paymentIntent.last_payment_error?.message,
    //       failureCount: incrementFailureCount(),
    //     })
    //     .where(eq(subscriptions.id, paymentIntent.metadata.subscriptionId));
    // }

    // TODO: Bloquear funcionalidades premium
    // await restrictPlanFeatures(user.id);

    // TODO: Enviar notificação ao usuário
    // await sendNotification(user.id, {
    //   title: '❌ Pagamento Recusado',
    //   body: `Falha ao processar seu pagamento. Tente novamente.`,
    //   actionUrl: '/settings/billing',
    // });

    console.log(`❌ Assinatura bloqueada para cliente ${paymentIntent.customer}`);
  } catch (error) {
    console.error("Erro ao processar pagamento falhado:", error);
    throw error;
  }
}

/**
 * Handler para webhook de assinatura criada
 */
export async function handleSubscriptionCreated(event: any): Promise<void> {
  try {
    const subscription = event.data.object;

    console.log(`✅ Assinatura criada: ${subscription.id}`);
    console.log(`   Plano: ${subscription.items.data[0].plan.id}`);
    console.log(`   Cliente: ${subscription.customer}`);
    console.log(`   Próxima cobrança: ${new Date(subscription.current_period_end * 1000)}`);

    // TODO: Registrar assinatura no banco de dados
    // await database.insert(subscriptions).values({
    //   userId: user.id,
    //   stripeSubscriptionId: subscription.id,
    //   planId: subscription.items.data[0].plan.id,
    //   status: 'active',
    //   startDate: new Date(subscription.current_period_start * 1000),
    //   endDate: new Date(subscription.current_period_end * 1000),
    //   autoRenew: subscription.automatic_tax?.enabled || true,
    // });

    console.log(`✅ Assinatura registrada para cliente ${subscription.customer}`);
  } catch (error) {
    console.error("Erro ao processar assinatura criada:", error);
    throw error;
  }
}

/**
 * Handler para webhook de assinatura atualizada
 */
export async function handleSubscriptionUpdated(event: any): Promise<void> {
  try {
    const subscription = event.data.object;
    const previousAttributes = event.data.previous_attributes;

    console.log(`🔄 Assinatura atualizada: ${subscription.id}`);

    if (previousAttributes.plan) {
      console.log(`   Plano anterior: ${previousAttributes.plan.id}`);
      console.log(`   Novo plano: ${subscription.items.data[0].plan.id}`);
    }

    if (previousAttributes.status) {
      console.log(`   Status anterior: ${previousAttributes.status}`);
      console.log(`   Novo status: ${subscription.status}`);
    }

    // TODO: Atualizar assinatura no banco de dados
    // await database.update(subscriptions)
    //   .set({
    //     planId: subscription.items.data[0].plan.id,
    //     status: subscription.status,
    //     endDate: new Date(subscription.current_period_end * 1000),
    //   })
    //   .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

    // TODO: Se mudou de plano, atualizar funcionalidades
    // if (previousAttributes.plan) {
    //   await updatePlanFeatures(user.id, subscription.items.data[0].plan.id);
    // }

    console.log(`🔄 Assinatura atualizada para cliente ${subscription.customer}`);
  } catch (error) {
    console.error("Erro ao processar assinatura atualizada:", error);
    throw error;
  }
}

/**
 * Handler para webhook de assinatura cancelada
 */
export async function handleSubscriptionDeleted(event: any): Promise<void> {
  try {
    const subscription = event.data.object;

    console.log(`❌ Assinatura cancelada: ${subscription.id}`);
    console.log(`   Cliente: ${subscription.customer}`);

    // TODO: Atualizar status de assinatura
    // await database.update(subscriptions)
    //   .set({
    //     status: 'cancelled',
    //     cancelledAt: new Date(),
    //   })
    //   .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

    // TODO: Bloquear funcionalidades premium
    // await restrictPlanFeatures(user.id);

    // TODO: Enviar notificação ao usuário
    // await sendNotification(user.id, {
    //   title: '❌ Assinatura Cancelada',
    //   body: `Sua assinatura foi cancelada. Você pode reativar a qualquer momento.`,
    //   actionUrl: '/settings/subscription',
    // });

    console.log(`❌ Assinatura cancelada para cliente ${subscription.customer}`);
  } catch (error) {
    console.error("Erro ao processar assinatura cancelada:", error);
    throw error;
  }
}

/**
 * Handler para webhook de transferência bem-sucedida
 */
export async function handleTransferPaid(event: any): Promise<void> {
  try {
    const transfer = event.data.object;

    console.log(`✅ Transferência paga: ${transfer.id}`);
    console.log(`   Valor: R$ ${(transfer.amount / 100).toFixed(2)}`);
    console.log(`   Conta: ${transfer.destination}`);

    // TODO: Atualizar status de transferência
    // await database.update(transfers)
    //   .set({
    //     status: 'completed',
    //     completedAt: new Date(),
    //     stripeTransferId: transfer.id,
    //   })
    //   .where(eq(transfers.stripeTransferId, transfer.id));

    // TODO: Enviar notificação ao usuário
    // await sendNotification(user.id, {
    //   title: '✅ Saque Realizado',
    //   body: `Sua transferência de R$ ${(transfer.amount / 100).toFixed(2)} foi concluída!`,
    // });

    console.log(`✅ Transferência concluída para conta ${transfer.destination}`);
  } catch (error) {
    console.error("Erro ao processar transferência paga:", error);
    throw error;
  }
}

/**
 * Handler para webhook de transferência falhada
 */
export async function handleTransferFailed(event: any): Promise<void> {
  try {
    const transfer = event.data.object;

    console.log(`❌ Transferência falhou: ${transfer.id}`);
    console.log(`   Motivo: ${transfer.failure_message}`);
    console.log(`   Conta: ${transfer.destination}`);

    // TODO: Atualizar status de transferência
    // await database.update(transfers)
    //   .set({
    //     status: 'failed',
    //     failureReason: transfer.failure_message,
    //     failedAt: new Date(),
    //   })
    //   .where(eq(transfers.stripeTransferId, transfer.id));

    // TODO: Enviar notificação ao usuário
    // await sendNotification(user.id, {
    //   title: '❌ Saque Falhou',
    //   body: `Falha ao processar seu saque. Tente novamente.`,
    //   actionUrl: '/commissions/withdrawals',
    // });

    console.log(`❌ Transferência falhou para conta ${transfer.destination}`);
  } catch (error) {
    console.error("Erro ao processar transferência falhada:", error);
    throw error;
  }
}

/**
 * Router para webhooks de Stripe
 */
export function createStripeWebhookRouter(): express.Router {
  const router = express.Router();

  /**
   * POST /webhooks/stripe
   * Recebe e processa eventos de Stripe
   */
  router.post("/", async (req: Request, res: Response) => {
    try {
      const event = req.body;

      console.log(`📨 Webhook recebido: ${event.type}`);

      // TODO: Verificar assinatura do webhook
      // const signature = req.headers['stripe-signature'];
      // const event = stripe.webhooks.constructEvent(
      //   req.rawBody,
      //   signature,
      //   process.env.STRIPE_WEBHOOK_SECRET
      // );

      // Processar evento
      switch (event.type) {
        case "payment_intent.succeeded":
          await handlePaymentIntentSucceeded(event);
          break;

        case "payment_intent.payment_failed":
          await handlePaymentIntentFailed(event);
          break;

        case "customer.subscription.created":
          await handleSubscriptionCreated(event);
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(event);
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(event);
          break;

        case "transfer.paid":
          await handleTransferPaid(event);
          break;

        case "transfer.failed":
          await handleTransferFailed(event);
          break;

        default:
          console.log(`⚠️ Evento não tratado: ${event.type}`);
      }

      // Responder com sucesso
      res.json({ received: true });
    } catch (error) {
      console.error("Erro ao processar webhook:", error);
      res.status(400).json({
        error: "Erro ao processar webhook",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  });

  return router;
}

/**
 * Função auxiliar para calcular próxima data de cobrança
 */
function calculateNextBillingDate(billingPeriod: string): Date {
  const now = new Date();
  const nextDate = new Date(now);

  switch (billingPeriod) {
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "semestral":
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case "annual":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  return nextDate;
}

/**
 * Função auxiliar para incrementar contador de falhas
 */
function incrementFailureCount(): number {
  // TODO: Implementar lógica de incremento
  return 1;
}

export default createStripeWebhookRouter;
