/**
 * Tela Unificada de Comissões
 * Exibe comissões, planos e funcionalidades disponíveis
 */

import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";

type PlanType = "basic" | "top" | "premium";
type BillingPeriod = "monthly" | "semestral" | "annual";

interface Plan {
  id: PlanType;
  name: string;
  description: string;
  monthlyPrice: number;
  semestraPrice: number;
  annualPrice: number;
  commissionRate: number;
  features: string[];
  badge?: string;
}

const PLANS: Record<PlanType, Plan> = {
  basic: {
    id: "basic",
    name: "Básico",
    description: "Perfeito para começar",
    monthlyPrice: 9.90,
    semestraPrice: 49.50,
    annualPrice: 82.50,
    commissionRate: 20,
    features: [
      "Comissão 20%",
      "Limite R$ 5.000/mês",
      "Saque 2x por mês",
      "Lista de desejos",
      "Suporte por email",
    ],
  },
  top: {
    id: "top",
    name: "Top",
    description: "Para profissionais",
    monthlyPrice: 19.90,
    semestraPrice: 99.50,
    annualPrice: 165.90,
    commissionRate: 25,
    features: [
      "Comissão 25%",
      "Limite R$ 15.000/mês",
      "Saque 2x por semana",
      "IA para ofertas",
      "Analytics avançado",
      "Suporte prioritário",
      "Badges e leaderboard",
    ],
    badge: "Popular",
  },
  premium: {
    id: "premium",
    name: "Premium",
    description: "Máximo de funcionalidades",
    monthlyPrice: 29.90,
    semestraPrice: 149.50,
    annualPrice: 248.90,
    commissionRate: 30,
    features: [
      "Comissão 30%",
      "Limite R$ 50.000/mês",
      "Saque ilimitado",
      "IA para ofertas",
      "Analytics completo",
      "Gerente dedicado",
      "Saque instantâneo",
      "Relatórios personalizados",
    ],
    badge: "Recomendado",
  },
};

export default function UnifiedCommissionsScreen() {
  const colors = useColors();
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>("monthly");
  const [currentPlan, setCurrentPlan] = useState<PlanType>("basic");

  const getPriceForPeriod = (plan: Plan): number => {
    switch (selectedPeriod) {
      case "monthly":
        return plan.monthlyPrice;
      case "semestral":
        return plan.semestraPrice;
      case "annual":
        return plan.annualPrice;
    }
  };

  const getPeriodLabel = (): string => {
    switch (selectedPeriod) {
      case "monthly":
        return "/mês";
      case "semestral":
        return "/6 meses";
      case "annual":
        return "/ano";
    }
  };

  const getDiscountPercentage = (period: BillingPeriod): number => {
    switch (period) {
      case "monthly":
        return 0;
      case "semestral":
        return 17;
      case "annual":
        return 33;
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="bg-blue-600 p-6 pb-8">
          <Text className="text-white text-3xl font-bold mb-2">Comissões</Text>
          <Text className="text-blue-100">Escolha seu plano e maximize seus ganhos</Text>
        </View>

        {/* Período de Faturamento */}
        <View className="px-4 py-4">
          <Text className="text-gray-800 font-semibold mb-3">Período de Faturamento</Text>
          <View className="flex-row gap-2">
            {(["monthly", "semestral", "annual"] as const).map((period) => (
              <Pressable
                key={period}
                onPress={() => setSelectedPeriod(period)}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor: selectedPeriod === period ? colors.primary : colors.surface,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  className={`text-center font-semibold ${
                    selectedPeriod === period ? "text-white" : "text-gray-700"
                  }`}
                >
                  {period === "monthly" ? "Mensal" : period === "semestral" ? "Semestral" : "Anual"}
                </Text>
                {getDiscountPercentage(period) > 0 && (
                  <Text
                    className={`text-center text-xs mt-1 ${
                      selectedPeriod === period ? "text-blue-100" : "text-green-600"
                    }`}
                  >
                    -{getDiscountPercentage(period)}%
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Planos */}
        <View className="px-4 py-4 gap-4">
          {(Object.values(PLANS) as Plan[]).map((plan) => (
            <View
              key={plan.id}
              className={`rounded-lg border-2 overflow-hidden ${
                currentPlan === plan.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <View className="bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1">
                  <Text className="text-white text-xs font-bold text-center">{plan.badge}</Text>
                </View>
              )}

              {/* Cabeçalho do Plano */}
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900">{plan.name}</Text>
                    <Text className="text-sm text-gray-600">{plan.description}</Text>
                  </View>
                  <View className="bg-blue-100 px-3 py-1 rounded">
                    <Text className="text-blue-700 font-bold text-sm">{plan.commissionRate}%</Text>
                  </View>
                </View>

                {/* Preço */}
                <View className="mb-4">
                  <Text className="text-3xl font-bold text-gray-900">
                    R$ {getPriceForPeriod(plan).toFixed(2)}
                  </Text>
                  <Text className="text-gray-600 text-sm">{getPeriodLabel()}</Text>
                </View>

                {/* Botão de Ação */}
                <Pressable
                  onPress={() => setCurrentPlan(plan.id)}
                  style={({ pressed }) => [
                    {
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                      backgroundColor:
                        currentPlan === plan.id ? "#0284c7" : "#e5e7eb",
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    className={`text-center font-semibold ${
                      currentPlan === plan.id ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {currentPlan === plan.id ? "Plano Atual" : "Selecionar"}
                  </Text>
                </Pressable>
              </View>

              {/* Funcionalidades */}
              <View className="border-t border-gray-200 p-4 bg-gray-50">
                {plan.features.map((feature, index) => (
                  <View key={index} className="flex-row items-center mb-2">
                    <Text className="text-green-600 font-bold mr-2">✓</Text>
                    <Text className="text-gray-700 text-sm flex-1">{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Resumo de Comissões */}
        <View className="mx-4 my-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <Text className="font-bold text-gray-900 mb-3">Seu Resumo de Comissões</Text>

          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Comissões Pendentes:</Text>
              <Text className="font-bold text-gray-900">R$ 2.450,00</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Comissões Aprovadas:</Text>
              <Text className="font-bold text-green-600">R$ 8.920,00</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Comissões Pagas:</Text>
              <Text className="font-bold text-blue-600">R$ 15.340,00</Text>
            </View>
            <View className="border-t border-blue-200 pt-2 mt-2 flex-row justify-between">
              <Text className="text-gray-900 font-bold">Total Ganho:</Text>
              <Text className="font-bold text-lg text-blue-600">R$ 26.710,00</Text>
            </View>
          </View>
        </View>

        {/* Comparação de Planos */}
        <View className="mx-4 my-4">
          <Text className="font-bold text-gray-900 mb-3">Comparação de Planos</Text>
          <View className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <View className="flex-row border-b border-gray-200">
              <View className="flex-1 p-3 bg-gray-50">
                <Text className="text-xs font-bold text-gray-600">Recurso</Text>
              </View>
              <View className="flex-1 p-3 border-l border-gray-200">
                <Text className="text-xs font-bold text-gray-600 text-center">Básico</Text>
              </View>
              <View className="flex-1 p-3 border-l border-gray-200">
                <Text className="text-xs font-bold text-gray-600 text-center">Top</Text>
              </View>
              <View className="flex-1 p-3 border-l border-gray-200">
                <Text className="text-xs font-bold text-gray-600 text-center">Premium</Text>
              </View>
            </View>

            {[
              { label: "Comissão", values: ["20%", "25%", "30%"] },
              { label: "Limite/mês", values: ["R$5k", "R$15k", "R$50k"] },
              { label: "Saques/mês", values: ["2x", "8x", "∞"] },
              { label: "IA", values: ["✗", "✓", "✓"] },
            ].map((row, idx) => (
              <View key={idx} className="flex-row border-t border-gray-200">
                <View className="flex-1 p-3 bg-gray-50">
                  <Text className="text-xs text-gray-700">{row.label}</Text>
                </View>
                {row.values.map((value, vidx) => (
                  <View key={vidx} className="flex-1 p-3 border-l border-gray-200">
                    <Text className="text-xs text-gray-900 text-center font-semibold">{value}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Botão de Upgrade */}
        {currentPlan !== "premium" && (
          <View className="mx-4 my-4 mb-6">
            <Pressable
              style={({ pressed }) => [
                {
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: "#0284c7",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-white text-center font-bold">Fazer Upgrade Agora</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
