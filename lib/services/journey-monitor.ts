/**
 * Monitor de Jornada
 * Detecta atividade em apps de mobilidade (Uber, 99, Loggi, etc)
 * Rastreia: tempo online, pausa, trabalhado, em corrida
 */

export type JourneyStatus = "online" | "paused" | "offline";

export interface JourneyMetrics {
  totalTimeOnline: number; // em minutos
  totalTimePaused: number; // em minutos
  totalTimeWorking: number; // em minutos (online - pausa)
  totalTimeInRide: number; // em minutos
  ridesCount: number;
  averageRideTime: number; // em minutos
  platformsActive: string[];
  currentStatus: JourneyStatus;
  lastStatusChange: Date;
  suggestEndDay: boolean;
  inactivityMinutes: number;
}

export interface WorkSession {
  id: string;
  userId: number;
  startTime: Date;
  endTime?: Date;
  status: JourneyStatus;
  platformsActive: string[];
  metricsData: JourneyMetrics;
  sessionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppActivity {
  appName: string;
  packageName: string;
  isActive: boolean;
  lastDetectedAt: Date;
  timeActive: number; // em minutos
}

/**
 * Plataformas de mobilidade suportadas
 */
const MOBILITY_PLATFORMS = [
  {
    name: "Uber",
    packageNames: ["com.ubercab", "com.ubercab.driver"],
    icon: "🚗",
  },
  {
    name: "99",
    packageNames: ["br.com.taxi99", "br.com.taxi99.driver"],
    icon: "🚕",
  },
  {
    name: "Loggi",
    packageNames: ["com.loggi.app", "com.loggi.driver"],
    icon: "📦",
  },
  {
    name: "Rappi",
    packageNames: ["com.rappi.client", "com.rappi.driver"],
    icon: "🏍️",
  },
  {
    name: "iFood",
    packageNames: ["com.ifood.isapp", "com.ifood.driver"],
    icon: "🍔",
  },
  {
    name: "Cornershop",
    packageNames: ["com.cornershop.app", "com.cornershop.driver"],
    icon: "🛒",
  },
];

/**
 * Monitora atividade de apps de mobilidade
 */
export class JourneyMonitor {
  private userId: number;
  private currentSession: WorkSession | null = null;
  private appActivities: Map<string, AppActivity> = new Map();
  private inactivityTimeout: ReturnType<typeof setTimeout> | null = null;
  private inactivityThreshold = 15; // minutos
  private statusCheckInterval: ReturnType<typeof setInterval> | null = null;

  constructor(userId: number) {
    this.userId = userId;
    this.initializeAppActivities();
  }

  /**
   * Inicializa rastreamento de apps
   */
  private initializeAppActivities(): void {
    MOBILITY_PLATFORMS.forEach((platform) => {
      platform.packageNames.forEach((packageName) => {
        this.appActivities.set(packageName, {
          appName: platform.name,
          packageName,
          isActive: false,
          lastDetectedAt: new Date(),
          timeActive: 0,
        });
      });
    });
  }

  /**
   * Inicia monitoramento de jornada
   */
  public startMonitoring(): void {
    console.log(`🚀 Iniciando monitoramento de jornada para usuário ${this.userId}`);

    // Criar nova sessão de trabalho
    this.currentSession = {
      id: `session_${Date.now()}`,
      userId: this.userId,
      startTime: new Date(),
      status: "online",
      platformsActive: [],
      metricsData: {
        totalTimeOnline: 0,
        totalTimePaused: 0,
        totalTimeWorking: 0,
        totalTimeInRide: 0,
        ridesCount: 0,
        averageRideTime: 0,
        platformsActive: [],
        currentStatus: "online",
        lastStatusChange: new Date(),
        suggestEndDay: false,
        inactivityMinutes: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Verificar atividade a cada 30 segundos
    this.statusCheckInterval = setInterval(() => {
      this.checkAppActivity();
    }, 30000);

    console.log(`✅ Monitoramento iniciado: ${this.currentSession.id}`);
  }

  /**
   * Verifica atividade de apps
   */
  private async checkAppActivity(): Promise<void> {
    if (!this.currentSession) return;

    try {
      // TODO: Integrar com ActivityRecognition API (Android)
      // const activities = await getActiveApps();

      // Mock data para desenvolvimento
      const activeApps = this.detectActiveApps();

      // Atualizar status baseado em apps ativos
      this.updateSessionStatus(activeApps);

      // Verificar inatividade
      this.checkInactivity();

      // Registrar atividade
      this.logActivity(activeApps);
    } catch (error) {
      console.error("Erro ao verificar atividade de apps:", error);
    }
  }

  /**
   * Detecta apps ativos (mock)
   */
  private detectActiveApps(): string[] {
    const activeApps: string[] = [];

    // Simular detecção de apps ativos
    this.appActivities.forEach((activity) => {
      // 60% de chance de estar ativo
      if (Math.random() > 0.4) {
        activeApps.push(activity.appName);
        activity.isActive = true;
        activity.lastDetectedAt = new Date();
        activity.timeActive += 0.5; // 30 segundos
      } else {
        activity.isActive = false;
      }
    });

    return activeApps;
  }

  /**
   * Atualiza status da sessão
   */
  private updateSessionStatus(activeApps: string[]): void {
    if (!this.currentSession) return;

    const previousStatus = this.currentSession.status;

    if (activeApps.length > 0) {
      this.currentSession.status = "online";
      this.currentSession.metricsData.platformsActive = activeApps;
      this.currentSession.metricsData.totalTimeOnline += 0.5; // 30 segundos
      this.currentSession.metricsData.totalTimeWorking += 0.5;

      // Limpar timeout de inatividade
      if (this.inactivityTimeout) {
        clearTimeout(this.inactivityTimeout as ReturnType<typeof setTimeout>);
        this.inactivityTimeout = null;
      }

      console.log(`🟢 ONLINE - Apps ativos: ${activeApps.join(", ")}`);
    } else {
      this.currentSession.status = "paused";
      this.currentSession.metricsData.totalTimePaused += 0.5; // 30 segundos

      console.log(`🟡 PAUSA - Sem apps ativos`);
    }

    // Registrar mudança de status
    if (previousStatus !== this.currentSession.status) {
      this.currentSession.metricsData.lastStatusChange = new Date();
      console.log(`📊 Status alterado: ${previousStatus} → ${this.currentSession.status}`);
    }

    this.currentSession.updatedAt = new Date();
  }

  /**
   * Verifica inatividade prolongada
   */
  private checkInactivity(): void {
    if (!this.currentSession) return;

    if (this.currentSession.status === "paused") {
      this.currentSession.metricsData.inactivityMinutes += 0.5;

      // Se inatividade > 15 minutos, sugerir encerramento
      if (this.currentSession.metricsData.inactivityMinutes >= this.inactivityThreshold) {
        this.currentSession.metricsData.suggestEndDay = true;
        console.log(`⚠️ SUGERIR ENCERRAR DIA - Inatividade de ${this.currentSession.metricsData.inactivityMinutes} minutos`);
      }
    } else {
      // Reset inatividade se voltou online
      this.currentSession.metricsData.inactivityMinutes = 0;
      this.currentSession.metricsData.suggestEndDay = false;
    }
  }

  /**
   * Registra atividade
   */
  private logActivity(activeApps: string[]): void {
    if (!this.currentSession) return;

    const metrics = this.currentSession.metricsData;

    console.log(`📋 Métricas da Jornada:`);
    console.log(`   ⏱️  Tempo Online: ${(metrics.totalTimeOnline / 60).toFixed(1)}h`);
    console.log(`   ⏸️  Tempo em Pausa: ${(metrics.totalTimePaused / 60).toFixed(1)}h`);
    console.log(`   💼 Tempo Trabalhado: ${(metrics.totalTimeWorking / 60).toFixed(1)}h`);
    console.log(`   🚗 Tempo em Corrida: ${(metrics.totalTimeInRide / 60).toFixed(1)}h`);
    console.log(`   📱 Plataformas Ativas: ${activeApps.join(", ") || "Nenhuma"}`);
    console.log(`   🔄 Status Atual: ${metrics.currentStatus.toUpperCase()}`);
  }

  /**
   * Registra início de corrida
   */
  public startRide(platformName: string): void {
    if (!this.currentSession) return;

    console.log(`🚗 Corrida iniciada em ${platformName}`);

    this.currentSession.metricsData.ridesCount += 1;
    this.currentSession.metricsData.platformsActive = [platformName];
    this.currentSession.status = "online";

    // TODO: Capturar screenshot inicial
    // captureInitialScreenshot();
  }

  /**
   * Registra fim de corrida
   */
  public endRide(platformName: string, durationMinutes: number): void {
    if (!this.currentSession) return;

    console.log(`✅ Corrida finalizada em ${platformName} (${durationMinutes}min)`);

    this.currentSession.metricsData.totalTimeInRide += durationMinutes;

    // Calcular tempo médio de corrida
    const totalRides = this.currentSession.metricsData.ridesCount;
    this.currentSession.metricsData.averageRideTime =
      this.currentSession.metricsData.totalTimeInRide / totalRides;

    // TODO: Capturar screenshot final
    // captureFinalScreenshot();

    // TODO: Disparar auditoria de corrida
    // auditRide();
  }

  /**
   * Encerra monitoramento
   */
  public stopMonitoring(): WorkSession | null {
    if (!this.currentSession) return null;

    console.log(`🛑 Encerrando monitoramento de jornada`);

    // Limpar intervalos
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval as ReturnType<typeof setInterval>);
      this.statusCheckInterval = null;
    }

    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = null;
    }

    // Finalizar sessão
    this.currentSession.endTime = new Date();
    this.currentSession.status = "offline";

    // Calcular resumo final
    const session = this.currentSession;
    console.log(`📊 Resumo da Jornada:`);
    const endTime = session.endTime || new Date();
    console.log(`   Duração: ${((endTime.getTime() - session.startTime.getTime()) / 1000 / 60).toFixed(1)} minutos`);
    console.log(`   Corridas: ${session.metricsData.ridesCount}`);
    console.log(`   Tempo Trabalhado: ${(session.metricsData.totalTimeWorking / 60).toFixed(1)}h`);
    console.log(`   Plataformas: ${session.metricsData.platformsActive.join(", ")}`);

    const result = this.currentSession;
    this.currentSession = null;

    return result;
  }

  /**
   * Obtém status atual
   */
  public getCurrentStatus(): JourneyStatus | null {
    return this.currentSession?.status || null;
  }

  /**
   * Obtém métricas atuais
   */
  public getCurrentMetrics(): JourneyMetrics | null {
    return this.currentSession?.metricsData || null;
  }

  /**
   * Obtém sessão atual
   */
  public getCurrentSession(): WorkSession | null {
    return this.currentSession;
  }

  /**
   * Verifica se deve sugerir encerramento
   */
  public shouldSuggestEndDay(): boolean {
    return this.currentSession?.metricsData.suggestEndDay || false;
  }

  /**
   * Obtém recomendação de IA
   */
  public getAIRecommendation(): string {
    if (!this.currentSession) return "";

    const metrics = this.currentSession.metricsData;
    const workingHours = metrics.totalTimeWorking / 60;
    const ridesPerHour = metrics.ridesCount / (workingHours || 1);

    if (metrics.suggestEndDay) {
      return `⚠️ Você está inativo há ${metrics.inactivityMinutes.toFixed(0)} minutos. Considere encerrar o dia.`;
    }

    if (workingHours > 8) {
      return `💡 Você trabalhou ${workingHours.toFixed(1)}h hoje. Considere descansar.`;
    }

    if (ridesPerHour < 2) {
      return `📈 Você está com ${ridesPerHour.toFixed(1)} corridas/hora. Tente se mover para áreas com mais demanda.`;
    }

    return `✅ Você está tendo um bom desempenho! Continue assim.`;
  }
}

/**
 * Factory para criar monitor de jornada
 */
export function createJourneyMonitor(userId: number): JourneyMonitor {
  return new JourneyMonitor(userId);
}

/**
 * Singleton global para monitoramento
 */
let globalMonitor: JourneyMonitor | null = null;

export function getGlobalJourneyMonitor(userId: number): JourneyMonitor {
  if (!globalMonitor) {
    globalMonitor = new JourneyMonitor(userId);
  }
  return globalMonitor;
}

export function resetGlobalJourneyMonitor(): void {
  if (globalMonitor) {
    globalMonitor.stopMonitoring();
    globalMonitor = null;
  }
}
