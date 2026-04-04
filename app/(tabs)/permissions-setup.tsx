/**
 * Tela de Configuração de Permissões
 * Fluxo guiado para ativar todas as permissões necessárias
 */

import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";

interface PermissionItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  status: "pending" | "granted" | "denied";
  icon: string;
}

export default function PermissionsSetupScreen() {
  const colors = useColors();
  const [permissions, setPermissions] = useState<PermissionItem[]>([
    {
      id: "usage_access",
      name: "Acesso de Uso de Apps",
      description: "Detectar apps de mobilidade (Uber, 99, Loggi, etc)",
      required: true,
      status: "pending",
      icon: "📱",
    },
    {
      id: "location",
      name: "Localização",
      description: "Rastrear rota e calcular distância da corrida",
      required: true,
      status: "pending",
      icon: "📍",
    },
    {
      id: "background_location",
      name: "Localização em Background",
      description: "Continuar rastreando mesmo com app fechado",
      required: true,
      status: "pending",
      icon: "🌍",
    },
    {
      id: "foreground_service",
      name: "Serviço Foreground",
      description: "Manter monitoramento ativo enquanto trabalha",
      required: true,
      status: "pending",
      icon: "⚙️",
    },
    {
      id: "capture_screenshot",
      name: "Captura de Tela",
      description: "Registrar evidências visuais de corridas",
      required: true,
      status: "pending",
      icon: "📸",
    },
    {
      id: "battery_optimization",
      name: "Ignorar Otimização de Bateria",
      description: "Evitar que sistema encerre o app",
      required: true,
      status: "pending",
      icon: "🔋",
    },
    {
      id: "notifications",
      name: "Notificações",
      description: "Receber alertas de oportunidades e demanda",
      required: false,
      status: "pending",
      icon: "🔔",
    },
  ]);

  const [allGranted, setAllGranted] = useState(false);

  useEffect(() => {
    // Simular verificação de permissões
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    // TODO: Implementar verificação real de permissões
    // Por enquanto, simular com mock data
    console.log("🔍 Verificando permissões...");

    // Simular delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock: algumas permissões já concedidas
    const updated = permissions.map((p) => ({
      ...p,
      status: (Math.random() > 0.5 ? "granted" : "pending") as "pending" | "granted" | "denied",
    }));

    setPermissions(updated);

    // Verificar se todas as obrigatórias foram concedidas
    const allRequired = updated
      .filter((p) => p.required)
      .every((p) => p.status === "granted");

    setAllGranted(allRequired);
  };

  const requestPermission = async (permissionId: string) => {
    console.log(`📋 Solicitando permissão: ${permissionId}`);

    // TODO: Implementar solicitação real de permissão
    // Por enquanto, simular com mock

    Alert.alert(
      "Permissão Necessária",
      `Abra Configurações > Aplicativos > Rota do Lucro > Permissões e ative "${permissionId}"`,
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
        },
        {
          text: "Abrir Configurações",
          onPress: () => {
            // TODO: Abrir configurações do app
            console.log("Abrindo configurações...");
          },
        },
      ]
    );

    // Simular concessão após 2 segundos
    setTimeout(() => {
      setPermissions((prev) =>
        prev.map((p) =>
          p.id === permissionId ? { ...p, status: "granted" as const } : p
        )
      );

      // Verificar se todas foram concedidas
      const updated = permissions.map((p) =>
        p.id === permissionId ? { ...p, status: "granted" as const } : p
      );

      const allRequired = updated
        .filter((p) => p.required)
        .every((p) => p.status === "granted");

      setAllGranted(allRequired);
    }, 2000);
  };

  const getStatusColor = (status: "pending" | "granted" | "denied") => {
    switch (status) {
      case "granted":
        return colors.success;
      case "denied":
        return colors.error;
      default:
        return colors.warning;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "granted":
        return "✅";
      case "denied":
        return "❌";
      default:
        return "⏳";
    }
  };

  const requiredPermissions = permissions.filter((p) => p.required);
  const grantedCount = permissions.filter((p) => p.status === "granted").length;
  const requiredGrantedCount = requiredPermissions.filter(
    (p) => p.status === "granted"
  ).length;

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6 p-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Configurar Permissões
            </Text>
            <Text className="text-base text-muted">
              Ative as permissões para usar todas as funcionalidades
            </Text>
          </View>

          {/* Progress */}
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">
                Progresso
              </Text>
              <Text className="text-sm font-semibold text-primary">
                {requiredGrantedCount}/{requiredPermissions.length}
              </Text>
            </View>
            <View
              className="h-2 rounded-full bg-border"
              style={{
                backgroundColor: colors.border,
              }}
            >
              <View
                className="h-full rounded-full bg-success"
                style={{
                  width: `${(requiredGrantedCount / requiredPermissions.length) * 100}%`,
                  backgroundColor: colors.success,
                }}
              />
            </View>
          </View>

          {/* Permissions List */}
          <View className="gap-3">
            {permissions.map((permission) => (
              <View
                key={permission.id}
                className="rounded-lg border border-border bg-surface p-4"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1 gap-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xl">{permission.icon}</Text>
                      <Text className="flex-1 text-base font-semibold text-foreground">
                        {permission.name}
                      </Text>
                      {permission.required && (
                        <Text className="text-xs font-bold text-error">
                          OBRIGATÓRIA
                        </Text>
                      )}
                    </View>
                    <Text className="text-sm text-muted">
                      {permission.description}
                    </Text>
                  </View>
                  <Text className="text-xl">
                    {getStatusIcon(permission.status)}
                  </Text>
                </View>

                {permission.status !== "granted" && (
                  <Pressable
                    onPress={() => requestPermission(permission.id)}
                    className="mt-3 rounded-lg bg-primary py-2 px-4"
                    style={({ pressed }) => [
                      { opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <Text className="text-center font-semibold text-background">
                      Ativar
                    </Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>

          {/* Info Box */}
          <View
            className="rounded-lg border border-border bg-surface p-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <Text className="text-sm font-semibold text-foreground mb-2">
              💡 Dica
            </Text>
            <Text className="text-sm text-muted">
              Se as permissões não aparecerem, vá para Configurações →
              Aplicativos → Rota do Lucro → Permissões e ative manualmente.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            {allGranted ? (
              <Pressable
                className="rounded-lg bg-success py-3 px-4"
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <Text className="text-center font-bold text-background">
                  ✅ Tudo Configurado!
                </Text>
              </Pressable>
            ) : (
              <>
                <Pressable
                  onPress={checkPermissions}
                  className="rounded-lg border border-primary bg-background py-3 px-4"
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                >
                  <Text className="text-center font-semibold text-primary">
                    Verificar Novamente
                  </Text>
                </Pressable>
                <Text className="text-center text-xs text-muted">
                  {requiredGrantedCount}/{requiredPermissions.length} permissões
                  obrigatórias ativadas
                </Text>
              </>
            )}
          </View>

          {/* Stats */}
          <View
            className="rounded-lg border border-border bg-surface p-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <Text className="text-sm font-semibold text-foreground mb-2">
              📊 Resumo
            </Text>
            <View className="gap-1">
              <Text className="text-sm text-muted">
                ✅ Concedidas: {grantedCount}/{permissions.length}
              </Text>
              <Text className="text-sm text-muted">
                ⏳ Pendentes:{" "}
                {permissions.filter((p) => p.status === "pending").length}
              </Text>
              <Text className="text-sm text-muted">
                ❌ Negadas:{" "}
                {permissions.filter((p) => p.status === "denied").length}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
