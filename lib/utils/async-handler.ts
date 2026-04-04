/**
 * AsyncHandler - Utilitários para gerenciar operações assíncronas
 * Previne race conditions, deadlocks e garante timeout
 */

/**
 * Wrapper para operações assíncronas com timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 5000,
  errorMessage: string = "Operação expirou"
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`⏱️ ${errorMessage} (${timeoutMs}ms)`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

/**
 * Retry com backoff exponencial
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    backoffMultiplier?: number;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 100,
    maxDelayMs = 5000,
    backoffMultiplier = 2,
  } = options;

  let lastError: Error | null = null;
  let delay = initialDelayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Tentativa ${attempt + 1}/${maxRetries + 1}`);
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`❌ Tentativa ${attempt + 1} falhou:`, lastError.message);

      if (attempt < maxRetries) {
        console.log(`⏳ Aguardando ${delay}ms antes de tentar novamente...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * backoffMultiplier, maxDelayMs);
      }
    }
  }

  throw new Error(
    `❌ Falha após ${maxRetries + 1} tentativas: ${lastError?.message || "Erro desconhecido"}`
  );
}

/**
 * Debounce para funções assíncronas
 */
export function debounce<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delayMs: number = 300
): (...args: Parameters<T>) => Promise<void> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastPromise: Promise<any> | null = null;

  return async (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    lastPromise = new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        try {
          await fn(...args);
        } catch (error) {
          console.error("❌ Erro em debounced function:", error);
        } finally {
          resolve(undefined);
        }
      }, delayMs);
    });

    return lastPromise;
  };
}

/**
 * Throttle para funções assíncronas
 */
export function throttle<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  intervalMs: number = 300
): (...args: Parameters<T>) => Promise<void> {
  let lastCallTime = 0;
  let isWaiting = false;

  return async (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeSinceLastCall >= intervalMs && !isWaiting) {
      lastCallTime = now;
      isWaiting = true;

      try {
        await fn(...args);
      } catch (error) {
        console.error("❌ Erro em throttled function:", error);
      } finally {
        isWaiting = false;
      }
    }
  };
}

/**
 * AbortController helper para cancelar requisições
 */
export class CancellablePromise<T> {
  private abortController: AbortController;
  private promise: Promise<T>;

  constructor(fn: (signal: AbortSignal) => Promise<T>) {
    this.abortController = new AbortController();
    this.promise = fn(this.abortController.signal);
  }

  cancel(): void {
    console.log("🛑 Cancelando operação...");
    this.abortController.abort();
  }

  async execute(): Promise<T> {
    try {
      return await this.promise;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("⚠️ Operação foi cancelada");
        throw new Error("Operação cancelada pelo usuário");
      }
      throw error;
    }
  }
}

/**
 * Pool de requisições para evitar sobrecarga
 */
export class RequestPool {
  private activeRequests = 0;
  private maxConcurrent: number;
  private queue: Array<() => Promise<any>> = [];

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    while (this.activeRequests >= this.maxConcurrent) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    this.activeRequests++;

    try {
      return await fn();
    } finally {
      this.activeRequests--;
    }
  }

  getActiveCount(): number {
    return this.activeRequests;
  }
}

/**
 * Exemplo de uso:
 *
 * // Com timeout
 * const data = await withTimeout(
 *   fetchData(),
 *   5000,
 *   "Falha ao carregar dados"
 * );
 *
 * // Com retry
 * const data = await withRetry(
 *   () => fetchData(),
 *   { maxRetries: 3, initialDelayMs: 100 }
 * );
 *
 * // Com debounce
 * const debouncedSearch = debounce(
 *   (query: string) => searchAPI(query),
 *   300
 * );
 *
 * // Com cancelamento
 * const cancellable = new CancellablePromise(
 *   (signal) => fetchWithSignal(signal)
 * );
 * cancellable.execute().catch(console.error);
 * // cancellable.cancel();
 *
 * // Com pool
 * const pool = new RequestPool(5);
 * await pool.execute(() => fetchData());
 */
