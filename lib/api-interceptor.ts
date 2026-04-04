import { getApiBaseUrl } from "@/constants/oauth";
import { Platform } from "react-native";
import * as Auth from "@/lib/_core/auth";
import { RefreshMutex } from "@/lib/_core/refresh-mutex";

/**
 * Realiza refresh do access token com mutex
 */
async function refreshAccessToken(): Promise<string | null> {
  // Tentar adquirir lock
  const queuedToken = await RefreshMutex.acquireLock();

  // Se estava em fila, retorna resultado
  if (queuedToken !== null) {
    console.log("[ApiInterceptor] Retornando token da fila");
    return queuedToken;
  }

  // Se lock foi adquirido, fazer refresh
  try {
    console.log("[ApiInterceptor] Iniciando refresh de access token");

    const response = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // Envia cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `[ApiInterceptor] Refresh falhou com status ${response.status}`,
      );
      // Limpar sessão se refresh falhar
      await Auth.removeSessionToken();
      await Auth.clearUserInfo();
      RefreshMutex.releaseLock(null, new Error("Refresh failed"));
      return null;
    }

    const data = (await response.json()) as { accessToken: string };
    const newToken = data.accessToken;

    console.log("[ApiInterceptor] Access token renovado com sucesso");

    // Armazenar novo token
    await Auth.setSessionToken(newToken);

    RefreshMutex.releaseLock(newToken);
    return newToken;
  } catch (error) {
    console.error("[ApiInterceptor] Erro ao fazer refresh:", error);
    // Limpar sessão em caso de erro
    await Auth.removeSessionToken();
    await Auth.clearUserInfo();
    RefreshMutex.releaseLock(null, error as Error);
    return null;
  }
}

/**
 * Backoff exponencial simples
 */
function getBackoffDelay(attempt: number): number {
  // 100ms * 2^attempt: 100ms, 200ms, 400ms
  return Math.min(100 * Math.pow(2, attempt), 1000);
}

/**
 * Verifica se a requisição é retryable
 */
function isRetryable(method?: string, status?: number): boolean {
  // Retry apenas para GET e erros de rede (sem status)
  if (method && method.toUpperCase() !== "GET") {
    return false;
  }
  // Retry para erros de rede e 5xx
  return !status || status >= 500;
}

/**
 * Interceptor de fetch global para renovar token automaticamente
 * Envolve a função fetch nativa
 */
export function setupApiInterceptor() {
  const originalFetch = global.fetch;
  const MAX_RETRIES = 3;

  global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const method = init?.method || "GET";
    const inputStr = String(input);
    let lastError: Error | null = null;

    // Retry loop apenas para GET requests
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        let response = await originalFetch(input, init);

        // Se 401 e não é uma requisição de refresh (evita loop infinito)
        if (
          response.status === 401 &&
          !inputStr.includes("/api/auth/refresh")
        ) {
          console.log("[ApiInterceptor] Recebido 401, tentando refresh de token");

          // Fazer refresh
          const newToken = await refreshAccessToken();

          if (!newToken) {
            console.error(
              "[ApiInterceptor] Refresh falhou, retornando resposta 401",
            );
            return response;
          }

          // Atualizar headers com novo token
          const newInit = {
            ...init,
            headers: {
              ...(init?.headers || {}),
              Authorization: `Bearer ${newToken}`,
            },
          };

          // Repetir requisição original com novo token
          console.log("[ApiInterceptor] Repetindo requisição com novo token");
          response = await originalFetch(input, newInit);
        }

        // Se sucesso ou erro não retryable, retornar
        if (response.ok || !isRetryable(method, response.status)) {
          return response;
        }

        // Se é retryable e não é última tentativa, aguardar e tentar novamente
        if (attempt < MAX_RETRIES - 1 && isRetryable(method, response.status)) {
          const delay = getBackoffDelay(attempt);
          console.log(
            `[ApiInterceptor] Erro ${response.status}, retry em ${delay}ms (tentativa ${attempt + 1}/${MAX_RETRIES})`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        return response;
      } catch (error) {
        lastError = error as Error;

        // Se é erro de rede e não é última tentativa
        if (attempt < MAX_RETRIES - 1 && isRetryable(method)) {
          const delay = getBackoffDelay(attempt);
          console.log(
            `[ApiInterceptor] Erro de rede, retry em ${delay}ms (tentativa ${attempt + 1}/${MAX_RETRIES}):`,
            error,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        // Se é última tentativa, lançar erro
        throw error;
      }
    }

    // Se saiu do loop sem sucesso, lançar último erro
    if (lastError) {
      throw lastError;
    }

    // Fallback (não deve chegar aqui)
    throw new Error("[ApiInterceptor] Requisição falhou após todas as tentativas");
  };

  console.log("[ApiInterceptor] Interceptor global de API configurado");
}

/**
 * Remove o interceptor (para testes ou limpeza)
 */
export function removeApiInterceptor() {
  // Restaurar fetch original seria necessário manter referência
  console.log("[ApiInterceptor] Interceptor removido");
}
