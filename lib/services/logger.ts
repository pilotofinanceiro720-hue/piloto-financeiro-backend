/**
 * Logger - Sistema de logging estruturado
 * Centraliza logs com contexto, severidade e rastreamento
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isDev = __DEV__;

  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug(message: string, context?: Record<string, any>) {
    if (this.isDev) {
      console.log(`🔵 [DEBUG] ${message}`, context || "");
      this.addLog("debug", message, context);
    }
  }

  /**
   * Log de informação
   */
  info(message: string, context?: Record<string, any>) {
    console.log(`🟢 [INFO] ${message}`, context || "");
    this.addLog("info", message, context);
  }

  /**
   * Log de aviso
   */
  warn(message: string, context?: Record<string, any>) {
    console.warn(`🟡 [WARN] ${message}`, context || "");
    this.addLog("warn", message, context);
  }

  /**
   * Log de erro
   */
  error(message: string, error?: Error, context?: Record<string, any>) {
    console.error(`🔴 [ERROR] ${message}`, error || "", context || "");
    this.addLog("error", message, context, error);
  }

  /**
   * Log de erro fatal
   */
  fatal(message: string, error?: Error, context?: Record<string, any>) {
    console.error(`⛔ [FATAL] ${message}`, error || "", context || "");
    this.addLog("fatal", message, context, error);
    // TODO: Enviar para serviço de monitoramento
  }

  /**
   * Adiciona log ao buffer
   */
  private addLog(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      stack: error?.stack,
    };

    this.logs.push(entry);

    // Manter apenas os últimos N logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Retorna todos os logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Retorna logs filtrados por nível
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Retorna logs dos últimos N minutos
   */
  getRecentLogs(minutes: number = 5): LogEntry[] {
    const cutoff = Date.now() - minutes * 60 * 1000;
    return this.logs.filter((log) => new Date(log.timestamp).getTime() > cutoff);
  }

  /**
   * Limpa todos os logs
   */
  clear() {
    this.logs = [];
  }

  /**
   * Exporta logs como JSON
   */
  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Exporta logs como CSV
   */
  exportCSV(): string {
    const headers = ["Timestamp", "Level", "Message", "Context", "Error"];
    const rows = this.logs.map((log) => [
      log.timestamp,
      log.level,
      log.message,
      JSON.stringify(log.context || {}),
      log.error?.message || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

    return csv;
  }

  /**
   * Retorna resumo de logs
   */
  getSummary() {
    return {
      total: this.logs.length,
      debug: this.logs.filter((l) => l.level === "debug").length,
      info: this.logs.filter((l) => l.level === "info").length,
      warn: this.logs.filter((l) => l.level === "warn").length,
      error: this.logs.filter((l) => l.level === "error").length,
      fatal: this.logs.filter((l) => l.level === "fatal").length,
    };
  }
}

// Singleton
export const logger = new Logger();

/**
 * Hook para usar logger em componentes
 */
export function useLogger() {
  return logger;
}

/**
 * Exemplo de uso:
 *
 * import { logger } from '@/lib/services/logger';
 *
 * // Debug
 * logger.debug("Iniciando operação", { userId: 123 });
 *
 * // Info
 * logger.info("Usuário fez login", { email: "user@example.com" });
 *
 * // Warn
 * logger.warn("Bateria baixa", { percentage: 15 });
 *
 * // Error
 * try {
 *   await fetchData();
 * } catch (error) {
 *   logger.error("Falha ao carregar dados", error as Error, { endpoint: "/api/data" });
 * }
 *
 * // Fatal
 * logger.fatal("Erro crítico no app", error as Error);
 *
 * // Obter logs
 * const logs = logger.getLogs();
 * const recentLogs = logger.getRecentLogs(10); // Últimos 10 minutos
 * const errors = logger.getLogsByLevel("error");
 * const summary = logger.getSummary();
 *
 * // Exportar
 * const json = logger.export();
 * const csv = logger.exportCSV();
 */
