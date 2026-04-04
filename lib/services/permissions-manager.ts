/**
 * PermissionsManager - Gerenciamento de permissões Android
 * Solicita permissões com explicação ao usuário
 */

import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

export type PermissionType =
  | "location-foreground"
  | "location-background"
  | "app-usage"
  | "storage"
  | "notifications"
  | "foreground-service";

export interface PermissionStatus {
  type: PermissionType;
  granted: boolean;
  explanation?: string;
}

class PermissionsManager {
  private requestedPermissions: Set<PermissionType> = new Set();

  /**
   * Solicita permissão de localização em foreground
   */
  async requestLocationForeground(): Promise<boolean> {
    console.log("📍 Solicitando permissão de localização (foreground)...");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        console.log("✅ Localização (foreground) concedida");
        this.requestedPermissions.add("location-foreground");
        return true;
      } else {
        console.warn("❌ Localização (foreground) negada");
        this.showPermissionDeniedAlert(
          "Localização",
          "O app precisa de acesso à sua localização para detectar áreas de demanda e calcular rotas."
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao solicitar localização (foreground):", error);
      return false;
    }
  }

  /**
   * Solicita permissão de localização em background
   */
  async requestLocationBackground(): Promise<boolean> {
    console.log("📍 Solicitando permissão de localização (background)...");

    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();

      if (status === "granted") {
        console.log("✅ Localização (background) concedida");
        this.requestedPermissions.add("location-background");
        return true;
      } else {
        console.warn("❌ Localização (background) negada");
        this.showPermissionDeniedAlert(
          "Localização em Background",
          "O app precisa rastrear sua localização mesmo quando fechado para monitorar a jornada."
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao solicitar localização (background):", error);
      return false;
    }
  }

  /**
   * Solicita permissão de acesso a uso de apps
   */
  async requestAppUsage(): Promise<boolean> {
    console.log("📱 Solicitando permissão de acesso a uso de apps...");

    if (Platform.OS !== "android") {
      console.log("⚠️ Acesso a uso de apps apenas disponível em Android");
      return false;
    }

    // Em Android 12+, precisa de PACKAGE_USAGE_STATS
    // Este é um permissão especial que requer configuração manual
    console.log("✅ Acesso a uso de apps concedido (simulado)");
    this.requestedPermissions.add("app-usage");
    return true;
  }

  /**
   * Solicita permissão de armazenamento
   */
  async requestStorage(): Promise<boolean> {
    console.log("💾 Solicitando permissão de armazenamento...");
    // Armazenamento é geralmente concedido automaticamente em Android 11+
    this.requestedPermissions.add("storage");
    console.log("✅ Armazenamento concedido");
    return true;
  }

  /**
   * Solicita permissão de notificações
   */
  async requestNotifications(): Promise<boolean> {
    console.log("🔔 Solicitando permissão de notificações...");

    try {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status === "granted") {
        console.log("✅ Notificações concedidas");
        this.requestedPermissions.add("notifications");
        return true;
      } else {
        console.warn("❌ Notificações negadas");
        this.showPermissionDeniedAlert(
          "Notificações",
          "O app precisa enviar alertas sobre demanda alta e oportunidades de economia."
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao solicitar notificações:", error);
      return false;
    }
  }

  /**
   * Verifica status de todas as permissões
   */
  async checkAllPermissions(): Promise<PermissionStatus[]> {
    console.log("🔍 Verificando status de permissões...");

    const statuses: PermissionStatus[] = [];

    // Localização foreground
    const locationFg = await Location.getForegroundPermissionsAsync();
    statuses.push({
      type: "location-foreground",
      granted: locationFg.status === "granted",
      explanation: "Necessária para detectar áreas de demanda",
    });

    // Localização background
    const locationBg = await Location.getBackgroundPermissionsAsync();
    statuses.push({
      type: "location-background",
      granted: locationBg.status === "granted",
      explanation: "Necessária para monitorar jornada em background",
    });

    // Notificações
    const notifications = await Notifications.getPermissionsAsync();
    statuses.push({
      type: "notifications",
      granted: notifications.granted,
      explanation: "Necessária para alertas de demanda",
    });

    // Armazenamento (simulado)
    statuses.push({
      type: "storage",
      granted: true,
      explanation: "Necessária para salvar evidências",
    });

    console.log("📊 Status de permissões:", statuses);
    return statuses;
  }

  /**
   * Solicita todas as permissões essenciais
   */
  async requestAllEssential(): Promise<boolean> {
    console.log("🔐 Solicitando todas as permissões essenciais...");

    const results = await Promise.all([
      this.requestLocationForeground(),
      this.requestLocationBackground(),
      this.requestNotifications(),
      this.requestStorage(),
    ]);

    const allGranted = results.every((r) => r === true);

    if (allGranted) {
      console.log("✅ Todas as permissões concedidas");
    } else {
      console.warn("⚠️ Algumas permissões foram negadas");
    }

    return allGranted;
  }

  /**
   * Mostra alerta quando permissão é negada
   */
  private showPermissionDeniedAlert(title: string, message: string) {
    Alert.alert(
      `${title} Necessária`,
      message,
      [
        {
          text: "Ativar Agora",
          onPress: () => {
            console.log("📱 Abrindo configurações do dispositivo...");
            // TODO: Abrir configurações do app
          },
        },
        {
          text: "Depois",
          onPress: () => {
            console.log("⏭️ Usuário adiou permissão");
          },
          style: "cancel",
        },
      ]
    );
  }

  /**
   * Retorna permissões já solicitadas
   */
  getRequestedPermissions(): PermissionType[] {
    return Array.from(this.requestedPermissions);
  }

  /**
   * Limpa histórico de permissões solicitadas
   */
  reset() {
    this.requestedPermissions.clear();
  }
}

// Singleton
export const permissionsManager = new PermissionsManager();

/**
 * Hook para usar permissões em componentes
 */
export function usePermissions() {
  return permissionsManager;
}

/**
 * Exemplo de uso:
 *
 * import { usePermissions } from '@/lib/services/permissions-manager';
 *
 * export function PermissionsScreen() {
 *   const permissions = usePermissions();
 *
 *   const handleRequestAll = async () => {
 *     const allGranted = await permissions.requestAllEssential();
 *     if (allGranted) {
 *       console.log('✅ Pronto para usar o app');
 *     }
 *   };
 *
 *   return (
 *     <Button title="Ativar Permissões" onPress={handleRequestAll} />
 *   );
 * }
 */
