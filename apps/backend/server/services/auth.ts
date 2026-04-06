import { getDb } from "../db";
import { users, subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export interface GoogleAuthPayload {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthUser {
  id: number;
  openId: string;
  email: string | null;
  name: string | null;
  picture?: string;
  role: "user" | "admin";
  subscriptionStatus: "active" | "cancelled" | "expired";
  subscriptionPlan?: "monthly" | "semestral" | "annual";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Autentica ou cria usuário via Google OAuth
 */
export async function authenticateWithGoogle(payload: GoogleAuthPayload): Promise<AuthUser> {
  try {
    const database = await getDb();
    if (!database) throw new Error("Database connection failed");

    // Buscar usuário existente
    const existingUser = await database
      .select()
      .from(users)
      .where(eq(users.openId, payload.id))
      .limit(1);

    if (existingUser.length > 0) {
      const user = existingUser[0];
      
      // Buscar assinatura ativa
      const activeSubscription = await database
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, user.id))
        .limit(1);

      const subscription = activeSubscription[0];

      return {
        id: user.id,
        openId: user.openId,
        email: user.email,
        name: user.name,
        role: user.role as "user" | "admin",
        subscriptionStatus: (subscription?.status as "active" | "cancelled" | "expired") || "expired",
        subscriptionPlan: (subscription?.plan as "monthly" | "semestral" | "annual") || undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }

    // Criar novo usuário
    const newUser = await database
      .insert(users)
      .values({
        openId: payload.id,
        email: payload.email,
        name: payload.name,
        loginMethod: "google",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      });

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    // Buscar usuário criado
    const createdUser = await database
      .select()
      .from(users)
      .where(eq(users.openId, payload.id))
      .limit(1);

    if (createdUser.length === 0) {
      throw new Error("Failed to retrieve created user");
    }

    const user = createdUser[0];
    return {
      id: user.id,
      openId: user.openId,
      email: user.email,
      name: user.name,
      role: user.role as "user" | "admin",
      subscriptionStatus: "expired",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Erro ao autenticar com Google:", error);
    throw error;
  }
}

/**
 * Busca usuário por ID
 */
export async function getUserById(userId: number): Promise<AuthUser | null> {
  try {
    const database = await getDb();
    if (!database) return null;

    const result = await database
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (result.length === 0) return null;

    const user = result[0];
    
    // Buscar assinatura ativa
    const activeSubscription = await database
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1);

    const subscription = activeSubscription[0];

    return {
      id: user.id,
      openId: user.openId,
      email: user.email,
      name: user.name,
      role: user.role as "user" | "admin",
      subscriptionStatus: (subscription?.status as "active" | "cancelled" | "expired") || "expired",
      subscriptionPlan: (subscription?.plan as "monthly" | "semestral" | "annual") || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}

/**
 * Cria nova assinatura para usuário
 */
export async function createSubscription(
  userId: number,
  plan: "monthly" | "semestral" | "annual"
): Promise<boolean> {
  try {
    const database = await getDb();
    if (!database) return false;

    // Calcular data de término
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

    return true;
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    return false;
  }
}

/**
 * Cancela assinatura do usuário
 */
export async function cancelSubscription(userId: number): Promise<boolean> {
  try {
    const database = await getDb();
    if (!database) return false;

    const activeSubscription = await database
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (activeSubscription.length === 0) return false;

    // Atualizar status para cancelled
    // Note: Drizzle MySQL não suporta .returning() por padrão
    await database
      .update(subscriptions)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.userId, userId));

    return true;
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    return false;
  }
}

/**
 * Atualiza perfil do usuário
 */
export async function updateUserProfile(
  userId: number,
  data: { name?: string; email?: string }
): Promise<AuthUser | null> {
  try {
    const database = await getDb();
    if (!database) return null;

    await database
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return getUserById(userId);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return null;
  }
}

/**
 * Verifica se usuário é admin
 */
export function isAdmin(user: AuthUser): boolean {
  return user.role === "admin";
}

/**
 * Verifica se assinatura está ativa
 */
export function isSubscriptionActive(user: AuthUser): boolean {
  return user.subscriptionStatus === "active";
}

/**
 * Busca todos os usuários (apenas para admin)
 */
export async function getAllUsers(): Promise<AuthUser[]> {
  try {
    const database = await getDb();
    if (!database) return [];

    const allUsers = await database.select().from(users);

    return Promise.all(
      allUsers.map(async (user) => {
        const activeSubscription = await database
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, user.id))
          .limit(1);

        const subscription = activeSubscription[0];

        return {
          id: user.id,
          openId: user.openId,
          email: user.email,
          name: user.name,
          role: user.role as "user" | "admin",
          subscriptionStatus: (subscription?.status as "active" | "cancelled" | "expired") || "expired",
          subscriptionPlan: (subscription?.plan as "monthly" | "semestral" | "annual") || undefined,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      })
    );
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}
