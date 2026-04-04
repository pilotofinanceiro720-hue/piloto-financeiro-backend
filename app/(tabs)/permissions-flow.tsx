/**
 * PermissionsFlow - Tela de fluxo guiado de permissões
 * Solicita permissões com explicações claras
 */

import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

interface PermissionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "pending" | "granted" | "denied";
  critical: boolean;
}

export default function PermissionsFlowScreen() {
  const colors = useColors();
  const [permissions, setPermissions] = useState<PermissionItem[]>([
    {
      id: "location-fg",
      title: "📍 Localização (Tempo Real)",
      description: "Detectar áreas de alta demanda e calcular rotas otimizadas",
      icon: "📍",
      status: "pending",
      critical: true,
    },
    {
      id: "location-bg",
      title: "📍 Localização (Background)",
      description: "Monitorar sua jornada mesmo com app fechado",
      icon: "📍",
      status: "pending",
      critical: true,
    },
    {
      id: "notifications",
      title: "🔔 Notificações",
      description: "Alertas de demanda alta e oportunidades de economia",
      icon: "🔔",
      status: "pending",
      critical: false,
    },
    {
      id: "storage",
      title: "💾 Armazenamento",
      description: "Salvar evidências visuais (screenshots) das corridas",
      icon: "💾",
      status: "pending",
      critical: false,
    },
  ]);

  const [allGranted, setAllGranted] = useState(false);

  // Verificar permissões ao carregar
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    console.log("🔍 Verificando permissões...");

    const locationFg = await Location.getForegroundPermissionsAsync();
    const locationBg = await Location.getBackgroundPermissionsAsync();
    const notif = await Notifications.getPermissionsAsync();

    setPermissions((prev) =>
      prev.map((p) => {
        if (p.id === "location-fg") {
          return { ...p, status: locationFg.status === "granted" ? "granted" : "pending" };
        }
        if (p.id === "location-bg") {
          return { ...p, status: locationBg.status === "granted" ? "granted" : "pending" };
        }
        if (p.id === "notifications") {
          return { ...p, status: notif.granted ? "granted" : "pending" };
        }
        return p;
      })
    );
  };

  const requestLocationForeground = async () => {
    console.log("📍 Solicitando localização (foreground)...");
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      console.log("✅ Localização (foreground) concedida");
      updatePermissionStatus("location-fg", "granted");
    } else {
      console.warn("❌ Localização (foreground) negada");
      updatePermissionStatus("location-fg", "denied");
      showDeniedAlert("Localização", "O app precisa de acesso à sua localização.");
    }
  };

  const requestLocationBackground = async () => {
    console.log("📍 Solicitando localização (background)...");
    const { status } = await Location.requestBackgroundPermissionsAsync();

    if (status === "granted") {
      console.log("✅ Localização (background) concedida");
      updatePermissionStatus("location-bg", "granted");
    } else {
      console.warn("❌ Localização (background) negada");
      updatePermissionStatus("location-bg", "denied");
      showDeniedAlert("Localização em Background", "O app precisa rastrear sua jornada.");
    }
  };

  const requestNotifications = async () => {
    console.log("🔔 Solicitando notificações...");
    const { status } = await Notifications.requestPermissionsAsync();

    if (status === "granted") {
      console.log("✅ Notificações concedidas");
      updatePermissionStatus("notifications", "granted");
    } else {
      console.warn("❌ Notificações negadas");
      updatePermissionStatus("notifications", "denied");
    }
  };

  const updatePermissionStatus = (
    id: string,
    status: "pending" | "granted" | "denied"
  ) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );

    // Verificar se todas as críticas foram concedidas
    const allCriticalGranted = permissions
      .filter((p) => p.critical)
      .every((p) => p.status === "granted" || (p.id === id && status === "granted"));

    setAllGranted(allCriticalGranted);
  };

  const showDeniedAlert = (title: string, message: string) => {
    Alert.alert(
      `${title} Necessária`,
      message,
      [
        {
          text: "Ativar nas Configurações",
          onPress: () => {
            console.log("📱 Abrindo configurações...");
            // TODO: Abrir configurações
          },
        },
        {
          text: "Depois",
          style: "cancel",
        },
      ]
    );
  };

  const handleRequestAll = async () => {
    console.log("🔐 Solicitando todas as permissões...");
    await requestLocationForeground();
    await requestLocationBackground();
    await requestNotifications();
  };

  const handleContinue = () => {
    if (allGranted) {
      console.log("✅ Continuando com app...");
      // TODO: Navegar para home
    } else {
      Alert.alert(
        "Permissões Obrigatórias",
        "Ative todas as permissões críticas para usar o app.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6 p-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              🔐 Permissões Necessárias
            </Text>
            <Text className="text-base text-muted">
              Ative as permissões para usar todos os recursos do Rota do Lucro
            </Text>
          </View>

          {/* Lista de permissões */}
          <View className="gap-3">
            {permissions.map((perm) => (
              <PermissionCard
                key={perm.id}
                permission={perm}
                colors={colors}
                onPress={() => {
                  if (perm.id === "location-fg") requestLocationForeground();
                  if (perm.id === "location-bg") requestLocationBackground();
                  if (perm.id === "notifications") requestNotifications();
                }}
              />
            ))}
          </View>

          {/* Botões de ação */}
          <View className="gap-3 mt-auto">
            {/* Solicitar todas */}
            <Pressable
              onPress={handleRequestAll}
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                paddingVertical: 16,
                borderRadius: 12,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text
                style={{
                  color: colors.background,
                  fontWeight: "600",
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                🔓 Ativar Todas as Permissões
              </Text>
            </Pressable>

            {/* Continuar */}
            <Pressable
              onPress={handleContinue}
              disabled={!allGranted}
              style={({ pressed }) => ({
                backgroundColor: allGranted ? colors.success : colors.border,
                paddingVertical: 16,
                borderRadius: 12,
                opacity: pressed && allGranted ? 0.8 : 1,
              })}
            >
              <Text
                style={{
                  color: allGranted ? colors.background : colors.muted,
                  fontWeight: "600",
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                {allGranted ? "✅ Continuar" : "⏳ Aguardando Permissões"}
              </Text>
            </Pressable>
          </View>

          {/* Aviso */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderLeftColor: colors.warning,
              borderLeftWidth: 4,
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                fontWeight: "500",
              }}
            >
              ⚠️ As permissões críticas (marcadas com 🔴) são necessárias para o funcionamento completo do app.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

/**
 * Componente de card de permissão
 */
function PermissionCard({
  permission,
  colors,
  onPress,
}: {
  permission: PermissionItem;
  colors: any;
  onPress: () => void;
}) {
  const statusColor =
    permission.status === "granted"
      ? colors.success
      : permission.status === "denied"
        ? colors.error
        : colors.warning;

  const statusText =
    permission.status === "granted"
      ? "✅ Concedida"
      : permission.status === "denied"
        ? "❌ Negada"
        : "⏳ Pendente";

  return (
    <Pressable
      onPress={onPress}
      disabled={permission.status === "granted"}
      style={({ pressed }) => ({
        backgroundColor: colors.surface,
        borderColor: statusColor,
        borderWidth: 2,
        borderRadius: 12,
        padding: 16,
        opacity: pressed && permission.status !== "granted" ? 0.8 : 1,
      })}
    >
      <View className="gap-2">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-foreground flex-1">
            {permission.title}
          </Text>
          {permission.critical && (
            <Text className="text-sm font-bold text-error">🔴 CRÍTICA</Text>
          )}
        </View>

        {/* Descrição */}
        <Text className="text-sm text-muted">{permission.description}</Text>

        {/* Status e botão */}
        <View className="flex-row justify-between items-center mt-2">
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: statusColor,
            }}
          >
            {statusText}
          </Text>

          {permission.status !== "granted" && (
            <Text
              style={{
                fontSize: 12,
                color: colors.primary,
                fontWeight: "600",
              }}
            >
              → Ativar
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
