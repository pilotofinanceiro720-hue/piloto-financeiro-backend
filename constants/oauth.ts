import * as Linking from "expo-linking";
import * as ReactNative from "react-native";

// ============================================================================
// PILOTO FINANCEIRO — Google OAuth 2.0 com PKCE
// Sem dependências da Manus. 100% configurável via variáveis de ambiente.
// ============================================================================

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";
export const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? "";
export const APP_SCHEME = "pilotofinanceiro";
export const SESSION_TOKEN_KEY = "pf_session_token";
export const USER_INFO_KEY = "pf_user_info";

export function getApiBaseUrl(): string {
  if (API_BASE_URL) return API_BASE_URL.replace(/\/$/, "");
  if (ReactNative.Platform.OS === "web" && typeof window !== "undefined" && window.location) {
    const { protocol, hostname } = window.location;
    const apiHostname = hostname.replace(/^8081-/, "3000-");
    if (apiHostname !== hostname) return `${protocol}//${apiHostname}`;
  }
  return "";
}

export const getRedirectUri = () => {
  if (ReactNative.Platform.OS === "web") {
    return `${getApiBaseUrl()}/api/auth/google/callback`;
  }
  return Linking.createURL("/oauth/callback", { scheme: APP_SCHEME });
};

export async function startOAuthLogin(): Promise<void> {
  const redirectUri = getRedirectUri();
  const loginUrl = `${getApiBaseUrl()}/api/auth/google/url?redirect_uri=${encodeURIComponent(redirectUri)}&platform=${ReactNative.Platform.OS}`;

  if (ReactNative.Platform.OS === "web") {
    if (typeof window !== "undefined") window.location.href = loginUrl;
    return;
  }

  const supported = await Linking.canOpenURL(loginUrl);
  if (!supported) { console.warn("[OAuth] Não foi possível abrir URL de login"); return; }
  try { await Linking.openURL(loginUrl); } catch (e) { console.error("[OAuth] Erro:", e); }
}
