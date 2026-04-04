/**
 * ErrorBoundary - Tratamento global de erros
 * Previne crashes silenciosos e fornece feedback ao usuário
 */

import React, { ReactNode } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error("🔴 ErrorBoundary capturou erro:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("❌ Detalhes do erro:", {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // TODO: Enviar para serviço de logging
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return <DefaultErrorFallback error={this.state.error} onReset={this.resetError} />;
    }

    return this.props.children;
  }
}

/**
 * Fallback padrão para erros
 */
function DefaultErrorFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  const colors = useColors();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View style={{ alignItems: "center", gap: 16 }}>
          {/* Ícone de erro */}
          <Text style={{ fontSize: 64 }}>⚠️</Text>

          {/* Título */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: colors.foreground,
              textAlign: "center",
            }}
          >
            Algo deu errado
          </Text>

          {/* Mensagem */}
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Desculpe, o aplicativo encontrou um erro inesperado.
          </Text>

          {/* Detalhes do erro (apenas em desenvolvimento) */}
          {__DEV__ && (
            <View
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.error,
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                marginVertical: 16,
                maxWidth: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: colors.error,
                  fontFamily: "monospace",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Erro:</Text> {error.message}
              </Text>
              {error.stack && (
                <ScrollView horizontal>
                  <Text
                    style={{
                      fontSize: 10,
                      color: colors.muted,
                      fontFamily: "monospace",
                    }}
                  >
                    {error.stack}
                  </Text>
                </ScrollView>
              )}
            </View>
          )}

          {/* Botões de ação */}
          <View style={{ gap: 12, width: "100%", marginTop: 16 }}>
            {/* Botão Tentar Novamente */}
            <Pressable
              onPress={onReset}
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text
                style={{
                  color: colors.background,
                  fontWeight: "600",
                  textAlign: "center",
                  fontSize: 14,
                }}
              >
                Tentar Novamente
              </Text>
            </Pressable>

            {/* Botão Contatar Suporte */}
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Contato de Suporte",
                  "Entre em contato com nossa equipe:\n\nEmail: suporte@rotadolucro.com\nWhatsApp: +55 (11) 98765-4321"
                );
              }}
              style={({ pressed }) => ({
                backgroundColor: colors.surface,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderColor: colors.border,
                borderWidth: 1,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text
                style={{
                  color: colors.foreground,
                  fontWeight: "600",
                  textAlign: "center",
                  fontSize: 14,
                }}
              >
                Contatar Suporte
              </Text>
            </Pressable>
          </View>

          {/* Dica */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 12,
              marginTop: 16,
              borderLeftColor: colors.warning,
              borderLeftWidth: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                fontWeight: "500",
              }}
            >
              💡 <Text style={{ fontWeight: "bold" }}>Dica:</Text> Tente reiniciar o aplicativo ou verificar sua conexão com a internet.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/**
 * Hook para capturar erros em componentes funcionais
 */
export function useErrorHandler() {
  return (error: Error) => {
    console.error("❌ Erro capturado:", error);
    Alert.alert("Erro", error.message || "Algo deu errado");
  };
}
