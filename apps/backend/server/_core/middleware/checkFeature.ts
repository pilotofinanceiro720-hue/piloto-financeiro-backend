/**
 * Feature Check Middleware
 * Valida se o usuário autenticado tem acesso à feature solicitada
 */

import { Request, Response, NextFunction } from "express";
import { hasFeatureAccess, validatePlan, FeatureKey, PlanType } from "../config/featureFlags";

/**
 * Interface estendida do Request com dados do usuário
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        plan: PlanType;
        email?: string;
      };
    }
  }
}

/**
 * Middleware para verificar acesso a uma feature específica
 * 
 * Uso:
 * app.get("/api/insights", checkFeature("insights_ia"), handler)
 */
export function checkFeature(feature: FeatureKey) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar se usuário está autenticado
      if (!req.user) {
        console.log("[Feature Check] Usuário não autenticado");
        return res.status(401).json({
          error: "Unauthorized",
          details: "Usuário não autenticado",
        });
      }

      // Validar plano
      const plan = validatePlan(req.user.plan);
      if (!plan) {
        console.error("[Feature Check] Plano inválido:", req.user.plan);
        return res.status(400).json({
          error: "Invalid Plan",
          details: `Plano inválido: ${req.user.plan}`,
        });
      }

      // Verificar acesso à feature
      const hasAccess = hasFeatureAccess(plan, feature);

      if (!hasAccess) {
        console.log(`[Feature Check] Acesso negado para ${req.user.email || req.user.id}`, {
          plan,
          feature,
          requestedFeature: feature,
        });

        return res.status(403).json({
          error: "Forbidden",
          details: `Seu plano (${plan}) não tem acesso a esta funcionalidade (${feature})`,
          feature,
          plan,
          upgrade_required: true,
        });
      }

      // Acesso permitido - continuar
      console.log(`[Feature Check] Acesso permitido para ${req.user.email || req.user.id}`, {
        plan,
        feature,
      });

      next();
    } catch (error) {
      console.error("[Feature Check] Erro ao verificar feature:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: "Erro ao verificar acesso à funcionalidade",
      });
    }
  };
}

/**
 * Middleware para verificar múltiplas features (usuário precisa ter acesso a TODAS)
 */
export function checkFeatures(...features: FeatureKey[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Unauthorized",
          details: "Usuário não autenticado",
        });
      }

      const plan = validatePlan(req.user.plan);
      if (!plan) {
        return res.status(400).json({
          error: "Invalid Plan",
          details: `Plano inválido: ${req.user.plan}`,
        });
      }

      // Verificar se tem acesso a TODAS as features
      const missingFeatures = features.filter((f) => !hasFeatureAccess(plan, f));

      if (missingFeatures.length > 0) {
        console.log(`[Feature Check] Acesso negado para múltiplas features`, {
          user: req.user.email || req.user.id,
          plan,
          requested: features,
          missing: missingFeatures,
        });

        return res.status(403).json({
          error: "Forbidden",
          details: `Seu plano (${plan}) não tem acesso a todas as funcionalidades solicitadas`,
          missing_features: missingFeatures,
          plan,
          upgrade_required: true,
        });
      }

      next();
    } catch (error) {
      console.error("[Feature Check] Erro ao verificar múltiplas features:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: "Erro ao verificar acesso às funcionalidades",
      });
    }
  };
}
