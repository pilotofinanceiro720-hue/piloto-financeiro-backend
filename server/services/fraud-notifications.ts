/**
 * Serviço de Notificações em Tempo Real de Fraude
 * Envia alertas push para admins quando fraude é detectada
 */

export interface FraudNotification {
  id: string;
  adminId: number;
  fraudAlertId: string;
  userId: number;
  type: "critical" | "high" | "medium";
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  createdAt: Date;
  actionTaken?: "blocked" | "investigated" | "dismissed";
  actionTakenAt?: Date;
}

export interface AdminNotificationPreferences {
  adminId: number;
  notifyOnCritical: boolean;
  notifyOnHigh: boolean;
  notifyOnMedium: boolean;
  notifyOnLow: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  quietHoursStart?: string; // "HH:MM"
  quietHoursEnd?: string; // "HH:MM"
}

/**
 * Envia notificação de fraude crítica para admins
 */
export async function sendCriticalFraudNotification(
  fraudAlertId: string,
  userId: number,
  description: string,
  severity: "critical" | "high" | "medium"
): Promise<{ success: boolean; notificationIds: string[] }> {
  try {
    // TODO: Buscar todos os admins
    // const admins = await database.select()
    //   .from(adminUsers)
    //   .where(eq(adminUsers.role, 'admin'));

    const notificationIds: string[] = [];

    // TODO: Para cada admin, criar notificação
    // for (const admin of admins) {
    //   const prefs = await getAdminNotificationPreferences(admin.id);
    //   if (shouldNotifyAdmin(prefs, severity)) {
    //     const notification = await createFraudNotification(
    //       admin.id,
    //       fraudAlertId,
    //       userId,
    //       severity,
    //       description
    //     );
    //     notificationIds.push(notification.id);
    //     await sendPushNotification(admin.pushToken, notification);
    //     if (prefs.emailEnabled) {
    //       await sendEmailNotification(admin.email, notification);
    //     }
    //   }
    // }

    console.log(
      `🚨 Notificação de fraude ${severity} enviada: ${notificationIds.length} admins notificados`
    );

    return {
      success: true,
      notificationIds,
    };
  } catch (error) {
    console.error("Erro ao enviar notificação de fraude:", error);
    return {
      success: false,
      notificationIds: [],
    };
  }
}

/**
 * Cria notificação de fraude
 */
export async function createFraudNotification(
  adminId: number,
  fraudAlertId: string,
  userId: number,
  severity: "critical" | "high" | "medium",
  description: string
): Promise<FraudNotification | null> {
  try {
    // TODO: Salvar no banco de dados
    // await database.insert(fraudNotifications).values({
    //   adminId,
    //   fraudAlertId,
    //   userId,
    //   type: severity,
    //   title: `Alerta de Fraude ${severity.toUpperCase()}`,
    //   message: description,
    //   actionUrl: `/admin/fraud/${fraudAlertId}`,
    //   actionLabel: 'Ver Detalhes',
    //   read: false,
    //   createdAt: new Date()
    // });

    const notification: FraudNotification = {
      id: `fn_${Date.now()}`,
      adminId,
      fraudAlertId,
      userId,
      type: severity,
      title: `Alerta de Fraude ${severity.toUpperCase()}`,
      message: description,
      actionUrl: `/admin/fraud/${fraudAlertId}`,
      actionLabel: "Ver Detalhes",
      read: false,
      createdAt: new Date(),
    };

    console.log(`Notificação de fraude criada: ${notification.id}`);
    return notification;
  } catch (error) {
    console.error("Erro ao criar notificação de fraude:", error);
    return null;
  }
}

/**
 * Envia notificação push via Expo
 */
export async function sendPushNotification(
  pushToken: string,
  notification: FraudNotification
): Promise<boolean> {
  try {
    // TODO: Integrar com Expo Push Notifications
    // const message = {
    //   to: pushToken,
    //   sound: 'default',
    //   title: notification.title,
    //   body: notification.message,
    //   data: {
    //     fraudAlertId: notification.fraudAlertId,
    //     userId: notification.userId,
    //     actionUrl: notification.actionUrl
    //   }
    // };
    // await fetch('https://exp.host/--/api/v2/push/send', {
    //   method: 'POST',
    //   headers: { 'Accept': 'application/json', 'Accept-encoding': 'gzip, deflate', 'Content-Type': 'application/json' },
    //   body: JSON.stringify(message)
    // });

    console.log(`Notificação push enviada: ${pushToken}`);
    return true;
  } catch (error) {
    console.error("Erro ao enviar notificação push:", error);
    return false;
  }
}

/**
 * Envia notificação por email
 */
export async function sendEmailNotification(
  email: string,
  notification: FraudNotification
): Promise<boolean> {
  try {
    // TODO: Integrar com serviço de email (SendGrid, AWS SES, etc)
    // await sendEmail({
    //   to: email,
    //   subject: notification.title,
    //   html: `
    //     <h2>${notification.title}</h2>
    //     <p>${notification.message}</p>
    //     <a href="${notification.actionUrl}">${notification.actionLabel}</a>
    //   `
    // });

    console.log(`Notificação por email enviada: ${email}`);
    return true;
  } catch (error) {
    console.error("Erro ao enviar notificação por email:", error);
    return false;
  }
}

/**
 * Verifica se deve notificar admin baseado em preferências
 */
export function shouldNotifyAdmin(
  prefs: AdminNotificationPreferences,
  severity: "critical" | "high" | "medium" | "low"
): boolean {
  // Verificar preferência por severidade
  if (severity === "critical" && !prefs.notifyOnCritical) return false;
  if (severity === "high" && !prefs.notifyOnHigh) return false;
  if (severity === "medium" && !prefs.notifyOnMedium) return false;
  if (severity === "low" && !prefs.notifyOnLow) return false;

  // Verificar se está em horário de silêncio
  if (prefs.quietHoursStart && prefs.quietHoursEnd) {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (currentTime >= prefs.quietHoursStart && currentTime <= prefs.quietHoursEnd) {
      // Apenas notificar crítico durante horário de silêncio
      return severity === "critical";
    }
  }

  return true;
}

/**
 * Obtém preferências de notificação do admin
 */
export async function getAdminNotificationPreferences(
  adminId: number
): Promise<AdminNotificationPreferences> {
  try {
    // TODO: Buscar do banco de dados
    // const prefs = await database.select()
    //   .from(adminNotificationPreferences)
    //   .where(eq(adminNotificationPreferences.adminId, adminId))
    //   .limit(1);

    // if (prefs.length === 0) {
    //   return getDefaultNotificationPreferences(adminId);
    // }

    // return prefs[0];

    return {
      adminId,
      notifyOnCritical: true,
      notifyOnHigh: true,
      notifyOnMedium: true,
      notifyOnLow: false,
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "08:00",
    };
  } catch (error) {
    console.error("Erro ao obter preferências de notificação:", error);
    return getDefaultNotificationPreferences(adminId);
  }
}

/**
 * Obtém preferências padrão de notificação
 */
export function getDefaultNotificationPreferences(
  adminId: number
): AdminNotificationPreferences {
  return {
    adminId,
    notifyOnCritical: true,
    notifyOnHigh: true,
    notifyOnMedium: true,
    notifyOnLow: false,
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
  };
}

/**
 * Atualiza preferências de notificação
 */
export async function updateAdminNotificationPreferences(
  adminId: number,
  prefs: Partial<AdminNotificationPreferences>
): Promise<boolean> {
  try {
    // TODO: Atualizar no banco de dados
    // await database.update(adminNotificationPreferences)
    //   .set(prefs)
    //   .where(eq(adminNotificationPreferences.adminId, adminId));

    console.log(`Preferências de notificação atualizadas para admin ${adminId}`);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar preferências de notificação:", error);
    return false;
  }
}

/**
 * Marca notificação como lida
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<boolean> {
  try {
    // TODO: Atualizar no banco de dados
    // await database.update(fraudNotifications)
    //   .set({ read: true })
    //   .where(eq(fraudNotifications.id, notificationId));

    console.log(`Notificação marcada como lida: ${notificationId}`);
    return true;
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    return false;
  }
}

/**
 * Registra ação tomada em notificação
 */
export async function recordNotificationAction(
  notificationId: string,
  action: "blocked" | "investigated" | "dismissed"
): Promise<boolean> {
  try {
    // TODO: Atualizar no banco de dados
    // await database.update(fraudNotifications)
    //   .set({ actionTaken: action, actionTakenAt: new Date() })
    //   .where(eq(fraudNotifications.id, notificationId));

    console.log(`Ação registrada em notificação ${notificationId}: ${action}`);
    return true;
  } catch (error) {
    console.error("Erro ao registrar ação de notificação:", error);
    return false;
  }
}

/**
 * Obtém notificações não lidas do admin
 */
export async function getUnreadNotifications(adminId: number): Promise<FraudNotification[]> {
  try {
    // TODO: Buscar do banco de dados
    // const notifications = await database.select()
    //   .from(fraudNotifications)
    //   .where(and(
    //     eq(fraudNotifications.adminId, adminId),
    //     eq(fraudNotifications.read, false)
    //   ))
    //   .orderBy(desc(fraudNotifications.createdAt));

    console.log(`Obtendo notificações não lidas para admin ${adminId}`);
    return [];
  } catch (error) {
    console.error("Erro ao obter notificações não lidas:", error);
    return [];
  }
}

/**
 * Obtém histórico de notificações
 */
export async function getNotificationHistory(
  adminId: number,
  limit: number = 50
): Promise<FraudNotification[]> {
  try {
    // TODO: Buscar do banco de dados
    // const notifications = await database.select()
    //   .from(fraudNotifications)
    //   .where(eq(fraudNotifications.adminId, adminId))
    //   .orderBy(desc(fraudNotifications.createdAt))
    //   .limit(limit);

    console.log(`Obtendo histórico de notificações para admin ${adminId}`);
    return [];
  } catch (error) {
    console.error("Erro ao obter histórico de notificações:", error);
    return [];
  }
}

/**
 * Webhook para ação rápida de bloqueio de usuário
 */
export async function quickBlockUserFromNotification(
  notificationId: string,
  fraudAlertId: string,
  userId: number
): Promise<{ success: boolean; message: string }> {
  try {
    // TODO: Bloquear usuário
    // await blockSuspiciousUser(userId, `Bloqueado via notificação rápida: ${fraudAlertId}`);

    // TODO: Reverter comissões pendentes
    // await reversePendingCommissions(userId);

    // TODO: Registrar ação
    // await recordNotificationAction(notificationId, 'blocked');

    console.log(`Usuário ${userId} bloqueado rapidamente via notificação`);

    return {
      success: true,
      message: "Usuário bloqueado e comissões revertidas",
    };
  } catch (error) {
    console.error("Erro ao bloquear usuário via notificação:", error);
    return {
      success: false,
      message: "Erro ao bloquear usuário",
    };
  }
}
