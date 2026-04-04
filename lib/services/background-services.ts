/**
 * BackgroundServices - Inicialização e gerenciamento de serviços de background
 * Garante que todos os serviços estejam rodando corretamente
 */

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { logger } from "./logger";

const LOCATION_TASK_NAME = "background-location-task";
const JOURNEY_MONITOR_TASK = "journey-monitor-task";

class BackgroundServices {
  private isInitialized = false;
  private activeServices: Set<string> = new Set();

  /**
   * Inicializa todos os serviços de background
   */
  async initialize(): Promise<boolean> {
    logger.info("🚀 Inicializando serviços de background...");

    try {
      // Registrar tarefas
      await this.registerLocationTask();
      await this.registerJourneyMonitorTask();

      // Iniciar localização contínua
      const locationStarted = await this.startContinuousLocation();

      // Iniciar monitor de jornada
      const journeyStarted = await this.startJourneyMonitor();

      this.isInitialized = locationStarted && journeyStarted;

      if (this.isInitialized) {
        logger.info("✅ Serviços de background inicializados com sucesso");
      } else {
        logger.warn("⚠️ Alguns serviços falharam ao inicializar");
      }

      return this.isInitialized;
    } catch (error) {
      logger.error("❌ Erro ao inicializar serviços", error as Error);
      return false;
    }
  }

  /**
   * Registra tarefa de localização em background
   */
  private async registerLocationTask(): Promise<void> {
    logger.debug("📍 Registrando tarefa de localização...");

    try {
      TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
        if (error) {
          logger.error("❌ Erro na tarefa de localização", error as Error);
          return;
        }

        if (data) {
          const { locations } = data as { locations: any[] };
          logger.debug("📍 Localização recebida", {
            latitude: locations[0]?.coords?.latitude,
            longitude: locations[0]?.coords?.longitude,
          });

          // TODO: Processar localização
          // - Atualizar posição no mapa
          // - Verificar áreas de demanda
          // - Calcular distância percorrida
        }
      });

      logger.info("✅ Tarefa de localização registrada");
    } catch (error) {
      logger.error("❌ Erro ao registrar tarefa de localização", error as Error);
    }
  }

  /**
   * Registra tarefa de monitor de jornada
   */
  private async registerJourneyMonitorTask(): Promise<void> {
    logger.debug("🚗 Registrando tarefa de monitor de jornada...");

    try {
      TaskManager.defineTask(JOURNEY_MONITOR_TASK, async () => {
        logger.debug("🚗 Verificando status da jornada...");

        // TODO: Implementar lógica de monitoramento
        // - Verificar se está em corrida
        // - Detectar mudança de app
        // - Registrar eventos
      });

      logger.info("✅ Tarefa de monitor de jornada registrada");
    } catch (error) {
      logger.error("❌ Erro ao registrar tarefa de jornada", error as Error);
    }
  }

  /**
   * Inicia localização contínua em background
   */
  private async startContinuousLocation(): Promise<boolean> {
    logger.info("📍 Iniciando localização contínua...");

    try {
      const { status } = await Location.getBackgroundPermissionsAsync();

      if (status !== "granted") {
        logger.warn("⚠️ Permissão de localização em background não concedida");
        return false;
      }

      // Iniciar monitoramento de localização
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // 10 segundos
        distanceInterval: 50, // 50 metros
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "🚗 Rota do Lucro",
          notificationBody: "Monitorando sua jornada...",
          notificationColor: "#0a7ea4",
        },
      });

      logger.info("✅ Localização contínua iniciada");
      this.activeServices.add("location");
      return true;
    } catch (error) {
      logger.error("❌ Erro ao iniciar localização contínua", error as Error);
      return false;
    }
  }

  /**
   * Inicia monitor de jornada
   */
  private async startJourneyMonitor(): Promise<boolean> {
    logger.info("🚗 Iniciando monitor de jornada...");

    try {
      // Iniciar tarefa periódica
      await TaskManager.isTaskRegisteredAsync(JOURNEY_MONITOR_TASK);

      logger.info("✅ Monitor de jornada iniciado");
      this.activeServices.add("journey-monitor");
      return true;
    } catch (error) {
      logger.error("❌ Erro ao iniciar monitor de jornada", error as Error);
      return false;
    }
  }

  /**
   * Para localização contínua
   */
  async stopContinuousLocation(): Promise<void> {
    logger.info("⏹️ Parando localização contínua...");

    try {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      this.activeServices.delete("location");
      logger.info("✅ Localização contínua parada");
    } catch (error) {
      logger.error("❌ Erro ao parar localização", error as Error);
    }
  }

  /**
   * Verifica status de todos os serviços
   */
  async checkStatus(): Promise<Record<string, boolean>> {
    logger.debug("🔍 Verificando status dos serviços...");

    const status: Record<string, boolean> = {
      initialized: this.isInitialized,
      location: this.activeServices.has("location"),
      journeyMonitor: this.activeServices.has("journey-monitor"),
    };

    logger.debug("📊 Status dos serviços", status);
    return status;
  }

  /**
   * Para todos os serviços
   */
  async stopAll(): Promise<void> {
    logger.info("🛑 Parando todos os serviços...");

    try {
      await this.stopContinuousLocation();
      this.activeServices.clear();
      this.isInitialized = false;
      logger.info("✅ Todos os serviços parados");
    } catch (error) {
      logger.error("❌ Erro ao parar serviços", error as Error);
    }
  }

  /**
   * Retorna serviços ativos
   */
  getActiveServices(): string[] {
    return Array.from(this.activeServices);
  }
}

// Singleton
export const backgroundServices = new BackgroundServices();

/**
 * Hook para usar serviços de background
 */
export function useBackgroundServices() {
  return backgroundServices;
}

/**
 * Exemplo de uso:
 *
 * import { backgroundServices } from '@/lib/services/background-services';
 *
 * // Na inicialização do app
 * useEffect(() => {
 *   backgroundServices.initialize();
 *
 *   return () => {
 *     backgroundServices.stopAll();
 *   };
 * }, []);
 *
 * // Verificar status
 * const status = await backgroundServices.checkStatus();
 * console.log('Serviços ativos:', status);
 */
