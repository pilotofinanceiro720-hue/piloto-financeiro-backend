import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { calculateRideProfit, type RideData, type VehicleData } from "@/lib/services/profit-calculator";

// Mock data - será substituído por dados reais
const mockRideData: RideData = {
  distance: 12.5,
  duration: 35,
  grossRevenue: 45.80,
  tips: 5.00,
  tolls: 3.50,
};

const mockVehicleData: VehicleData = {
  fuelConsumption: 10, // km/l
  maintenanceCostPerKm: 0.35,
  wearCoefficient: 1.0,
  fuelPrice: 5.89,
};

export default function RideSummaryScreen() {
  const colors = useColors();
  const [showDetails, setShowDetails] = useState(false);

  const profit = calculateRideProfit(mockRideData, mockVehicleData);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-4">
          <Text className="text-2xl font-bold text-foreground">Resumo da Corrida</Text>
          <Text className="text-sm text-muted mt-1">Análise detalhada de custos e lucro</Text>
        </View>

        {/* Card Principal - Lucro */}
        <View className="mx-4 mb-4 bg-gradient-to-br from-success to-success/80 rounded-3xl p-6 shadow-lg">
          <Text className="text-white/80 text-sm font-medium mb-2">Lucro Líquido</Text>
          <Text className="text-white text-5xl font-bold mb-1">
            R$ {profit.netProfit.toFixed(2)}
          </Text>
          <View className="flex-row items-center gap-2 mt-2">
            <View className="bg-white/20 px-2 py-1 rounded">
              <Text className="text-white text-xs font-bold">{profit.profitMargin.toFixed(1)}%</Text>
            </View>
            <Text className="text-white/70 text-xs">de margem de lucro</Text>
          </View>
        </View>

        {/* Resumo Rápido */}
        <View className="px-4 mb-4">
          <View className="grid grid-cols-2 gap-3">
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs mb-1">Distância</Text>
              <Text className="text-foreground text-xl font-bold">{mockRideData.distance} km</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs mb-1">Duração</Text>
              <Text className="text-foreground text-xl font-bold">{mockRideData.duration} min</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs mb-1">Receita/km</Text>
              <Text className="text-primary text-xl font-bold">R$ {profit.revenuePerKm.toFixed(2)}</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs mb-1">Custo/km</Text>
              <Text className="text-error text-xl font-bold">R$ {profit.costPerKm.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Receita */}
        <View className="px-4 mb-4">
          <Text className="text-base font-bold text-foreground mb-3">Receita</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border space-y-3">
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="car" size={18} color={colors.primary} />
                <Text className="text-sm text-foreground">Corrida</Text>
              </View>
              <Text className="text-base font-bold text-foreground">R$ {mockRideData.grossRevenue.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="star.fill" size={18} color={colors.success} />
                <Text className="text-sm text-foreground">Gorjetas</Text>
              </View>
              <Text className="text-base font-bold text-success">R$ {mockRideData.tips.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between pt-3 border-t border-border">
              <Text className="text-sm font-semibold text-foreground">Total</Text>
              <Text className="text-lg font-bold text-primary">R$ {profit.totalIncome.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Despesas */}
        <View className="px-4 mb-4">
          <Text className="text-base font-bold text-foreground mb-3">Despesas</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border space-y-3">
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="car" size={18} color={colors.error} />
                <View>
                  <Text className="text-sm text-foreground">Combustível</Text>
                  <Text className="text-xs text-muted">{(mockRideData.distance / mockVehicleData.fuelConsumption).toFixed(2)}L</Text>
                </View>
              </View>
              <Text className="text-base font-bold text-error">R$ {profit.fuelCost.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="gear" size={18} color={colors.warning} />
                <View>
                  <Text className="text-sm text-foreground">Manutenção</Text>
                  <Text className="text-xs text-muted">Desgaste + manutenção</Text>
                </View>
              </View>
              <Text className="text-base font-bold text-warning">R$ {profit.maintenanceCost.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="map" size={18} color={colors.muted} />
                <Text className="text-sm text-foreground">Pedágios</Text>
              </View>
              <Text className="text-base font-bold text-foreground">R$ {mockRideData.tolls.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between pt-3 border-t border-border">
              <Text className="text-sm font-semibold text-foreground">Total</Text>
              <Text className="text-lg font-bold text-error">R$ {profit.totalExpenses.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Análise Detalhada */}
        <TouchableOpacity
          onPress={() => setShowDetails(!showDetails)}
          className="mx-4 mb-4 bg-surface rounded-2xl p-4 border border-border active:opacity-70"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-foreground">Análise Detalhada</Text>
            <IconSymbol
              name="chevron.right"
              size={20}
              color={colors.muted}
              style={{ transform: [{ rotate: showDetails ? "90deg" : "0deg" }] }}
            />
          </View>
        </TouchableOpacity>

        {showDetails && (
          <View className="px-4 mb-4 bg-surface rounded-2xl p-4 border border-border space-y-3">
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <Text className="text-sm text-muted">Receita por km</Text>
              <Text className="text-base font-bold text-primary">R$ {profit.revenuePerKm.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <Text className="text-sm text-muted">Receita por hora</Text>
              <Text className="text-base font-bold text-primary">R$ {profit.revenuePerHour.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <Text className="text-sm text-muted">Custo por km</Text>
              <Text className="text-base font-bold text-error">R$ {profit.costPerKm.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted">Custo por hora</Text>
              <Text className="text-base font-bold text-error">R$ {profit.costPerHour.toFixed(2)}</Text>
            </View>
          </View>
        )}

        {/* Botões de Ação */}
        <View className="px-4 pb-8 gap-3">
          <TouchableOpacity
            className="bg-primary rounded-full py-4 shadow-md active:opacity-80"
            onPress={() => console.log("Salvar corrida")}
          >
            <Text className="text-white text-center text-lg font-bold">Salvar Corrida</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-surface border border-border rounded-full py-4 active:opacity-70"
            onPress={() => console.log("Voltar ao dashboard")}
          >
            <Text className="text-foreground text-center text-lg font-bold">Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
