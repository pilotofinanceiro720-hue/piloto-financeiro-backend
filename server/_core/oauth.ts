import type { Express, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

// ============================================================================
// PILOTO FINANCEIRO — Google OAuth 2.0 direto (sem Manus)
// ============================================================================

const oAuth2Client = new OAuth2Client(
  ENV.googleClientId,
  ENV.googleClientSecret,
  ENV.googleRedirectUri
);

function generateJwt(payload: object): string {
  return jwt.sign(payload, ENV.jwtSecret, { expiresIn: "30d" });
}

export function registerOAuthRoutes(app: Express) {
  // 1. Gera URL de autorização Google
  app.get("/api/auth/google/url", (req: Request, res: Response) => {
    try {
      const redirectUri = (req.query.redirect_uri as string) || ENV.googleRedirectUri;
      const platform = (req.query.platform as string) || "web";

      const client = new OAuth2Client(
        ENV.googleClientId,
        ENV.googleClientSecret,
        platform === "web" ? ENV.googleRedirectUri : ENV.googleRedirectUriMobile
      );

      const url = client.generateAuthUrl({
        access_type: "offline",
        scope: ["openid", "email", "profile"],
        state: Buffer.from(JSON.stringify({ platform, redirectUri })).toString("base64"),
        prompt: "consent",
      });

      if (platform === "web") {
        res.redirect(url);
      } else {
        res.json({ url });
      }
    } catch (err) {
      console.error("[OAuth] Erro ao gerar URL:", err);
      res.status(500).json({ error: "Falha ao gerar URL de autorização" });
    }
  });

  // 2. Callback Google (web)
  app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string;
      const stateRaw = req.query.state as string;

      if (!code) return res.status(400).json({ error: "Código de autorização ausente" });

      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      const ticket = await oAuth2Client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: ENV.googleClientId,
      });

      const payload = ticket.getPayload();
      if (!payload) return res.status(400).json({ error: "Token inválido" });

      const user = {
        googleId: payload.sub,
        email: payload.email ?? "",
        name: payload.name ?? "",
        avatarUrl: payload.picture ?? "",
      };

      const token = generateJwt(user);

      // Redireciona para o app com o token
      let state: any = {};
      try { state = JSON.parse(Buffer.from(stateRaw, "base64").toString()); } catch {}

      if (state.platform === "web") {
        res.cookie("pf_token", token, { httpOnly: true, secure: ENV.isProduction, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.redirect("/");
      } else {
        const deepLink = `pilotofinanceiro://oauth/callback?token=${encodeURIComponent(token)}`;
        res.redirect(deepLink);
      }
    } catch (err) {
      console.error("[OAuth] Erro no callback:", err);
      res.status(500).json({ error: "Falha na autenticação" });
    }
  });

  // 3. Callback mobile (deep link recebe o token e salva)
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Não autorizado" });

      const token = authHeader.slice(7);
      const decoded = jwt.verify(token, ENV.jwtSecret) as any;

      res.json({ user: decoded });
    } catch {
      res.status(401).json({ error: "Token inválido ou expirado" });
    }
  });
}
