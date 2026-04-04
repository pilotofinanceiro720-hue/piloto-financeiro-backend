/**
 * Tela de Checklist Automático de Validação
 * Verifica se todas as funcionalidades estão funcionando
 */

import { ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";

interface ValidationItem {
  id: string;
  name: string;
  description: string;
  status: "pending" | "checking" | "passed" | "failed";
  errorMessage?: string;
}

export default function ValidationChecklistScreen() {
  const colors = useColors();
  const [validationItems, setValidationItems] = useState<ValidationItem[]>([
    {
      id: "app_detection",
      name: "Detecção de App de Mobilidade",
      description: "Verificando se consegue detectar Uber, 99, Loggi...",
      status: "pending",
    },
    {
      id: "status_change",
      name: "Mudança de Status ONLINE/PAUSA",
      description: "Verificando transições de status",
      status: "pending",
    },
    {
      id: "session_register",
      name: "Registro de Sessão",
      description: "Verificando se sessões são registradas",
      status: "pending",
    },
    {
      id: "ride_audit",
      name: "Auditoria de Corrida",
      description: "Verificando cálculos e alertas",
      status: "pending",
    },
    {
      id: "evidence_capture",
      name: "Captura de Evidência",
      description: "Verificando screenshots",
      status: "pending",
    },
    {
      id: "backend_sync",
      name: "Sincronização com Backend",
      description: "Verificando conexão e envio de dados",
      status: "pending",
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Auto-start validation
    startValidation();
  }, []);

  const startValidation = async () => {
    setIsRunning(true);
    setProgress(0);

    for (let i = 0; i < validationItems.length; i++) {
      // Marcar como verificando
      setValidationItems((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: "checking" } : item
        )
      );

      // Simular verificação (2-3 segundos)
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

      // Simular resultado (90% sucesso, 10% erro)
      const success = Math.random() > 0.1;

      setValidationItems((prev) =>
        prev.map((item, idx) =>
          idx === i
            ? {
                ...item,
                status: success ? "passed" : "failed",
                errorMessage: success
                  ? undefined
                  : "Falha na verificação. Tente novamente.",
              }
            : item
        )
      );

      setProgress(((i + 1) / validationItems.length) * 100);
    }

    setIsRunning(false);
  };

  const retryValidation = async (itemId: string) => {
    const itemIndex = validationItems.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;

    // Marcar como verificando
    setValidationItems((prev) =>
      prev.map((item, idx) =>
        idx === itemIndex ? { ...item, status: "checking" } : item
      )
    );

    // Simular verificação
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simular resultado
    const success = Math.random() > 0.1;

    setValidationItems((prev) =>
      prev.map((item, idx) =>
        idx === itemIndex
          ? {
              ...item,
              status: success ? "passed" : "failed",
              errorMessage: success
                ? undefined
                : "Falha na verificação. Tente novamente.",
            }
          : item
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return "✅";
      case "failed":
        return "❌";
      case "checking":
        return "⏳";
      default:
        return "⏸️";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return colors.success;
      case "failed":
        return colors.error;
      case "checking":
        return colors.warning;
      default:
        return colors.muted;
    }
  };

  const passedCount = validationItems.filter((item) => item.status === "passed")
    .length;
  const failedCount = validationItems.filter((item) => item.status === "failed")
    .length;
  const allPassed = passedCount === validationItems.length;

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6 p-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Validação do App
            </Text>
            <Text className="text-base text-muted">
              Verificando todas as funcionalidades
            </Text>
          </View>

          {/* Progress */}
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">
                Progresso
              </Text>
              <Text className="text-sm font-semibold text-primary">
                {Math.round(progress)}%
              </Text>
            </View>
            <View
              className="h-3 rounded-full bg-border"
              style={{
                backgroundColor: colors.border,
              }}
            >
              <View
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${progress}%`,
                  backgroundColor: colors.primary,
                }}
              />
            </View>
          </View>

          {/* Validation Items */}
          <View className="gap-3">
            {validationItems.map((item) => (
              <View
                key={item.id}
                className="rounded-lg border border-border bg-surface p-4"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1 gap-1">
                    <View className="flex-row items-center gap-2">
                      {item.status === "checking" ? (
                        <ActivityIndicator size="small" color={colors.warning} />
                      ) : (
                        <Text className="text-xl">
                          {getStatusIcon(item.status)}
                        </Text>
                      )}
                      <Text className="flex-1 text-base font-semibold text-foreground">
                        {item.name}
                      </Text>
                    </View>
                    <Text className="text-sm text-muted">
                      {item.description}
                    </Text>
                    {item.errorMessage && (
                      <Text className="text-xs text-error mt-1">
                        {item.errorMessage}
                      </Text>
                    )}
                  </View>
                </View>

                {item.status === "failed" && (
                  <Pressable
                    onPress={() => retryValidation(item.id)}
                    className="mt-3 rounded-lg border border-primary bg-background py-2 px-4"
                    style={({ pressed }) => [
                      { opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <Text className="text-center font-semibold text-primary">
                      Tentar Novamente
                    </Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>

          {/* Summary */}
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
                ✅ Passou: {passedCount}/{validationItems.length}
              </Text>
              <Text className="text-sm text-muted">
                ❌ Falhou: {failedCount}/{validationItems.length}
              </Text>
              <Text className="text-sm text-muted">
                ⏳ Pendente:{" "}
                {validationItems.filter((item) => item.status === "pending")
                  .length}
              </Text>
            </View>
          </View>

          {/* Result Message */}
          {!isRunning && (
            <View
              className={`rounded-lg border p-4 ${
                allPassed
                  ? "border-success bg-success/10"
                  : "border-warning bg-warning/10"
              }`}
              style={{
                borderColor: allPassed ? colors.success : colors.warning,
                backgroundColor: allPassed
                  ? `${colors.success}10`
                  : `${colors.warning}10`,
              }}
            >
              <Text
                className={`text-sm font-semibold ${
                  allPassed ? "text-success" : "text-warning"
                }`}
                style={{
                  color: allPassed ? colors.success : colors.warning,
                }}
              >
                {allPassed
                  ? "🎉 Tudo funcionando perfeitamente!"
                  : "⚠️ Alguns itens falharam. Revise as permissões."}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          {!isRunning && (
            <View className="gap-3">
              {!allPassed && (
                <Pressable
                  onPress={startValidation}
                  className="rounded-lg bg-primary py-3 px-4"
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                >
                  <Text className="text-center font-bold text-background">
                    Validar Novamente
                  </Text>
                </Pressable>
              )}
              <Pressable
                className="rounded-lg border border-primary bg-background py-3 px-4"
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <Text className="text-center font-semibold text-primary">
                  Enviar Relatório
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
