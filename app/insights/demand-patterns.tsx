/**
 * PADRÕES DE DEMANDA
 * Análise de horários, dias e regiões com maior demanda
 * TODO: Integrar com Gemini IA para insights automáticos\n * TODO: Implementar mapa de calor com regiões de demanda\n */

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

interface DemandPattern {
  hour: number;
  demand: number;
  avgEarnings: number;
}

interface RegionDemand {
  name: string;
  demand: number;
  avgEarnings: number;
  trend: "up" | "down" | "stable";
}

export default function DemandPatternsScreen() {
  const [selectedDay, setSelectedDay] = useState<string>("segunda");

  // ========================================================================
  // DADOS MOCKADOS (TODO: Integrar com backend)
  // ========================================================================

  const hourlyDemand: DemandPattern[] = [
    { hour: 6, demand: 20, avgEarnings: 35 },
    { hour: 7, demand: 45, avgEarnings: 55 },
    { hour: 8, demand: 60, avgEarnings: 65 },
    { hour: 9, demand: 40, avgEarnings: 50 },
    { hour: 12, demand: 35, avgEarnings: 45 },
    { hour: 14, demand: 50, avgEarnings: 60 },
    { hour: 17, demand: 75, avgEarnings: 80 },
    { hour: 18, demand: 90, avgEarnings: 95 },
    { hour: 19, demand: 85, avgEarnings: 90 },
    { hour: 20, demand: 70, avgEarnings: 75 },
    { hour: 22, demand: 40, avgEarnings: 50 },
  ];

  const regionDemand: RegionDemand[] = [
    { name: "Centro", demand: 95, avgEarnings: 85, trend: "up" },
    { name: "Zona Sul", demand: 80, avgEarnings: 75, trend: "stable" },
    { name: "Zona Norte", demand: 60, avgEarnings: 65, trend: "down" },
    { name: "Zona Leste", demand: 70, avgEarnings: 72, trend: "up" },
    { name: "Zona Oeste", demand: 50, avgEarnings: 55, trend: "stable" },
  ];

  const bestHours = hourlyDemand
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 3);

  const worstHours = hourlyDemand
    .sort((a, b) => a.demand - b.demand)
    .slice(0, 3);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-6 gap-6">
          {/* HEADER */}
          <View>
            <Text className="text-3xl font-bold text-foreground">
              Padrões de Demanda
            </Text>
            <Text className="text-sm text-muted mt-1">
              Descubra os melhores horários e regiões
            </Text>
          </View>

          {/* BEST HOURS */}
          <View className="bg-success/10 rounded-lg p-4 border border-success">
            <Text className="text-sm font-semibold text-success mb-3">
              ✅ MELHORES HORÁRIOS
            </Text>
            <View className="gap-2">
              {bestHours.map((hour) => (
                <View key={hour.hour} className="flex-row justify-between">
                  <Text className="text-sm text-foreground">
                    {String(hour.hour).padStart(2, "0")}:00 - {String(hour.hour + 1).padStart(2, "0")}:00
                  </Text>
                  <View className="flex-row gap-4">
                    <Text className="text-sm font-semibold text-success">
                      {hour.demand}% demanda
                    </Text>
                    <Text className="text-sm font-semibold text-primary">
                      R$ {hour.avgEarnings}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* WORST HOURS */}
          <View className="bg-error/10 rounded-lg p-4 border border-error">
            <Text className="text-sm font-semibold text-error mb-3">
              ❌ PIORES HORÁRIOS
            </Text>
            <View className="gap-2">
              {worstHours.map((hour) => (
                <View key={hour.hour} className="flex-row justify-between">
                  <Text className="text-sm text-foreground">
                    {String(hour.hour).padStart(2, "0")}:00 - {String(hour.hour + 1).padStart(2, "0")}:00
                  </Text>
                  <View className="flex-row gap-4">
                    <Text className="text-sm font-semibold text-error">
                      {hour.demand}% demanda
                    </Text>
                    <Text className="text-sm font-semibold text-muted">
                      R$ {hour.avgEarnings}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* REGIONS */}
          <View className="bg-surface rounded-lg p-4">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Demanda por Região
            </Text>
            <View className="gap-3">
              {regionDemand.map((region) => (
                <View key={region.name} className="gap-2">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-semibold text-foreground">
                      {region.name}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xs text-muted">
                        {region.trend === "up"
                          ? "📈"
                          : region.trend === "down"
                          ? "📉"
                          : "➡️"}
                      </Text>
                      <Text className="text-sm font-semibold text-primary">
                        R$ {region.avgEarnings}
                      </Text>
                    </View>
                  </View>
                  <View className="w-full bg-border rounded-full h-2">
                    <View
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${region.demand}%` }}
                    />
                  </View>
                  <Text className="text-xs text-muted">{region.demand}% demanda</Text>
                </View>
              ))}
            </View>
          </View>

          {/* AI INSIGHTS */}
          <View className="bg-primary/10 rounded-lg p-4 border border-primary">
            <Text className="text-sm font-semibold text-primary mb-3">
              🤖 INSIGHTS IA
            </Text>
            <View className="gap-2">
              <Text className="text-sm text-foreground">
                • Sextas e sábados têm 40% mais demanda
              </Text>
              <Text className="text-sm text-foreground">
                • Horário de pico: 17h-20h (R$ 80-95 por corrida)
              </Text>
              <Text className="text-sm text-foreground">
                • Centro é a região mais lucrativa (R$ 85/corrida)
              </Text>
              <Text className="text-sm text-foreground">
                • Evite 11h-13h (demanda baixa, ganhos reduzidos)
              </Text>
            </View>
          </View>

          {/* TODO: HEATMAP */}
          <View className="bg-warning/10 rounded-lg p-4 border border-warning">
            <Text className="text-xs font-semibold text-warning mb-2">
              🗺️ MAPA DE CALOR
            </Text>
            <Text className="text-xs text-muted">
              TODO: Implementar mapa interativo mostrando regiões de demanda em
              tempo real
            </Text>
          </View>

          {/* TODO: GEMINI IA */}
          <View className="bg-warning/10 rounded-lg p-4 border border-warning">
            <Text className="text-xs font-semibold text-warning mb-2">
              🧠 ANÁLISE COM GEMINI IA
            </Text>
            <Text className="text-xs text-muted">
              TODO: Integrar com Gemini para gerar insights automáticos baseado
              em dados históricos e eventos da cidade
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
