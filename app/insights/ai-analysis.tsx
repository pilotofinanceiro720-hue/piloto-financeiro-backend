/**
 * INSIGHTS COM GEMINI IA
 * Análises automáticas de desempenho e recomendações
 * TODO: Integrar com endpoints tRPC
 * TODO: Implementar cache de respostas
 */

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

interface AIInsight {
  title: string;
  content: string;
  type: "success" | "warning" | "info";
  icon: string;
}

export default function AIAnalysisScreen() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Chamar endpoint tRPC para gerar insights
    // const response = await trpc.insights.generateMonthly.query({...});
    
    // Dados mockados para demonstração
    setTimeout(() => {
      setInsights([
        {
          title: "Desempenho Excelente",
          content:
            "Você atingiu 95% da meta mensal. Mantendo este ritmo, você ganhará R$ 15.000 este mês.",
          type: "success",
          icon: "✅",
        },
        {
          title: "Oportunidade: Horário de Pico",
          content:
            "Sextas e sábados entre 17h-20h têm 40% mais demanda. Trabalhando nestes horários, você pode ganhar R$ 200-250 por dia.",
          type: "info",
          icon: "📈",
        },
        {
          title: "Região Mais Lucrativa",
          content:
            "Centro é sua melhor região com ganho médio de R$ 85/corrida. Considere aumentar tempo lá.",
          type: "success",
          icon: "🎯",
        },
        {
          title: "Alerta: Combustível",
          content:
            "Seu consumo de combustível subiu 15% este mês. Considere revisar o veículo ou otimizar rotas.",
          type: "warning",
          icon: "⚠️",
        },
        {
          title: "Meta Realista Sugerida",
          content:
            "Baseado no seu histórico, sugerimos meta diária de R$ 250 (você fez R$ 240 em média).",
          type: "info",
          icon: "🎲",
        },
        {
          title: "Consistência em Alta",
          content:
            "Você atingiu a meta em 18 dos 22 dias úteis (82%). Você está no top 10% de consistência!",
          type: "success",
          icon: "🔥",
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#1A8A2F" />
        <Text className="text-muted mt-4">Gerando insights com IA...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-6 gap-6">
          {/* HEADER */}
          <View>
            <Text className="text-3xl font-bold text-foreground">
              Análise com IA
            </Text>
            <Text className="text-sm text-muted mt-1">
              Insights automáticos baseados em seus dados
            </Text>
          </View>

          {/* INSIGHTS */}
          <View className="gap-4">
            {insights.map((insight, index) => {
              const bgColor =
                insight.type === "success"
                  ? "bg-success/10"
                  : insight.type === "warning"
                  ? "bg-warning/10"
                  : "bg-primary/10";

              const borderColor =
                insight.type === "success"
                  ? "border-success"
                  : insight.type === "warning"
                  ? "border-warning"
                  : "border-primary";

              const titleColor =
                insight.type === "success"
                  ? "text-success"
                  : insight.type === "warning"
                  ? "text-warning"
                  : "text-primary";

              return (
                <View
                  key={index}
                  className={`rounded-lg p-4 border ${bgColor} ${borderColor}`}
                >
                  <View className="flex-row items-start gap-3">
                    <Text className="text-2xl">{insight.icon}</Text>
                    <View className="flex-1">
                      <Text className={`text-base font-semibold ${titleColor} mb-2`}>
                        {insight.title}
                      </Text>
                      <Text className="text-sm text-foreground leading-relaxed">
                        {insight.content}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* GEMINI BADGE */}
          <View className="bg-surface rounded-lg p-4 items-center border border-border">
            <Text className="text-xs text-muted">
              Powered by Google Gemini IA
            </Text>
            <Text className="text-xs text-muted mt-1">
              Insights atualizados diariamente
            </Text>
          </View>

          {/* TODO: CUSTOM QUESTIONS */}
          <View className="bg-warning/10 rounded-lg p-4 border border-warning">
            <Text className="text-xs font-semibold text-warning mb-2">
              💬 PERGUNTAS CUSTOMIZADAS
            </Text>
            <Text className="text-xs text-muted">
              TODO: Implementar chat com IA para perguntas personalizadas
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
