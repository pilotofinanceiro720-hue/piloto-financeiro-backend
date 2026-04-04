import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function ProfileScreen() {
  const colors = useColors();

  const menuItems = [
    {
      id: "vehicle",
      title: "Meu Veículo",
      description: "Gerenciar informações do veículo",
      icon: "car",
    },
    {
      id: "planning",
      title: "Planejamento Mensal",
      description: "Definir metas e acompanhar progresso",
      icon: "chart.bar.fill",
    },
    {
      id: "daily-summary",
      title: "Fechamento do Dia",
      description: "Ver resumo e encerrar o dia",
      icon: "calendar",
    },
    {
      id: "settings",
      title: "Configurações",
      description: "Tarifas, preferências e notificações",
      icon: "gear",
    },
  ];

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-6">
          <Text className="text-2xl font-bold text-foreground">Perfil</Text>
          <Text className="text-sm text-muted mt-1">Gerencie suas informações e configurações</Text>
        </View>

        {/* Card de Perfil */}
        <View className="mx-4 mb-6 bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 shadow-lg">
          <View className="flex-row items-center gap-4 mb-4">
            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center">
              <IconSymbol name="person.fill" size={32} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-bold">Motorista</Text>
              <Text className="text-white/80 text-sm">motorista@email.com</Text>
            </View>
          </View>
          
          <View className="bg-white/10 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white/80 text-xs">Assinatura</Text>
              <View className="bg-success/20 px-2 py-1 rounded">
                <Text className="text-white text-xs font-bold">Ativa</Text>
              </View>
            </View>
            <Text className="text-white text-sm font-medium">Plano Mensal</Text>
            <Text className="text-white/60 text-xs mt-1">Renovação em 15 dias</Text>
          </View>
        </View>

        {/* Estatísticas Rápidas */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Este Mês</Text>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs mb-1">Total de Corridas</Text>
              <Text className="text-foreground text-2xl font-bold">248</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-muted text-xs mb-1">Lucro Líquido</Text>
              <Text className="text-success text-2xl font-bold">R$ 4.8k</Text>
            </View>
          </View>
        </View>

        {/* Menu de Opções */}
        <View className="px-4 mb-6">
          <Text className="text-base font-bold text-foreground mb-3">Menu</Text>
          <View className="gap-2">
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="bg-surface rounded-2xl p-4 border border-border active:opacity-70"
                onPress={() => console.log("Navegar para", item.id)}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                      <IconSymbol name={item.icon as any} size={20} color={colors.primary} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">{item.title}</Text>
                      <Text className="text-xs text-muted mt-0.5">{item.description}</Text>
                    </View>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Informações Adicionais */}
        <View className="px-4 mb-6">
          <TouchableOpacity
            className="bg-surface rounded-2xl p-4 border border-border active:opacity-70"
            onPress={() => console.log("Sobre o app")}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-base font-semibold text-foreground">Sobre o Driver Finance</Text>
                <Text className="text-xs text-muted mt-0.5">Versão 1.0.0</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Botão Sair */}
        <View className="px-4 pb-8">
          <TouchableOpacity
            className="bg-error/10 border border-error/20 rounded-2xl py-4 active:opacity-70"
            onPress={() => console.log("Logout")}
          >
            <Text className="text-error text-center text-base font-bold">Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
