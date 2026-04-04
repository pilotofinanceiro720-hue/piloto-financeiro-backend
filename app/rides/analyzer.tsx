/**
 * ANALISADOR DE CORRIDA
 * Calcula lucro real considerando combustível, desgaste, impostos
 * TODO: Implementar overlay Android nativo
 * TODO: Integrar com notificação de corrida em tempo real
 */

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

interface RideAnalysis {
  grossValue: number;
  fuelCost: number;
  wearCost: number;
  taxesCost: number;
  netValue: number;
  profitMargin: number;
  efficiency: "Excelente" | "Boa" | "Média" | "Baixa";
  recommendation: string;
}

export default function RideAnalyzerScreen() {
  const [grossValue, setGrossValue] = useState<number>(50);
  const [distanceKm, setDistanceKm] = useState<number>(15);
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [fuelPrice, setFuelPrice] = useState<number>(6.5);
  const [fuelConsumption, setFuelConsumption] = useState<number>(10); // km/litro

  // ========================================================================
  // CÁLCULOS
  // ========================================================================

  const calculateAnalysis = (): RideAnalysis => {
    // Combustível gasto
    const litersUsed = distanceKm / fuelConsumption;
    const fuelCost = litersUsed * fuelPrice;

    // Desgaste do veículo (R$ 0.50 por km - pneu, óleo, manutenção)
    const wearCost = distanceKm * 0.5;

    // Impostos e taxas (5% do valor bruto)
    const taxesCost = grossValue * 0.05;

    // Lucro líquido
    const netValue = grossValue - fuelCost - wearCost - taxesCost;

    // Margem de lucro
    const profitMargin = (netValue / grossValue) * 100;

    // Eficiência
    let efficiency: "Excelente" | "Boa" | "Média" | "Baixa";
    if (profitMargin >= 60) efficiency = "Excelente";
    else if (profitMargin >= 45) efficiency = "Boa";
    else if (profitMargin >= 30) efficiency = "Média";
    else efficiency = "Baixa";

    // Recomendação
    let recommendation = "";
    if (efficiency === "Excelente")
      recommendation = "Corrida muito lucrativa! Padrão a buscar.";
    else if (efficiency === "Boa")
      recommendation = "Corrida rentável. Continuar neste padrão.";
    else if (efficiency === "Média")
      recommendation = "Corrida aceitável. Considere rejeitar corridas menores.";
    else
      recommendation = "Corrida pouco lucrativa. Rejeitar no futuro.";

    return {
      grossValue,
      fuelCost,
      wearCost,
      taxesCost,
      netValue,
      profitMargin,
      efficiency,
      recommendation,
    };
  };

  const analysis = calculateAnalysis();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-6 gap-6">
          {/* HEADER */}
          <View>
            <Text className="text-3xl font-bold text-foreground">
              Analisador de Corrida
            </Text>
            <Text className="text-sm text-muted mt-1">
              Calcule o lucro real de cada corrida
            </Text>
          </View>

          {/* INPUTS */}
          <View className="bg-surface rounded-lg p-4 gap-4">
            <View>
              <Text className="text-sm text-muted mb-2">Valor Bruto (R$)</Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-3xl font-bold text-primary">
                  {grossValue.toFixed(2)}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setGrossValue(Math.max(0, grossValue - 5))
                  }
                  className="px-3 py-2 bg-border rounded"
                >
                  <Text className="text-foreground">−</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGrossValue(grossValue + 5)}
                  className="px-3 py-2 bg-primary rounded"
                >
                  <Text className="text-white">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="h-px bg-border" />

            <View>
              <Text className="text-sm text-muted mb-2">Distância (km)</Text>
              <Text className="text-2xl font-semibold text-foreground">
                {distanceKm}
              </Text>
            </View>

            <View>
              <Text className="text-sm text-muted mb-2">Duração (min)</Text>
              <Text className="text-2xl font-semibold text-foreground">
                {durationMinutes}
              </Text>
            </View>
          </View>

          {/* BREAKDOWN */}
          <View className="bg-surface rounded-lg p-4 gap-3">
            <Text className="text-lg font-semibold text-foreground mb-2">
              Detalhamento
            </Text>

            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Valor Bruto</Text>
              <Text className="text-sm font-semibold text-foreground">
                R$ {analysis.grossValue.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Combustível</Text>
              <Text className="text-sm font-semibold text-error">
                − R$ {analysis.fuelCost.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Desgaste do Veículo</Text>
              <Text className="text-sm font-semibold text-error">
                − R$ {analysis.wearCost.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Impostos e Taxas</Text>
              <Text className="text-sm font-semibold text-error">
                − R$ {analysis.taxesCost.toFixed(2)}
              </Text>
            </View>

            <View className="h-px bg-border my-2" />

            <View className="flex-row justify-between">
              <Text className="text-base font-semibold text-foreground">
                Lucro Líquido
              </Text>
              <Text className="text-base font-bold text-success">
                R$ {analysis.netValue.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* EFFICIENCY BADGE */}
          <View
            className={`rounded-lg p-4 border-2 ${
              analysis.efficiency === "Excelente"
                ? "bg-success/10 border-success"
                : analysis.efficiency === "Boa"
                ? "bg-primary/10 border-primary"
                : analysis.efficiency === "Média"
                ? "bg-warning/10 border-warning"
                : "bg-error/10 border-error"
            }`}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-semibold text-muted">
                Eficiência
              </Text>
              <Text
                className={`text-lg font-bold ${
                  analysis.efficiency === "Excelente"
                    ? "text-success"
                    : analysis.efficiency === "Boa"
                    ? "text-primary"
                    : analysis.efficiency === "Média"
                    ? "text-warning"
                    : "text-error"
                }`}
              >
                {analysis.efficiency}
              </Text>
            </View>

            <View className="w-full bg-border rounded-full h-2 mb-3">
              <View
                className={`h-2 rounded-full ${
                  analysis.efficiency === "Excelente"
                    ? "bg-success"
                    : analysis.efficiency === "Boa"
                    ? "bg-primary"
                    : analysis.efficiency === "Média"
                    ? "bg-warning"
                    : "bg-error"
                }`}
                style={{ width: `${Math.min(analysis.profitMargin, 100)}%` }}
              />
            </View>

            <Text className="text-sm text-foreground font-semibold mb-1">
              {analysis.profitMargin.toFixed(1)}% de margem de lucro
            </Text>
            <Text className="text-xs text-muted">{analysis.recommendation}</Text>
          </View>

          {/* METRICS */}
          <View className="grid grid-cols-2 gap-3">
            <View className="bg-surface rounded-lg p-3 items-center">
              <Text className="text-xs text-muted mb-1">R$/km</Text>
              <Text className="text-xl font-bold text-foreground">
                {(analysis.netValue / distanceKm).toFixed(2)}
              </Text>
            </View>

            <View className="bg-surface rounded-lg p-3 items-center">
              <Text className="text-xs text-muted mb-1">R$/hora</Text>
              <Text className="text-xl font-bold text-foreground">
                {(analysis.netValue / (durationMinutes / 60)).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* TODO: OVERLAY ANDROID */}
          <View className="bg-warning/10 rounded-lg p-4 border border-warning">
            <Text className="text-xs font-semibold text-warning mb-2">
              📱 OVERLAY ANDROID
            </Text>
            <Text className="text-xs text-muted">
              TODO: Implementar overlay flutuante que mostra análise em tempo
              real durante a corrida
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
