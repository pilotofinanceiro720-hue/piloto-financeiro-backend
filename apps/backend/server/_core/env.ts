// ============================================================================
// PILOTO FINANCEIRO — Variáveis de Ambiente
// Sem dependências da Manus. Tudo configurável via .env
// ============================================================================

export const ENV = {
  // Core
  jwtSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI ?? "",
  googleRedirectUriMobile: process.env.GOOGLE_REDIRECT_URI_MOBILE ?? "pilotofinanceiro://oauth/callback",

  // Asaas
  asaasApiKey: process.env.ASAAS_API_KEY ?? "",
  asaasSandbox: process.env.ASAAS_SANDBOX === "true",
  asaasWebhookSecret: process.env.ASAAS_WEBHOOK_SECRET ?? "",

  // Gemini IA
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",

  // Manus OAuth
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  appId: process.env.MANUS_APP_ID ?? "",
  cookieSecret: process.env.COOKIE_SECRET ?? "",

  // App
  apiBaseUrl: process.env.API_BASE_URL ?? "https://api.pilotofinanceiro.com.br",
  adminEmail: process.env.ADMIN_EMAIL ?? "frederico.soares@pilotofinanceiro.com.br",

  // Links rastreáveis
  shortLinkBase: process.env.SHORT_LINK_BASE ?? "https://go.pilotofinanceiro.com.br",
};
