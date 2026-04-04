/**
 * Serviço de Gamificação
 * Gerencia badges, achievements e leaderboard
 */

export type BadgeType =
  | "first_referral"
  | "ten_referrals"
  | "hundred_referrals"
  | "top_referrer"
  | "commission_master"
  | "early_adopter"
  | "premium_subscriber"
  | "streak_7days"
  | "streak_30days"
  | "marketplace_explorer"
  | "savings_champion";

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  criteria: string;
  points: number;
}

export interface UserBadge {
  userId: number;
  badgeId: BadgeType;
  unlockedAt: Date;
  progress?: number; // Para badges com progresso (ex: 5/10 referências)
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  criteria: {
    type: "referrals" | "commission" | "streak" | "marketplace" | "plan";
    target: number;
  };
}

export interface UserAchievement {
  userId: number;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  userName: string;
  avatar?: string;
  referrals: number;
  commission: number;
  badges: number;
  points: number;
}

export const BADGES: Record<BadgeType, Badge> = {
  first_referral: {
    id: "first_referral",
    name: "Primeiro Passo",
    description: "Faça sua primeira referência",
    icon: "🎯",
    rarity: "common",
    criteria: "1 referência",
    points: 10,
  },
  ten_referrals: {
    id: "ten_referrals",
    name: "Iniciante",
    description: "Faça 10 referências",
    icon: "⭐",
    rarity: "uncommon",
    criteria: "10 referências",
    points: 50,
  },
  hundred_referrals: {
    id: "hundred_referrals",
    name: "Mestre de Referências",
    description: "Faça 100 referências",
    icon: "🏆",
    rarity: "rare",
    criteria: "100 referências",
    points: 200,
  },
  top_referrer: {
    id: "top_referrer",
    name: "Top Referenciador",
    description: "Fique no top 10 do leaderboard",
    icon: "👑",
    rarity: "epic",
    criteria: "Top 10 referências",
    points: 500,
  },
  commission_master: {
    id: "commission_master",
    name: "Mestre de Comissões",
    description: "Ganhe R$ 10.000 em comissões",
    icon: "💰",
    rarity: "epic",
    criteria: "R$ 10.000 em comissões",
    points: 500,
  },
  early_adopter: {
    id: "early_adopter",
    name: "Pioneiro",
    description: "Seja um dos primeiros 1000 usuários",
    icon: "🚀",
    rarity: "legendary",
    criteria: "Primeiros 1000 usuários",
    points: 1000,
  },
  premium_subscriber: {
    id: "premium_subscriber",
    name: "Premium Elite",
    description: "Assine o plano Premium",
    icon: "💎",
    rarity: "rare",
    criteria: "Plano Premium",
    points: 100,
  },
  streak_7days: {
    id: "streak_7days",
    name: "Consistência",
    description: "Faça referências por 7 dias seguidos",
    icon: "🔥",
    rarity: "uncommon",
    criteria: "7 dias de atividade",
    points: 75,
  },
  streak_30days: {
    id: "streak_30days",
    name: "Dedicação",
    description: "Faça referências por 30 dias seguidos",
    icon: "⚡",
    rarity: "rare",
    criteria: "30 dias de atividade",
    points: 300,
  },
  marketplace_explorer: {
    id: "marketplace_explorer",
    name: "Explorador",
    description: "Explore 50 ofertas no marketplace",
    icon: "🔍",
    rarity: "uncommon",
    criteria: "50 ofertas exploradas",
    points: 50,
  },
  savings_champion: {
    id: "savings_champion",
    name: "Campeão de Economias",
    description: "Economize R$ 1.000 com ofertas",
    icon: "💸",
    rarity: "rare",
    criteria: "R$ 1.000 economizados",
    points: 150,
  },
};

/**
 * Desbloqueia badge para usuário
 */
export async function unlockBadge(userId: number, badgeId: BadgeType): Promise<UserBadge> {
  try {
    const badge = BADGES[badgeId];

    if (!badge) {
      throw new Error(`Badge não encontrado: ${badgeId}`);
    }

    const userBadge: UserBadge = {
      userId,
      badgeId,
      unlockedAt: new Date(),
    };

    // TODO: Salvar no banco de dados
    // await database.insert(userBadges).values(userBadge);

    console.log(`🏅 Badge desbloqueado para usuário ${userId}: ${badge.name}`);

    return userBadge;
  } catch (error) {
    console.error("Erro ao desbloquear badge:", error);
    throw error;
  }
}

/**
 * Verifica e desbloqueia badges automáticos
 */
export async function checkAndUnlockBadges(
  userId: number,
  stats: {
    referrals: number;
    commission: number;
    daysActive: number;
    marketplaceViews: number;
    savings: number;
    planType?: string;
  }
): Promise<BadgeType[]> {
  try {
    const unlockedBadges: BadgeType[] = [];

    // Primeira referência
    if (stats.referrals === 1) {
      await unlockBadge(userId, "first_referral");
      unlockedBadges.push("first_referral");
    }

    // 10 referências
    if (stats.referrals >= 10 && stats.referrals < 100) {
      await unlockBadge(userId, "ten_referrals");
      unlockedBadges.push("ten_referrals");
    }

    // 100 referências
    if (stats.referrals >= 100) {
      await unlockBadge(userId, "hundred_referrals");
      unlockedBadges.push("hundred_referrals");
    }

    // R$ 10.000 em comissões
    if (stats.commission >= 10000) {
      await unlockBadge(userId, "commission_master");
      unlockedBadges.push("commission_master");
    }

    // Premium subscriber
    if (stats.planType === "premium") {
      await unlockBadge(userId, "premium_subscriber");
      unlockedBadges.push("premium_subscriber");
    }

    // 7 dias de atividade
    if (stats.daysActive >= 7) {
      await unlockBadge(userId, "streak_7days");
      unlockedBadges.push("streak_7days");
    }

    // 30 dias de atividade
    if (stats.daysActive >= 30) {
      await unlockBadge(userId, "streak_30days");
      unlockedBadges.push("streak_30days");
    }

    // 50 ofertas exploradas
    if (stats.marketplaceViews >= 50) {
      await unlockBadge(userId, "marketplace_explorer");
      unlockedBadges.push("marketplace_explorer");
    }

    // R$ 1.000 economizados
    if (stats.savings >= 1000) {
      await unlockBadge(userId, "savings_champion");
      unlockedBadges.push("savings_champion");
    }

    return unlockedBadges;
  } catch (error) {
    console.error("Erro ao verificar badges:", error);
    return [];
  }
}

/**
 * Obtém badges do usuário
 */
export async function getUserBadges(userId: number): Promise<UserBadge[]> {
  try {
    // TODO: Buscar do banco de dados
    // const badges = await database.select()
    //   .from(userBadges)
    //   .where(eq(userBadges.userId, userId));

    console.log(`Obtendo badges do usuário ${userId}`);

    return [];
  } catch (error) {
    console.error("Erro ao obter badges do usuário:", error);
    return [];
  }
}

/**
 * Obtém leaderboard
 */
export async function getLeaderboard(
  limit: number = 100,
  period: "week" | "month" | "all" = "month"
): Promise<LeaderboardEntry[]> {
  try {
    // TODO: Buscar do banco de dados com agregações
    // const leaderboard = await database.select({
    //   userId: users.id,
    //   userName: users.name,
    //   referrals: count(referrals.id),
    //   commission: sum(referrals.commission),
    //   badges: count(userBadges.id),
    // })
    //   .from(users)
    //   .leftJoin(referrals, eq(users.id, referrals.userId))
    //   .leftJoin(userBadges, eq(users.id, userBadges.userId))
    //   .groupBy(users.id)
    //   .orderBy(desc(count(referrals.id)))
    //   .limit(limit);

    console.log(`Obtendo leaderboard (período: ${period})`);

    // Mock data
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        rank: 1,
        userId: 1,
        userName: "João Silva",
        referrals: 250,
        commission: 15000,
        badges: 8,
        points: 2500,
      },
      {
        rank: 2,
        userId: 2,
        userName: "Maria Santos",
        referrals: 180,
        commission: 12000,
        badges: 6,
        points: 2000,
      },
      {
        rank: 3,
        userId: 3,
        userName: "Pedro Costa",
        referrals: 150,
        commission: 10000,
        badges: 7,
        points: 1800,
      },
    ];

    return mockLeaderboard;
  } catch (error) {
    console.error("Erro ao obter leaderboard:", error);
    return [];
  }
}

/**
 * Obtém posição do usuário no leaderboard
 */
export async function getUserLeaderboardPosition(userId: number): Promise<LeaderboardEntry | null> {
  try {
    const leaderboard = await getLeaderboard(10000);
    return leaderboard.find((entry) => entry.userId === userId) || null;
  } catch (error) {
    console.error("Erro ao obter posição no leaderboard:", error);
    return null;
  }
}

/**
 * Calcula pontos totais do usuário
 */
export async function calculateUserPoints(userId: number): Promise<number> {
  try {
    // TODO: Buscar dados do usuário
    // const stats = await getUserStats(userId);
    // const badges = await getUserBadges(userId);

    // Mock
    let points = 0;

    // Pontos por referências (1 ponto por referência)
    // points += stats.referrals;

    // Pontos por comissões (1 ponto a cada R$ 100)
    // points += Math.floor(stats.commission / 100);

    // Pontos por badges
    // points += badges.reduce((sum, badge) => sum + BADGES[badge.badgeId].points, 0);

    console.log(`Pontos calculados para usuário ${userId}: ${points}`);

    return points;
  } catch (error) {
    console.error("Erro ao calcular pontos:", error);
    return 0;
  }
}

/**
 * Obtém achievements do usuário
 */
export async function getUserAchievements(userId: number): Promise<UserAchievement[]> {
  try {
    // TODO: Buscar do banco de dados
    // const achievements = await database.select()
    //   .from(userAchievements)
    //   .where(eq(userAchievements.userId, userId));

    console.log(`Obtendo achievements do usuário ${userId}`);

    return [];
  } catch (error) {
    console.error("Erro ao obter achievements:", error);
    return [];
  }
}

/**
 * Gera relatório de gamificação
 */
export async function generateGamificationReport(userId: number): Promise<{
  badges: number;
  points: number;
  leaderboardPosition?: number;
  achievements: number;
  nextMilestone?: string;
}> {
  try {
    const badges = await getUserBadges(userId);
    const points = await calculateUserPoints(userId);
    const position = await getUserLeaderboardPosition(userId);
    const achievements = await getUserAchievements(userId);

    return {
      badges: badges.length,
      points,
      leaderboardPosition: position?.rank,
      achievements: achievements.length,
      nextMilestone: "100 referências",
    };
  } catch (error) {
    console.error("Erro ao gerar relatório de gamificação:", error);
    return {
      badges: 0,
      points: 0,
      achievements: 0,
    };
  }
}
