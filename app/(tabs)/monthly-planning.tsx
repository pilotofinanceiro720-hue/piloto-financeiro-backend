import { Text, View, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function MonthlyPlanningScreen() {
  const colors = useColors();
  const [monthlyGoal, setMonthlyGoal] = useState("5000");
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - será substituído por dados reais
  const currentMonth = "Fevereiro 2026";
  const daysWorked = 12;
  const daysInMonth = 28;
  const daysRemaining = daysInMonth - daysWorked;

  const currentEarnings = 3850.50; // lucro líquido até agora
  const targetEarnings = 5000;
  const progressPercentage = (currentEarnings / targetEarnings) * 100;

  const averageDailyProfit = currentEarnings / daysWorked;
  const requiredDailyProfit = (targetEarnings - currentEarnings) / daysRemaining;
  const projectedMonthlyProfit = currentEarnings + (requiredDailyProfit * daysRemaining);

  const isOnTrack = averageDailyProfit >= requiredDailyProfit;

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-4">
          <Text className="text-2xl font-bold text-foreground">Planejamento Mensal</Text>
          <Text className="text-sm text-muted mt-1">{currentMonth}</Text>
        </View>

        {/* Meta Mensal */}
        <View className="mx-4 mb-4 bg-surface rounded-2xl p-4 border border-border">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-foreground">Meta Mensal</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <IconSymbol name="gear" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View className="gap-3">
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground text-lg font-bold"
                placeholder="0.00"
                placeholderTextColor={colors.muted}
                value={monthlyGoal}
                onChangeText={setMonthlyGoal}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                className="bg-primary rounded-full py-2"
              >
                <Text className="text-white text-center text-sm font-bold">Salvar Meta</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text className="text-4xl font-bold text-primary">R$ {monthlyGoal}</Text>
          )}
        </View>

        {/* Progresso */}
        <View className="mx-4 mb-4">
          <View className="bg-surface rounded-2xl p-4 border border-border mb-3">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-semibold text-foreground">Progresso</Text>
              <Text className="text-sm font-bold text-primary">{progressPercentage.toFixed(1)}%</Text>
            </View>
            <View className="w-full h-3 bg-background rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </View>
            <View className="flex-row items-center justify-between mt-3">
              <Text className="text-xs text-muted">Ganho até agora</Text>
              <Text className="text-sm font-bold text-foreground">R$ {currentEarnings.toFixed(2)}</Text>
            </View>
          </View>

          {/* Status */}
          <View
            className={`rounded-2xl p-4 border ${
              isOnTrack
                ? "bg-success/10 border-success/20"
                : "bg-warning/10 border-warning/20"
            }`}
          >
            <View className="flex-row items-center gap-2 mb-2">
              <IconSymbol
                name={isOnTrack ? "star.fill" : "paperplane.fill"}
                size={18}
                color={isOnTrack ? colors.success : colors.warning}
              />
              <Text
                className={`text-sm font-bold ${
                  isOnTrack ? "text-success" : "text-warning"
                }`}
              >
                {isOnTrack ? "Você está no caminho certo!" : "Precisa acelerar o ritmo"}
              </Text>
            </View>
            <Text className="text-xs text-muted">
              {isOnTrack
                ? `Sua média diária (R$ ${averageDailyProfit.toFixed(2)}) está acima da necessária`
                : `Você precisa ganhar R$ ${requiredDailyProfit.toFixed(2)}/dia para atingir a meta`
              }
            </Text>
          </View>
        </View>

        {/* Métricas */}
        <View className="px-4 mb-4">
          <Text className="text-base font-bold text-foreground mb-3">Métricas</Text>
          <View className="gap-3">
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-muted">Dias Trabalhados</Text>
                <Text className="text-base font-bold text-foreground">{daysWorked} de {daysInMonth}</Text>
              </View>
              <View className="w-full h-2 bg-background rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(daysWorked / daysInMonth) * 100}%` }}
                />
              </View>
            </View>

            <View className="grid grid-cols-2 gap-3">
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-xs text-muted mb-2">Média Diária</Text>
                <Text className="text-xl font-bold text-primary">
                  R$ {averageDailyProfit.toFixed(2)}
                </Text>
              </View>
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-xs text-muted mb-2">Necessário/dia</Text>
                <Text className={`text-xl font-bold ${isOnTrack ? "text-success" : "text-warning"}`}>
                  R$ {requiredDailyProfit.toFixed(2)}
                </Text>
              </View>
            </View>

            <View className="grid grid-cols-2 gap-3">
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-xs text-muted mb-2">Dias Restantes</Text>
                <Text className="text-xl font-bold text-foreground">{daysRemaining}</Text>
              </View>
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-xs text-muted mb-2">Falta para Meta</Text>
                <Text className="text-xl font-bold text-error">
                  R$ {Math.max(0, targetEarnings - currentEarnings).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Projeção */}
        <View className="px-4 mb-4">
          <Text className="text-base font-bold text-foreground mb-3">Projeção</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border space-y-3">
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <Text className="text-sm text-foreground">Ganho Atual</Text>
              <Text className="text-base font-bold text-foreground">R$ {currentEarnings.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <Text className="text-sm text-foreground">Projeção (ritmo atual)</Text>
              <Text className={`text-base font-bold ${projectedMonthlyProfit >= targetEarnings ? "text-success" : "text-warning"}`}>
                R$ {projectedMonthlyProfit.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-foreground">Diferença da Meta</Text>
              <Text className={`text-base font-bold ${projectedMonthlyProfit >= targetEarnings ? "text-success" : "text-error"}`}>
                {projectedMonthlyProfit >= targetEarnings ? "+" : ""}R$ {(projectedMonthlyProfit - targetEarnings).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Dicas */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Dicas para Atingir a Meta</Text>
          <View className="gap-2">
            <View className="bg-primary/10 rounded-2xl p-4 border border-primary/20 flex-row items-start gap-3">
              <IconSymbol name="star.fill" size={18} color={colors.primary} />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-primary">Aumente o tempo de trabalho</Text>
                <Text className="text-xs text-muted mt-1">Trabalhe mais dias ou horas para aumentar a receita</Text>
              </View>
            </View>
            <View className="bg-primary/10 rounded-2xl p-4 border border-primary/20 flex-row items-start gap-3">
              <IconSymbol name="map" size={18} color={colors.primary} />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-primary">Foque em corridas longas</Text>
                <Text className="text-xs text-muted mt-1">Corridas de maior distância geram mais lucro</Text>
              </View>
            </View>
            <View className="bg-primary/10 rounded-2xl p-4 border border-primary/20 flex-row items-start gap-3">
              <IconSymbol name="car" size={18} color={colors.primary} />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-primary">Reduza despesas</Text>
                <Text className="text-xs text-muted mt-1">Verifique o marketplace para economizar em combustível</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
