import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEarnings } from "@/hooks/use-earnings";
import { useAuth } from "@/lib/contexts/auth-context";
import { ScreenContainer } from "@/components/screen-container";

export default function HomeScreen() {
  const { user } = useAuth();
  const { data: earnings, isLoading, error } = useEarnings();

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text className="mt-4 text-foreground">Carregando dados...</Text>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer className="items-center justify-center px-6">
        <Text className="text-lg font-semibold text-error mb-2">Erro ao carregar dados</Text>
        <Text className="text-sm text-muted text-center">
          {error instanceof Error ? error.message : "Tente novamente mais tarde"}
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Rota do Lucro</Text>
            <Text className="text-sm text-muted">Ola, {user?.name || "Motorista"}!</Text>
          </View>

          {/* Today's Earnings Card */}
          <View className="bg-primary rounded-2xl p-6 gap-4">
            <Text className="text-sm font-semibold text-white opacity-90">Lucro Liquido Hoje</Text>
            <Text className="text-5xl font-bold text-white">R$ {earnings?.today.profit.toFixed(2)}</Text>
            <View className="flex-row gap-6 pt-4 border-t border-white border-opacity-20">
              <View className="flex-1">
                <Text className="text-xs text-white opacity-75">Corridas</Text>
                <Text className="text-xl font-semibold text-white">{earnings?.today.rides}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-white opacity-75">Receita</Text>
                <Text className="text-xl font-semibold text-white">R$ {earnings?.today.revenue.toFixed(2)}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-white opacity-75">Despesas</Text>
                <Text className="text-xl font-semibold text-white">R$ {earnings?.today.expenses.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Weekly & Monthly Stats */}
          <View className="flex-row gap-4">
            <View className="flex-1 bg-surface rounded-2xl p-4 gap-2">
              <Text className="text-xs text-muted font-semibold">Semana</Text>
              <Text className="text-2xl font-bold text-foreground">R$ {earnings?.week.profit.toFixed(2)}</Text>
              <Text className="text-xs text-muted">Lucro liquido</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 gap-2">
              <Text className="text-xs text-muted font-semibold">Mes</Text>
              <Text className="text-2xl font-bold text-foreground">R$ {earnings?.month.profit.toFixed(2)}</Text>
              <Text className="text-xs text-muted">Lucro liquido</Text>
            </View>
          </View>

          {/* Opportunities */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Oportunidades</Text>
            {earnings?.opportunities.map((opportunity) => (
              <TouchableOpacity
                key={opportunity.id}
                className="bg-surface rounded-xl p-4 flex-row items-center justify-between"
              >
                <View className="flex-1 gap-1">
                  <Text className="font-semibold text-foreground">{opportunity.location}</Text>
                  <Text className="text-sm text-muted">{opportunity.type}</Text>
                </View>
                <View className="items-end gap-1">
                  <Text className="font-bold text-primary">R$ {opportunity.estimatedEarnings.toFixed(2)}</Text>
                  <Text
                    className={`text-xs font-semibold ${
                      opportunity.demand === "high"
                        ? "text-success"
                        : opportunity.demand === "medium"
                          ? "text-warning"
                          : "text-muted"
                    }`}
                  >
                    {opportunity.demand === "high" ? "Alta" : opportunity.demand === "medium" ? "Media" : "Baixa"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
