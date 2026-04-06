/**
 * Feature Flags Configuration
 * Define quais features estão disponíveis para cada plano
 */

export type PlanType = "gratuito" | "basico" | "top" | "premium";

export type FeatureKey =
  | "dashboard_basico"
  | "noticias"
  | "perfil_completo"
  | "insights_ia"
  | "recomendacoes"
  | "campanhas"
  | "personalizacao_avancada";

/**
 * Mapeamento de features por plano
 */
export const FEATURE_FLAGS: Record<PlanType, FeatureKey[]> = {
  gratuito: [
    "dashboard_basico",
    "noticias",
  ],
  basico: [
    "dashboard_basico",
    "noticias",
    "perfil_completo",
  ],
  top: [
    "dashboard_basico",
    "noticias",
    "perfil_completo",
    "insights_ia",
    "recomendacoes",
  ],
  premium: [
    "dashboard_basico",
    "noticias",
    "perfil_completo",
    "insights_ia",
    "recomendacoes",
    "campanhas",
    "personalizacao_avancada",
  ],
};

/**
 * Descrição das features para logs e debugging
 */
export const FEATURE_DESCRIPTIONS: Record<FeatureKey, string> = {
  dashboard_basico: "Dashboard básico com estatísticas",
  noticias: "Feed de notícias e vídeos",
  perfil_completo: "Perfil completo do usuário",
  insights_ia: "Insights e recomendações da IA",
  recomendacoes: "Recomendações personalizadas",
  campanhas: "Campanhas e promoções",
  personalizacao_avancada: "Personalização avançada da plataforma",
};

/**
 * Verifica se um plano tem acesso a uma feature
 */
export function hasFeatureAccess(plan: PlanType, feature: FeatureKey): boolean {
  return FEATURE_FLAGS[plan]?.includes(feature) ?? false;
}

/**
 * Retorna todas as features disponíveis para um plano
 */
export function getPlanFeatures(plan: PlanType): FeatureKey[] {
  return FEATURE_FLAGS[plan] ?? [];
}

/**
 * Retorna o plano a partir de uma string (com validação)
 */
export function validatePlan(plan: string): PlanType | null {
  const validPlans: PlanType[] = ["gratuito", "basico", "top", "premium"];
  return validPlans.includes(plan as PlanType) ? (plan as PlanType) : null;
}
