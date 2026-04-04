import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Commission {
  id: string;
  referredName: string;
  plan: "monthly" | "semestral" | "annual";
  amount: number;
  status: "pending" | "approved" | "paid";
  date: string;
}

export default function CommissionsScreen() {
  const colors = useColors();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "paid">("pending");

  const stats = {
    totalPending: 1250.5,
    totalApproved: 450.0,
    totalPaid: 2890.75,
    pendingCount: 8,
    approvedCount: 3,
    paidCount: 15,
  };

  const commissions: Commission[] = [
    {
      id: "1",
      referredName: "João Silva",
      plan: "annual",
      amount: 89.97,
      status: "pending",
      date: "2026-02-15",
    },
    {
      id: "2",
      referredName: "Maria Santos",
      plan: "semestral",
      amount: 37.48,
      status: "pending",
      date: "2026-02-14",
    },
    {
      id: "3",
      referredName: "Pedro Costa",
      plan: "monthly",
      amount: 5.98,
      status: "approved",
      date: "2026-02-10",
    },
    {
      id: "4",
      referredName: "Ana Oliveira",
      plan: "annual",
      amount: 89.97,
      status: "paid",
      date: "2026-02-05",
    },
    {
      id: "5",
      referredName: "Carlos Mendes",
      plan: "semestral",
      amount: 37.48,
      status: "paid",
      date: "2026-01-28",
    },
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return colors.warning;
      case "approved":
        return colors.primary;
      case "paid":
        return colors.success;
      default:
        return colors.muted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "approved":
        return "Aprovada";
      case "paid":
        return "Paga";
      default:
        return status;
    }
  };

  const filteredCommissions = commissions.filter((c) => c.status === activeTab);

  if (isLoading) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-4">
          <Text className="text-2xl font-bold text-foreground">Minhas Comissões</Text>
          <Text className="text-sm text-muted mt-1">Acompanhe seus ganhos com referências</Text>
        </View>

        {/* Cards de Resumo */}
        <View className="px-4 mb-6">
          <View className="gap-3">
            {/* Total Pendente */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-12 h-12 rounded-full bg-warning/10 items-center justify-center">
                    <IconSymbol name="paperplane.fill" size={20} color={colors.warning} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Pendentes de Aprovação</Text>
                    <Text className="text-lg font-bold text-foreground mt-1">
                      R$ {stats.totalPending.toFixed(2)}
                    </Text>
                    <Text className="text-xs text-muted mt-1">{stats.pendingCount} indicações</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Total Aprovado */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                    <IconSymbol name="star.fill" size={20} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Aprovadas para Saque</Text>
                    <Text className="text-lg font-bold text-foreground mt-1">
                      R$ {stats.totalApproved.toFixed(2)}
                    </Text>
                    <Text className="text-xs text-muted mt-1">{stats.approvedCount} indicações</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Total Pago */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-12 h-12 rounded-full bg-success/10 items-center justify-center">
                    <IconSymbol name="star.fill" size={20} color={colors.success} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Total Recebido</Text>
                    <Text className="text-lg font-bold text-foreground mt-1">
                      R$ {stats.totalPaid.toFixed(2)}
                    </Text>
                    <Text className="text-xs text-muted mt-1">{stats.paidCount} indicações</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Abas de Filtro */}
        <View className="px-4 mb-4">
          <View className="flex-row gap-2">
            {(["pending", "approved", "paid"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 rounded-full border ${
                  activeTab === tab
                    ? `bg-primary border-primary`
                    : `bg-surface border-border`
                }`}
              >
                <Text
                  className={`text-center text-sm font-semibold ${
                    activeTab === tab ? "text-white" : "text-foreground"
                  }`}
                >
                  {tab === "pending"
                    ? "Pendentes"
                    : tab === "approved"
                      ? "Aprovadas"
                      : "Pagas"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Lista de Comissões */}
        <View className="px-4 mb-6">
          {filteredCommissions.length === 0 ? (
            <View className="bg-surface rounded-2xl p-8 border border-border items-center">
              <View className="w-16 h-16 rounded-full bg-muted/10 items-center justify-center mb-4">
                <IconSymbol name="paperplane.fill" size={28} color={colors.muted} />
              </View>
              <Text className="text-sm font-semibold text-foreground mb-2">
                Nenhuma comissão {activeTab === "pending" ? "pendente" : activeTab === "approved" ? "aprovada" : "paga"}
              </Text>
              <Text className="text-xs text-muted text-center">
                {activeTab === "pending"
                  ? "Suas comissões aparecerão aqui após aprovação"
                  : "Volte em breve para verificar novas comissões"}
              </Text>
            </View>
          ) : (
            <View className="bg-surface rounded-2xl border border-border overflow-hidden">
              {filteredCommissions.map((commission, idx) => (
                <View
                  key={commission.id}
                  className={`p-4 flex-row items-center justify-between ${
                    idx !== filteredCommissions.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">
                      {commission.referredName}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      Plano {commission.plan === "monthly" ? "Mensal" : commission.plan === "semestral" ? "Semestral" : "Anual"}
                    </Text>
                    <Text className="text-xs text-muted mt-1">{commission.date}</Text>
                  </View>

                  <View className="items-end gap-2">
                    <Text className="text-sm font-bold text-success">
                      +R$ {commission.amount.toFixed(2)}
                    </Text>
                    <View
                      className="px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${getStatusColor(commission.status)}20` }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: getStatusColor(commission.status) }}
                      >
                        {getStatusLabel(commission.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Botão de Saque */}
        {stats.totalApproved > 0 && (
          <View className="px-4 pb-8">
            <TouchableOpacity className="bg-primary rounded-full py-4 active:opacity-80">
              <Text className="text-white text-center text-base font-bold">
                Sacar R$ {stats.totalApproved.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
