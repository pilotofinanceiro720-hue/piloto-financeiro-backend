import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function DailyClosingScreen() {
  const colors = useColors();
  const [isClosing, setIsClosing] = useState(false);

  // Mock data - será substituído por dados reais
  const dailyData = {
    date: "15 de fevereiro de 2026",
    ridesCount: 12,
    totalDistance: 156.8,
    totalDuration: 420, // minutos
    grossRevenue: 485.50,
    tips: 45.00,
    fuelCost: 92.45,
    maintenanceCost: 54.88,
    tollsCost: 8.50,
  };

  const totalIncome = dailyData.grossRevenue + dailyData.tips;
  const totalExpenses = dailyData.fuelCost + dailyData.maintenanceCost + dailyData.tollsCost;
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = (netProfit / totalIncome) * 100;

  const handleCloseDay = () => {
    setIsClosing(true);
    // TODO: Salvar fechamento do dia no backend
    setTimeout(() => {
      setIsClosing(false);
      console.log("Dia encerrado com sucesso");
    }, 1500);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-4">
          <Text className="text-2xl font-bold text-foreground">Fechamento do Dia</Text>
          <Text className="text-sm text-muted mt-1">{dailyData.date}</Text>
        </View>

        {/* Card Principal */}
        <View className="mx-4 mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 shadow-lg">
          <Text className="text-white/80 text-sm font-medium mb-2">Lucro do Dia</Text>
          <Text className="text-white text-5xl font-bold mb-1">
            R$ {netProfit.toFixed(2)}
          </Text>
          <View className="flex-row items-center gap-2 mt-3">
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">{profitMargin.toFixed(1)}%</Text>
            </View>
            <Text className="text-white/70 text-xs">{dailyData.ridesCount} corridas • {dailyData.totalDistance.toFixed(1)} km</Text>
          </View>
        </View>

        {/* Resumo Rápido */}
        <View className="px-4 mb-4">
          <Text className="text-base font-bold text-foreground mb-3">Resumo</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border space-y-3">
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="car" size={18} color={colors.primary} />
                <Text className="text-sm text-foreground">Corridas</Text>
              </View>
              <Text className="text-base font-bold text-foreground">{dailyData.ridesCount}</Text>
            </View>
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="map" size={18} color={colors.primary} />
                <Text className="text-sm text-foreground">Distância</Text>
              </View>
              <Text className="text-base font-bold text-foreground">{dailyData.totalDistance.toFixed(1)} km</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="calendar" size={18} color={colors.primary} />
                <Text className="text-sm text-foreground">Duração</Text>
              </View>
              <Text className="text-base font-bold text-foreground">{Math.floor(dailyData.totalDuration / 60)}h {dailyData.totalDuration % 60}m</Text>
            </View>
          </View>
        </View>

        {/* Receita */}
        <View className="px-4 mb-4">
          <Text className="text-base font-bold text-foreground mb-3">Receita</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border space-y-3">
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <Text className="text-sm text-foreground">Receita de Corridas</Text>
              <Text className="text-base font-bold text-foreground">R$ {dailyData.grossRevenue.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-foreground">Gorjetas</Text>
              <Text className="text-base font-bold text-success">R$ {dailyData.tips.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between pt-3 border-t border-border">
              <Text className="text-sm font-semibold text-foreground">Total de Receita</Text>
              <Text className="text-lg font-bold text-primary">R$ {totalIncome.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Despesas */}
        <View className="px-4 mb-4">
          <Text className="text-base font-bold text-foreground mb-3">Despesas</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border space-y-3">
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-error" />
                <Text className="text-sm text-foreground">Combustível</Text>
              </View>
              <Text className="text-base font-bold text-error">R$ {dailyData.fuelCost.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-warning" />
                <Text className="text-sm text-foreground">Manutenção</Text>
              </View>
              <Text className="text-base font-bold text-warning">R$ {dailyData.maintenanceCost.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-muted" />
                <Text className="text-sm text-foreground">Pedágios</Text>
              </View>
              <Text className="text-base font-bold text-foreground">R$ {dailyData.tollsCost.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between pt-3 border-t border-border">
              <Text className="text-sm font-semibold text-foreground">Total de Despesas</Text>
              <Text className="text-lg font-bold text-error">R$ {totalExpenses.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Indicadores */}
        <View className="px-4 mb-4">
          <Text className="text-base font-bold text-foreground mb-3">Indicadores</Text>
          <View className="grid grid-cols-2 gap-3">
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs mb-2">Receita/km</Text>
              <Text className="text-foreground text-xl font-bold">
                R$ {(totalIncome / dailyData.totalDistance).toFixed(2)}
              </Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs mb-2">Custo/km</Text>
              <Text className="text-foreground text-xl font-bold">
                R$ {(totalExpenses / dailyData.totalDistance).toFixed(2)}
              </Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs mb-2">Receita/hora</Text>
              <Text className="text-foreground text-xl font-bold">
                R$ {(totalIncome / (dailyData.totalDuration / 60)).toFixed(2)}
              </Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs mb-2">Custo/hora</Text>
              <Text className="text-foreground text-xl font-bold">
                R$ {(totalExpenses / (dailyData.totalDuration / 60)).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Aviso */}
        <View className="mx-4 mb-4 bg-warning/10 border border-warning/20 rounded-2xl p-4">
          <View className="flex-row items-start gap-3">
            <IconSymbol name="paperplane.fill" size={20} color={colors.warning} />
            <View className="flex-1">
              <Text className="text-sm font-bold text-warning">Dica</Text>
              <Text className="text-xs text-muted mt-1">
                Você ganhou R$ {netProfit.toFixed(2)} em lucro líquido hoje. Continue assim para atingir suas metas!
              </Text>
            </View>
          </View>
        </View>

        {/* Botões */}
        <View className="px-4 pb-8 gap-3">
          <TouchableOpacity
            onPress={handleCloseDay}
            disabled={isClosing}
            className={`rounded-full py-4 shadow-md active:opacity-80 ${
              isClosing ? "bg-primary/50" : "bg-primary"
            }`}
          >
            <Text className="text-white text-center text-lg font-bold">
              {isClosing ? "Encerrando..." : "Encerrar Dia"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-surface border border-border rounded-full py-4 active:opacity-70"
            onPress={() => console.log("Voltar")}
          >
            <Text className="text-foreground text-center text-lg font-bold">Continuar Trabalhando</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
