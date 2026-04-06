/**
 * Feature Flags Routes
 * Rotas para testar e gerenciar feature flags
 */

import { Express, Request, Response } from "express";
import { checkFeature, checkFeatures } from "../middleware/checkFeature";
import { getPlanFeatures, FEATURE_DESCRIPTIONS, validatePlan } from "../config/featureFlags";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        plan: string;
        email?: string;
      };
    }
  }
}

export function registerFeatureRoutes(app: Express) {
  /**
   * GET /api/features/check?feature=insights_ia&plan=top
   * Testa se um plano tem acesso a uma feature específica
   */
  app.get("/api/features/check", (req: Request, res: Response) => {
    try {
      const feature = req.query.feature as string;
      const plan = req.query.plan as string || "gratuito";

      if (!feature) {
        return res.status(400).json({
          error: "Missing parameter",
          details: "Parâmetro 'feature' é obrigatório",
          example: "/api/features/check?feature=insights_ia&plan=top",
        });
      }

      // Validar plano
      const validPlan = validatePlan(plan);
      if (!validPlan) {
        return res.status(400).json({
          error: "Invalid plan",
          details: `Plano inválido: ${plan}`,
          valid_plans: ["gratuito", "basico", "top", "premium"],
        });
      }

      // Mock user com plano especificado
      req.user = {
        id: "test-user",
        plan: validPlan,
        email: "test@example.com",
      };

      // Usar middleware de verificação
      checkFeature(feature as any)(req, res, () => {
        res.json({
          status: "allowed",
          feature,
          plan: validPlan,
          message: `Acesso permitido à feature '${feature}' para plano '${validPlan}'`,
        });
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  /**
   * GET /api/features/list
   * Lista todas as features disponíveis por plano
   */
  app.get("/api/features/list", (_req: Request, res: Response) => {
    try {
      const plans = ["gratuito", "basico", "top", "premium"];
      const result: Record<string, any> = {};

      for (const plan of plans) {
        const features = getPlanFeatures(plan as any);
        result[plan] = {
          features,
          descriptions: Object.fromEntries(
            features.map((f) => [f, FEATURE_DESCRIPTIONS[f]])
          ),
          count: features.length,
        };
      }

      res.json({
        status: "success",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  /**
   * GET /api/features/describe
   * Retorna descrição de todas as features
   */
  app.get("/api/features/describe", (_req: Request, res: Response) => {
    try {
      res.json({
        status: "success",
        data: FEATURE_DESCRIPTIONS,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  /**
   * POST /api/features/test
   * Testa o middleware checkFeature com um plano e feature específicos
   * Body: { plan: "top", feature: "insights_ia" }
   */
  app.post("/api/features/test", (req: Request, res: Response) => {
    try {
      const { plan, feature } = req.body;

      if (!plan || !feature) {
        return res.status(400).json({
          error: "Missing fields",
          details: "Campos 'plan' e 'feature' são obrigatórios",
          example: { plan: "top", feature: "insights_ia" },
        });
      }

      // Validar plano
      const validPlan = validatePlan(plan);
      if (!validPlan) {
        return res.status(400).json({
          error: "Invalid plan",
          details: `Plano inválido: ${plan}`,
          valid_plans: ["gratuito", "basico", "top", "premium"],
        });
      }

      // Mock user
      req.user = {
        id: "test-user",
        plan: validPlan,
        email: "test@example.com",
      };

      // Testar middleware
      checkFeature(feature)(req, res, () => {
        res.json({
          status: "allowed",
          plan: validPlan,
          feature,
          message: `Acesso permitido`,
        });
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });
}
