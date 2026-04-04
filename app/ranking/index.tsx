/**
 * RANKING DE MOTORISTAS
 * Competição saudável com scoring baseado em ganhos, consistência e meta
 * TODO: Implementar gamificação (badges, achievements)
 * TODO: Implementar sistema de rewards
 */

import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

interface RankingEntry {
  position: number;
  name: string;
  score: number;
  totalEarnings: number;
  totalRides: number;
  streak: number;
  badge?: string;
}

const MOCK_RANKING: RankingEntry[] = [
  {
    position: 1,
    name: "Carlos S.",
    score: 98,
    totalEarnings: 12500,
    totalRides: 450,
    streak: 15,
    badge: "🏆",
  },
  {
    position: 2,
    name: "Marina P.",
    score: 95,
    totalEarnings: 11800,
    totalRides: 420,
    streak: 12,
    badge: "🥈",
  },
  {
    position: 3,
    name: "João L.",
    score: 92,
    totalEarnings: 11200,
    totalRides: 400,
    streak: 10,
    badge: "🥉",
  },
  {
    position: 4,
    name: "Ana T.",
    score: 88,
    totalEarnings: 10500,
    totalRides: 380,
    streak: 8,
  },
  {
    position: 5,
    name: "Você",
    score: 85,
    totalEarnings: 9800,
    totalRides: 350,
    streak: 6,
  },
];

export default function RankingScreen() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("month");
  const userPosition = 5;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-6 gap-6">
          {/* HEADER */}
          <View>
            <Text className="text-3xl font-bold text-foreground">
              Ranking de Motoristas
            </Text>
            <Text className="text-sm text-muted mt-1">
              Compita e ganhe prêmios
            </Text>
          </View>

          {/* TIMEFRAME SELECTOR */}
          <View className="flex-row gap-2">
            {(["week", "month", "all"] as const).map((tf) => (
              <View
                key={tf}
                className={`flex-1 py-2 rounded-lg items-center ${
                  timeframe === tf ? "bg-primary" : "bg-surface"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    timeframe === tf ? "text-white" : "text-foreground"
                  }`}
                >
                  {tf === "week"
                    ? "Semana"
                    : tf === "month"
                    ? "Mês"
                    : "Tudo"}
                </Text>
              </View>
            ))}
          </View>

          {/* YOUR POSITION */}
          <View className="bg-primary/10 rounded-lg p-4 border-2 border-primary">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-muted mb-1">Sua Posição</Text>
                <Text className="text-3xl font-bold text-primary">
                  #{userPosition}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-sm text-muted mb-1">Score</Text>
                <Text className="text-3xl font-bold text-primary">85</Text>
              </View>
            </View>
            <View className="mt-3 pt-3 border-t border-primary/20">
              <Text className="text-xs text-muted">
                Próximo nível: 4º lugar (88 pontos)
              </Text>
              <View className="w-full bg-border rounded-full h-2 mt-2">
                <View
                  className="h-2 rounded-full bg-primary"
                  style={{ width: "97%" }}
                />
              </View>
            </View>
          </View>

          {/* TOP 5 */}
          <View className="gap-3">
            {MOCK_RANKING.map((entry) => (
              <View
                key={entry.position}
                className={`rounded-lg p-4 flex-row items-center gap-3 ${
                  entry.position <= 3 ? "bg-surface border border-primary" : "bg-surface"
                }`}
              >
                {/* POSITION */}
                <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                  <Text className="text-lg font-bold text-primary">
                    {entry.badge || `#${entry.position}`}
                  </Text>
                </View>

                {/* INFO */}
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-base font-semibold text-foreground">
                      {entry.name}
                    </Text>
                    {entry.streak >= 10 && (
                      <Text className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">
                        🔥 {entry.streak}d
                      </Text>
                    )}
                  </View>
                  <Text className="text-xs text-muted">
                    {entry.totalRides} corridas • R$ {entry.totalEarnings.toLocaleString()}
                  </Text>
                </View>

                {/* SCORE */}
                <View className="items-end">
                  <Text className="text-lg font-bold text-primary">
                    {entry.score}
                  </Text>
                  <Text className="text-xs text-muted">pts</Text>
                </View>
              </View>
            ))}
          </View>

          {/* SCORING EXPLANATION */}
          <View className="bg-surface rounded-lg p-4">
            <Text className="text-sm font-semibold text-foreground mb-3">
              Como o Score é Calculado
            </Text>
            <View className="gap-2">
              <View className="flex-row items-start gap-2">
                <Text className="text-primary font-bold">40%</Text>
                <Text className="text-xs text-muted flex-1">
                  Ganhos totais do período
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-primary font-bold">30%</Text>
                <Text className="text-xs text-muted flex-1">
                  Consistência (meta diária atingida)
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-primary font-bold">20%</Text>
                <Text className="text-xs text-muted flex-1">
                  Número de corridas
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Text className="text-primary font-bold">10%</Text>
                <Text className="text-xs text-muted flex-1">
                  Streak (dias consecutivos com meta)
                </Text>
              </View>
            </View>
          </View>

          {/* REWARDS */}
          <View className="bg-success/10 rounded-lg p-4 border border-success">
            <Text className="text-sm font-semibold text-success mb-3">
              Prêmios do Mês
            </Text>
            <View className="gap-2">
              <Text className="text-xs text-foreground">
                1º lugar: R$ 500 de crédito
              </Text>
              <Text className="text-xs text-foreground">
                2º lugar: R$ 300 de crédito
              </Text>
              <Text className="text-xs text-foreground">
                3º lugar: R$ 200 de crédito
              </Text>
            </View>
          </View>

          {/* TODO: GAMIFICATION */}
          <View className="bg-warning/10 rounded-lg p-4 border border-warning">
            <Text className="text-xs font-semibold text-warning mb-2">
              GAMIFICAÇÃO
            </Text>
            <Text className="text-xs text-muted">
              TODO: Implementar badges, achievements e sistema de rewards
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
